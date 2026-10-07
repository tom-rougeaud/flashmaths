"""e2e v3.3 : QR plein écran, mode auto (boss par défaut, bascule en jeu), réponses par joueur,
écourter (compte à rebours / question), équilibre Classe VS Prof, quitter la salle, inactivité, logo"""
import asyncio
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/';OUT='/tmp/claude-0/e3/v33_'
import os
MOCK=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'mock_rt.js')).read()
CLR='try{localStorage.removeItem("fm3_sess");localStorage.removeItem("fm3_pseudo")}catch(e){}'
errs=[]
def watch(p,n):
    p.on('pageerror',lambda e:errs.append(n+' '+str(e)))
    p.on('console',lambda m:errs.append(n+' '+m.text) if m.type=='error' else None)
async def stud(ctx,code,name,w=390):
    s=await ctx.new_page();watch(s,name);await s.add_init_script(CLR);await s.set_viewport_size({'width':w,'height':800})
    await s.goto(B+'eleve.html?c='+code);await s.wait_for_timeout(500);await s.fill('#ps-in',name);await s.click('#ps-go');await s.wait_for_timeout(400);return s
async def open_room(prof,mode,nq=3):
    await prof.evaluate('P.read=0;P.sel=["tables","pct_mental"];P.vary=false;P.est=false;P.nq=%d;P.mode="%s";P.auto=false;P.dur=15;saveSetup();refreshAll()'%(nq,mode))
    await prof.click('#b-gen');await prof.wait_for_timeout(300);await prof.click('#b-open');await prof.wait_for_timeout(900)
    return (await prof.text_content('#lb-code')).strip()
async def answer_all(prof,studs,good):
    q=await prof.evaluate('(function(){var q=G.qs[G.i];return {ans:q.ans,n:q.choices.length}})()')
    for k,s in enumerate(studs):
        g=good[k] if isinstance(good,list) else good
        await s.click('#q-ans .ab[data-k="%d"]'%(q['ans'] if g else (q['ans']+1)%q['n']))
async def main():
    async with async_playwright() as pw:
        br=await pw.chromium.launch();ctx=await br.new_context();await ctx.add_init_script(MOCK)
        prof=await ctx.new_page();watch(prof,'PROF');await prof.set_viewport_size({'width':1366,'height':860})
        await prof.goto(B+'prof.html');await prof.wait_for_timeout(600)
        print('logo en-tête :',await prof.evaluate('document.querySelector(".brand img").naturalWidth'))
        # ── 1. duel : QR plein écran, réponses par équipe, auto en jeu
        code=await open_room(prof,'duel')
        await prof.click('#lb-qrbig');await prof.wait_for_timeout(300);await prof.screenshot(path=OUT+'qr_full.png')
        print('QR plein écran visible :',await prof.is_visible('#m-qrbig'))
        await prof.keyboard.press('Escape');await prof.wait_for_timeout(200);print('fermé par Échap :',not await prof.is_visible('#m-qrbig'))
        s=[await stud(ctx,code,n) for n in ['Léa','Hugo','Nina']]
        await prof.evaluate('plist().forEach(function(p,i){p.team=i%2});renderLobby();pushLobby()')
        await prof.click('#lb-start');await prof.wait_for_timeout(400)
        print('auto au départ (duel, réglage non) :',await prof.evaluate('G.auto'))
        await prof.click('#ru-go');await prof.wait_for_timeout(3600)
        await answer_all(prof,s,[True,False,True]);await prof.wait_for_timeout(2500)
        await prof.click('#g-ansall');await prof.wait_for_timeout(300);await prof.screenshot(path=OUT+'answers_duel.png')
        print('réponses par équipe :',(await prof.text_content('#ma-list'))[:160])
        await prof.click('#m-ans .x')
        await prof.click('#g-auto');await prof.wait_for_timeout(1300)
        print('auto activé en jeu → bouton suivant :',(await prof.text_content('#g-next')).strip())
        await prof.click('#g-auto');await prof.wait_for_timeout(1300)
        print('auto désactivé → bouton suivant :',(await prof.text_content('#g-next')).strip())
        # écourter pendant la question suivante (double clic de confirmation)
        await prof.click('#g-next');await prof.wait_for_timeout(500)
        await prof.click('#g-short');await prof.wait_for_timeout(300);print('écourter armé :',(await prof.text_content('#g-short')).strip())
        await prof.click('#g-short');await prof.wait_for_timeout(1500)
        print('après écourter : phase',await prof.evaluate('G.phase'),'| questions comptées',await prof.evaluate('G.hist.filter(function(h){return h}).length'))
        await prof.wait_for_timeout(5000)
        await prof.click('#end-new');await prof.wait_for_timeout(500)
        # ── 2. écourter pendant le compte à rebours : retour à la salle, pas de question fantôme
        code=await open_room(prof,'solo')
        s2=[await stud(ctx,code,n) for n in ['Ana','Bob']]
        await prof.click('#lb-start');await prof.wait_for_timeout(400);await prof.click('#ru-go');await prof.wait_for_timeout(600)
        await prof.click('#g-short');await prof.click('#g-short');await prof.wait_for_timeout(3500)
        print('écourter pendant 3-2-1 : phase',await prof.evaluate('G.phase'),'| écran',await prof.evaluate('["s-lobby","s-game","s-end"].filter(function(i){return !$(i).classList.contains("hidden")})[0]'),'| élève :',await s2[0].evaluate('S.screen'))
        # élève : bouton « Quitter la salle » (double confirmation)
        await s2[1].click('#lb-leave');await s2[1].click('#lb-leave');await s2[1].wait_for_timeout(400)
        print('élève parti : écran',await s2[1].evaluate('S.screen'),'| canal',await s2[1].evaluate('!!S.ch'))
        await s2[1].screenshot(path=OUT+'stud_left.png')
        # inactivité élève (simulée)
        await s2[0].evaluate('IDLE_LAST=Date.now()-21*60000');await s2[0].wait_for_timeout(31000)
        print('élève inactif 21 min : écran',await s2[0].evaluate('S.screen'),'|',(await s2[0].text_content('#code-err')).strip())
        await prof.evaluate('closeRoom();show("s-pick")');await prof.wait_for_timeout(500)
        # ── 3. Classe VS Prof : auto par défaut, équilibre 50 %
        code=await open_room(prof,'boss',nq=4)
        s3=[await stud(ctx,code,n) for n in ['Jade','Malo']]
        await prof.click('#lb-start');await prof.wait_for_timeout(400)
        print('boss : auto au départ :',await prof.evaluate('G.auto'))
        await prof.click('#ru-go');await prof.wait_for_timeout(3600)
        await answer_all(prof,s3,[True,False]);await prof.wait_for_timeout(2600)
        b=await prof.evaluate('G.boss');print('boss après 1 q à 50 %% : prof %.1f / classe %.1f (dégâts prof / classe = %.2f)'%(b['pp'],b['pc'],(100-b['pp'])/max(0.01,100-b['pc'])))
        await prof.screenshot(path=OUT+'boss_rv.png')
        await s3[0].screenshot(path=OUT+'boss_stud_rv.png')
        # inactivité prof (simulée)
        await prof.evaluate('IDLE_LAST=Date.now()-21*60000');await prof.wait_for_timeout(21000)
        print('prof inactif 21 min : salle fermée ?',await prof.evaluate('G===null'))
        await br.close()
asyncio.run(main())
print('\n'.join(errs[:20]) or 'aucune erreur JS')
