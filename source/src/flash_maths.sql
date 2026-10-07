-- ═══════════════════════════════════════════════════════════════════
--  FLASH MATHS v3.1 — base de données Supabase (schéma version 4) (à coller UNE FOIS dans
--  Supabase › SQL Editor › New query, puis cliquer « Run »)
--
--  Ce que la base conserve :
--   • fm_rooms   : les salles ouvertes (code à 4 caractères, mode, état).
--                  Supprimées automatiquement 4 h après la dernière activité.
--   • fm_players : les prénoms ou pseudos connectés à une salle (30 au maximum).
--                  Supprimés avec la salle.
--   • fm_results : le bilan pseudonyme des parties terminées, rattaché à la
--                  « clé enseignant » (stockée hachée). Supprimé après 30 jours.
--  Aucun nom, aucune adresse e-mail, aucune adresse IP n’est enregistré.
--
--  Sécurité : les tables sont fermées (RLS sans aucune règle d’accès).
--  Les pages ne peuvent agir QUE par les fonctions ci-dessous, qui
--  vérifient chaque action (jeton de salle, limite de 30, pseudo libre…).
--
--  Le script peut être relancé sans risque (mise à jour de version).
-- ═══════════════════════════════════════════════════════════════════

-- ─── Tables ───────────────────────────────────────────────────────
create table if not exists public.fm_rooms (
  code        text primary key check (code ~ '^[0-9A-F]{4}$'),
  host_token  uuid not null,
  mode        text not null default 'duel' check (mode in ('solo','duel','boss')),
  status      text not null default 'open' check (status in ('open','playing','ended')),
  max_players int  not null default 30 check (max_players between 1 and 30),
  created_at  timestamptz not null default now(),
  last_seen   timestamptz not null default now()
);

create table if not exists public.fm_players (
  id         uuid primary key default gen_random_uuid(),
  room_code  text not null references public.fm_rooms(code) on delete cascade,
  pseudo     text not null check (char_length(pseudo) between 2 and 16),
  joined_at  timestamptz not null default now(),
  last_seen  timestamptz not null default now()
);
create unique index if not exists fm_players_pseudo_uq on public.fm_players (room_code, lower(pseudo));
create index if not exists fm_players_room_idx on public.fm_players (room_code);

create table if not exists public.fm_results (
  id           uuid primary key default gen_random_uuid(),
  teacher_hash text not null,
  room_code    text,
  mode         text,
  title        text,
  played_at    timestamptz not null default now(),
  summary      jsonb not null check (octet_length(summary::text) < 300000)
);
create index if not exists fm_results_teacher_idx on public.fm_results (teacher_hash, played_at desc);

-- Tables fermées : aucun accès direct depuis les pages
alter table public.fm_rooms   enable row level security;
alter table public.fm_players enable row level security;
alter table public.fm_results enable row level security;
revoke all on public.fm_rooms, public.fm_players, public.fm_results from anon, authenticated;

-- ─── Outils internes ──────────────────────────────────────────────
create or replace function public.fm_hash(p_key text) returns text
language sql immutable as $$
  select encode(sha256(convert_to('flash-maths:' || coalesce(p_key,''), 'UTF8')), 'hex')
$$;

create or replace function public.fm_purge() returns void
language plpgsql security definer set search_path = public as $$
begin
  delete from fm_rooms   where last_seen < now() - interval '4 hours';
  delete from fm_results where played_at < now() - interval '30 days';
end $$;

create or replace function public.fm_clean_pseudo(p text) returns text
language sql immutable as $$
  select btrim(regexp_replace(regexp_replace(coalesce(p,''), '[<>"''`{}\\[:cntrl:]]', '', 'g'), '\s+', ' ', 'g'))
$$;

-- ─── Diagnostic (bouton « Tester la connexion » de la page prof) ──
create or replace function public.fm_ping() returns json
language plpgsql security definer set search_path = public as $$
begin
  return json_build_object('ok', true, 'version', 4,
    'rooms', (select count(*) from fm_rooms where last_seen > now() - interval '10 minutes'));
end $$;

