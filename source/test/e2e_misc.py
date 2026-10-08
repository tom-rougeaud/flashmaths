import asyncio,subprocess,json
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/';OUT='/tmp/claude-0/e3/'
import os
MOCK=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'mock_rt.js')).read()
errs=[]
def watch(p,n): p.on('pageerror',lambda e:errs.append(n+' '+str(e)))
def psql(sql): return subprocess.run(['psql','-h','/tmp','-p','5433','-U','postgres','-qAtc',sql],capture_output=True,text=True).stdout.strip()
async def openroom(ctx,mode):
    p=await ctx.new_page();watch(p,'prof-'+mode);await p.set_viewport_size({'width':1280,'height':800})
    await p.goto(B+'prof.html');await p.wait_for_timeout(500)
    await p.evaluate('P.read=0;P.sel=["lit_dev","lit_reduire","cc_signes"];P.mode="%s";P.fmt="libre";P.nq=3;saveSetup();refreshAll()'%mode)
    await p.click('#b-gen');await p.wait_for_timeout(300);await p.click('#b-open');await p.wait_for_timeout(900)
    return p,(await p.text_content('#lb-code')).strip()
async def join(ctx,code,ps,view=None):
    s=await ctx.new_page();watch(s,ps);await s.set_viewport_size(view or {'width':390,'height':844})
    await s.add_init_script('try{localStorage.removeItem("fm3_sess")}catch(e){}')
    await s.goto(B+'eleve.html?c='+code);await s.wait_for_timeout(300);await s.fill('#ps-in',ps);await s.click('#ps-go');await s.wait_for_timeout(600);return s
async def main():
    async with async_playwright() as pw:
        br=await pw.chromium.launch();ctx=await br.new_context();await ctx.add_init_script(MOCK)
        # deux salles en parallèle
        p1,c1=await openroom(ctx,'solo');p2,c2=await openroom(ctx,'duel')
        print('salles',c1,c2,'différentes',c1!=c2)
        a=await join(ctx,c1,'Alpha');b=await join(ctx,c2,'Bravo')
        await p1.wait_for_timeout(500)
        print('salle1 joueurs',await p1.evaluate('plist().map(function(p){return p.p})'),'salle2',await p2.evaluate('plist().map(function(p){return p.p})'))
        # remplir la salle 1 jusqu’à 30 dans la base puis tenter 2 élèves
        rid=psql("select count(*) from fm_players where room_code='%s'"%c1)
        psql("insert into fm_players(room_code,pseudo) select '%s','Fantome'||g from generate_series(1,%d) g"%(c1,30-1-int(rid)+1))
        print('en base',psql("select count(*) from fm_players where room_code='%s'"%c1))
        x=await ctx.new_page();await x.add_init_script('try{localStorage.removeItem("fm3_sess")}catch(e){}');await x.goto(B+'eleve.html?c='+c1);await x.wait_for_timeout(300)
        await x.fill('#ps-in','Retard');await x.click('#ps-go');await x.wait_for_timeout(700)
        print('31e élève ->',await x.text_content('#ps-err'));await x.screenshot(path=OUT+'x_full.png')
        psql("delete from fm_players where pseudo like 'Fantome%%'")
        # salle 1 : questions littérales en saisie libre, vue PC élève
        s=await join(ctx,c1,'Charlie',{'width':1280,'height':800});await s.click('#vsw button[data-v="pc"]')
        await p1.click('#lb-start');await p1.wait_for_timeout(500);await p1.click('#ru-go');await p1.wait_for_timeout(3700)
        await s.screenshot(path=OUT+'x_pc_q.png')
        for i in range(3):
            q=await p1.evaluate('(function(){var q=G.qs[G.i];return {lit:q.lit||null,num:q.num===undefined?null:q.num,libre:!!q.libre,ans:q.ans,shown:q.choices[q.ans].t}})()')
            print('q',q)
            for st in (a,s):
                if q['libre']:
                    txt=q['shown'].replace('$','').replace(' ','')
                    if st is s and q['lit']: txt='+'.join(reversed(txt.replace('-','+-').split('+'))).replace('+-','-').lstrip('+') if '+' in txt else txt
                    await st.screenshot(path=OUT+'x_lit_%d.png'%i) if st is a and i==0 else None
                    for ch in txt:
                        k={'-':'−'}.get(ch,ch)
                        await st.click('#kpad button[data-key="%s"]'%k)
                    await st.click('#kpad button.ok')
                elif await st.is_visible('#q-ans .ab[data-k="0"]'): await st.click('#q-ans .ab[data-k="%d"]'%q['ans'])
            await p1.wait_for_timeout(1500);print('justes',await p1.evaluate('Object.keys(G.ans).map(function(k){return G.players[k].p+":"+G.ans[k].ok+":"+(G.ans[k].v||"")})'))
            await p1.click('#g-next')
        await p1.wait_for_timeout(1500)
        # prof en vue mobile
        await p2.set_viewport_size({'width':390,'height':844});await p2.click('#vsw button[data-v="mob"]');await p2.wait_for_timeout(300);await p2.screenshot(path=OUT+'x_prof_mob_lobby.png',full_page=True)
        await p2.click('#lb-start');await p2.wait_for_timeout(500);await p2.click('#ru-go');await p2.wait_for_timeout(3700);await p2.screenshot(path=OUT+'x_prof_mob_q.png',full_page=True)
        # page élève sans config
        await br.close()
        br=await pw.chromium.launch();pg=await br.new_page(viewport={'width':1280,'height':800})
        await pg.route('**/config.js',lambda r:r.fulfill(status=200,content_type='application/javascript',body='var FLASH_CONFIG={SUPABASE_URL:"",SUPABASE_ANON_KEY:""};'))
        await pg.goto(B+'prof.html');await pg.wait_for_timeout(500);await pg.screenshot(path=OUT+'x_noconf.png')
        await pg.evaluate('P.read=0;P.sel=["cc_signes"];saveSetup();refreshAll()');await pg.click('#b-gen');await pg.wait_for_timeout(300);await pg.click('#b-open');await pg.wait_for_timeout(400);await pg.screenshot(path=OUT+'x_diag.png')
        for name in ['index','contact','confidentialite']:
            await pg.goto(B+name+'.html');await pg.wait_for_timeout(400);await pg.screenshot(path=OUT+'x_'+name+'.png',full_page=True)
        await pg.set_viewport_size({'width':390,'height':844});await pg.goto(B+'index.html');await pg.wait_for_timeout(300);await pg.screenshot(path=OUT+'x_index_mob.png')
        await br.close()
asyncio.run(main())
print('\n'.join(errs) or 'aucune erreur JS')