-- ─── Salles (côté prof) ───────────────────────────────────────────
create or replace function public.fm_create_room(p_mode text default 'duel', p_max int default 30) returns json
language plpgsql security definer set search_path = public as $$
declare v_code text; v_tok uuid := gen_random_uuid(); i int := 0;
begin
  perform fm_purge();
  if (select count(*) from fm_rooms) >= 3000 then
    return json_build_object('ok', false, 'err', 'too_many_rooms');
  end if;
  if p_mode not in ('solo','duel','boss') then p_mode := 'duel'; end if;
  loop
    i := i + 1;
    v_code := upper(lpad(to_hex(floor(random() * 65536)::int), 4, '0'));
    -- pas de code palindrome, ni de code dont l’envers est déjà utilisé (code prof)
    if v_code = reverse(v_code) or exists (select 1 from fm_rooms where code = reverse(v_code)) then
      if i > 200 then return json_build_object('ok', false, 'err', 'no_code'); end if;
      continue;
    end if;
    begin
      insert into fm_rooms(code, host_token, mode, max_players)
      values (v_code, v_tok, p_mode, least(greatest(coalesce(p_max, 30), 1), 30));
      exit;
    exception when unique_violation then
      if i > 200 then return json_build_object('ok', false, 'err', 'no_code'); end if;
    end;
  end loop;
  return json_build_object('ok', true, 'code', v_code, 'token', v_tok);
end $$;

-- Code saisi sur la page élève : salle d’élèves, accès du prof (mode Classe VS Prof) ou rien.
create or replace function public.fm_check(p_code text) returns json
language plpgsql security definer set search_path = public as $$
declare r fm_rooms;
begin
  select * into r from fm_rooms where code = upper(p_code) and last_seen > now() - interval '4 hours';
  if found then
    return json_build_object('kind', case when r.status = 'ended' then 'ended' else 'room' end, 'mode', r.mode);
  end if;
  select * into r from fm_rooms where code = reverse(upper(p_code)) and mode = 'boss' and last_seen > now() - interval '4 hours';
  if found then return json_build_object('kind', 'host', 'code', r.code); end if;
  return json_build_object('kind', 'none');
end $$;

-- Battement de cœur du prof : garde la salle en vie, change son état,
-- renvoie les élèves réellement présents.
create or replace function public.fm_host_ping(p_code text, p_token uuid, p_status text default null, p_mode text default null) returns json
language plpgsql security definer set search_path = public as $$
declare r fm_rooms;
begin
  update fm_rooms set last_seen = now(),
         status = coalesce(case when p_status in ('open','playing','ended') then p_status end, status),
         mode   = coalesce(case when p_mode in ('solo','duel','boss') then p_mode end, mode)
   where code = upper(p_code) and host_token = p_token
  returning * into r;
  if not found then return json_build_object('ok', false, 'err', 'not_found'); end if;
  return json_build_object('ok', true, 'status', r.status, 'max', r.max_players,
    'players', coalesce((select json_agg(json_build_object('id', id, 'p', pseudo) order by joined_at)
                         from fm_players where room_code = r.code and last_seen > now() - interval '2 minutes'), '[]'::json));
end $$;

create or replace function public.fm_kick(p_code text, p_token uuid, p_player uuid) returns json
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from fm_rooms where code = upper(p_code) and host_token = p_token) then
    return json_build_object('ok', false, 'err', 'not_found');
  end if;
  delete from fm_players where id = p_player and room_code = upper(p_code);
  return json_build_object('ok', true);
end $$;

create or replace function public.fm_close_room(p_code text, p_token uuid) returns json
language plpgsql security definer set search_path = public as $$
begin
  delete from fm_rooms where code = upper(p_code) and host_token = p_token;
  return json_build_object('ok', found);
end $$;

-- ─── Élèves ───────────────────────────────────────────────────────
-- Rejoindre : vérifie la salle, la limite (30 au plus), le pseudo libre.
-- p_player : identifiant déjà attribué (reconnexion après une coupure).
create or replace function public.fm_join(p_code text, p_pseudo text, p_player uuid default null) returns json
language plpgsql security definer set search_path = public as $$
declare r fm_rooms; v_ps text := fm_clean_pseudo(p_pseudo); v_n int; v_id uuid;
begin
  if char_length(v_ps) < 2 or char_length(v_ps) > 16 then
    return json_build_object('ok', false, 'err', 'pseudo_invalid');
  end if;
  select * into r from fm_rooms where code = upper(p_code) for update;
  if not found or r.last_seen < now() - interval '4 hours' then
    return json_build_object('ok', false, 'err', 'not_found');
  end if;
  if r.status = 'ended' then return json_build_object('ok', false, 'err', 'ended'); end if;

  -- reconnexion : même joueur, sa place est conservée
  if p_player is not null and exists (select 1 from fm_players where id = p_player and room_code = r.code) then
    if exists (select 1 from fm_players where room_code = r.code and lower(pseudo) = lower(v_ps) and id <> p_player
               and last_seen > now() - interval '2 minutes') then
      return json_build_object('ok', false, 'err', 'pseudo_taken');
    end if;
    delete from fm_players where room_code = r.code and lower(pseudo) = lower(v_ps) and id <> p_player;
    update fm_players set pseudo = v_ps, last_seen = now() where id = p_player;
    return json_build_object('ok', true, 'id', p_player, 'pseudo', v_ps, 'mode', r.mode, 'status', r.status);
  end if;

  -- places libérées par les élèves partis sans prévenir
  delete from fm_players where room_code = r.code and last_seen < now() - interval '2 minutes';

  select count(*) into v_n from fm_players where room_code = r.code;
  if v_n >= r.max_players then
    return json_build_object('ok', false, 'err', 'full', 'max', r.max_players);
  end if;
  if exists (select 1 from fm_players where room_code = r.code and lower(pseudo) = lower(v_ps)) then
    return json_build_object('ok', false, 'err', 'pseudo_taken');
  end if;
  v_id := coalesce(p_player, gen_random_uuid());
  insert into fm_players(id, room_code, pseudo) values (v_id, r.code, v_ps);
  return json_build_object('ok', true, 'id', v_id, 'pseudo', v_ps, 'mode', r.mode, 'status', r.status);
end $$;

create or replace function public.fm_player_ping(p_player uuid) returns json
language plpgsql security definer set search_path = public as $$
begin
  update fm_players set last_seen = now() where id = p_player;
  return json_build_object('ok', found);
end $$;

create or replace function public.fm_leave(p_player uuid) returns json
language plpgsql security definer set search_path = public as $$
begin
  delete from fm_players where id = p_player;
  return json_build_object('ok', true);
end $$;

-- ─── Historique pseudonyme (30 jours) ─────────────────────────────
create or replace function public.fm_save_result(p_code text, p_token uuid, p_key text, p_mode text, p_title text, p_summary jsonb) returns json
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if char_length(coalesce(p_key,'')) < 16 then return json_build_object('ok', false, 'err', 'key'); end if;
  if not exists (select 1 from fm_rooms where code = upper(p_code) and host_token = p_token) then
    return json_build_object('ok', false, 'err', 'not_found');
  end if;
  if (select count(*) from fm_results where teacher_hash = fm_hash(p_key)) >= 500 then
    delete from fm_results where id in (select id from fm_results where teacher_hash = fm_hash(p_key) order by played_at asc limit 1);
  end if;
  insert into fm_results(teacher_hash, room_code, mode, title, summary)
  values (fm_hash(p_key), upper(p_code), left(p_mode, 10), left(p_title, 120), p_summary)
  returning id into v_id;
  return json_build_object('ok', true, 'id', v_id);
end $$;

create or replace function public.fm_list_results(p_key text) returns json
language plpgsql security definer set search_path = public as $$
begin
  perform fm_purge();
  return coalesce((select json_agg(json_build_object('id', id, 'at', played_at, 'code', room_code, 'mode', mode, 'title', title,
                    'n', summary->'n', 'nq', summary->'nq', 'rate', summary->'rate') order by played_at desc)
                   from fm_results where teacher_hash = fm_hash(p_key)), '[]'::json);
end $$;

create or replace function public.fm_get_result(p_key text, p_id uuid) returns json
language plpgsql security definer set search_path = public as $$
begin
  return (select summary::json from fm_results where id = p_id and teacher_hash = fm_hash(p_key));
end $$;

create or replace function public.fm_delete_result(p_key text, p_id uuid) returns json
language plpgsql security definer set search_path = public as $$
begin
  delete from fm_results where id = p_id and teacher_hash = fm_hash(p_key);
  return json_build_object('ok', found);
end $$;

-- ─── Droits : seules les fonctions publiques sont appelables ──────
revoke execute on function
  public.fm_purge(), public.fm_hash(text), public.fm_clean_pseudo(text),
  public.fm_ping(), public.fm_check(text), public.fm_create_room(text, int), public.fm_host_ping(text, uuid, text, text),
  public.fm_kick(text, uuid, uuid), public.fm_close_room(text, uuid), public.fm_join(text, text, uuid),
  public.fm_player_ping(uuid), public.fm_leave(uuid),
  public.fm_save_result(text, uuid, text, text, text, jsonb), public.fm_list_results(text),
  public.fm_get_result(text, uuid), public.fm_delete_result(text, uuid)
from public, anon, authenticated;
grant execute on function
  public.fm_ping(),
  public.fm_check(text),
  public.fm_create_room(text, int),
  public.fm_host_ping(text, uuid, text, text),
  public.fm_kick(text, uuid, uuid),
  public.fm_close_room(text, uuid),
  public.fm_join(text, text, uuid),
  public.fm_player_ping(uuid),
  public.fm_leave(uuid),
  public.fm_save_result(text, uuid, text, text, text, jsonb),
  public.fm_list_results(text),
  public.fm_get_result(text, uuid),
  public.fm_delete_result(text, uuid)
to anon, authenticated;

-- Vérification : doit afficher {"ok" : true, "version" : 3, ...}
select public.fm_ping();
