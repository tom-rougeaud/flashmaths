"""v4.0 : Mêlée entre élèves (sans prof) — création, salon, notions, prêt(e)s, partie, classement, revanche, reprise après rechargement"""
import asyncio,os,json
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/';OUT='/tmp/claude-0/e3/mel_'
MOCK=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'mock_rt.js')).read()
errs=[];bad=[]
def check(c,msg):
    print(('OK  ' if c else 'KO  ')+msg)
    if not c: bad.append(msg)
def watch(p,n):
    p.on('pageerror',lambda e:errs.append(n+' '+str(e)))
    p.on('console',lambda m:errs.append(n+' '+m.text) if m.type=='error' else None)
async def pick(s,item):
    await s.click('#mel-th');await s.wait_for_timeout(200)
    await s.fill('#mp-s',item);await s.wait_for_timeout(200)
    await s.locator('.mel-it').first.click();await s.wait_for_timeout(200)
async def answer(s):
    if await s.is_visible('#q-ans .ab[data-k="0"]'):
        if await s.is_visible('#q-mok'):
            await s.click('#q-ans .ab[data-k="0"]');await s.click('#q-mok')
        else: await s.click('#q-ans .ab[data-k="0"]')
    elif await s.is_visible('#q-wid'):
        for _ in range(8):
            if await s.locator('#q-wid [data-o="in"]').count(): await s.locator('#q-wid [data-o="in"]').first.click();continue
            if await s.locator('#q-wid [data-s="L"]:not(.pd)').count():
                await s.locator('#q-wid [data-s="L"]:not(.pd)').first.click();await s.locator('#q-wid [data-s="R"]:not(.pd)').first.click();continue
            break
        if await s.is_visible('#w-ok'): await s.click('#w-ok')
async def main():
    os.makedirs('/tmp/claude-0/e3',exist_ok=True)
    async with async_playwright() as pw:
        br=await pw.chromium.launch();ctx=await br.new_context(viewport={'width':390,'height':844});await ctx.add_init_script(MOCK)
        a=await ctx.new_page();watch(a,'Lina')
        await a.goto(B+'eleve.html');await a.wait_for_timeout(500)
        check(await a.is_visible('#go-melee'),'bouton « Mêlée entre élèves » sur l’écran du code')
        await a.click('#go-melee');await a.wait_for_timeout(300)
        check('mêlée' in (await a.text_content('#ps-code')).lower(),'écran du prénom : nouvelle mêlée')
        await a.fill('#ps-in','Lina');await a.click('#ps-go');await a.wait_for_timeout(1500)
        code=await a.evaluate('S.code');print('code',code)
        check(await a.evaluate('!!MEL.eng') and await a.evaluate('S.melee'),'Lina crée la mêlée et la fait tourner')
        check(await a.is_visible('#mel-qr svg'),'QR code d’invitation affiché')
        await a.screenshot(path=OUT+'a_lobby.png',full_page=True)
        b=await ctx.new_page();watch(b,'Sami')
        # (test : un seul navigateur, stockage partagé ; sur de vrais téléphones chacun a le sien)
        await b.add_init_script('try{localStorage.removeItem("fm3_melhost");localStorage.removeItem("fm3_sess")}catch(e){}')
        await b.goto(B+'eleve.html?c='+code);await b.wait_for_timeout(600);await b.fill('#ps-in','Sami');await b.click('#ps-go');await b.wait_for_timeout(1200)
        check(await b.evaluate('S.melee') and await b.evaluate('(S.lb.pl||[]).length')==2,'Sami rejoint la mêlée (2 joueur(euse)s)')
        await pick(a,'pourcentage');await pick(b,'relatifs')
        await b.screenshot(path=OUT+'b_lobby.png',full_page=True)
        th=await a.evaluate('S.mel.th');print('notion de Lina :',th)
        await a.click('#mel-nq button[data-n="5"]');await b.click('#mel-nq button[data-n="5"]')
        await a.click('#mel-rdy');await a.wait_for_timeout(300)
        check(await a.evaluate('MEL.eng.phase')=='lobby','la partie attend que tout le monde soit prêt(e)')
        await b.click('#mel-rdy');await a.wait_for_timeout(5500)
        check(await a.evaluate('MEL.eng.phase')=='q','tout le monde est prêt(e) : la partie démarre')
        N=await a.evaluate('MEL.eng.qs.length');ids=await a.evaluate('MEL.eng.qs.map(function(q){return q.id})')
        print('questions :',N,ids)
        check(N==5,'5 questions (vote)')
        await b.screenshot(path=OUT+'b_q0.png')
        for qi in range(N):
            await answer(a);await answer(b);await a.wait_for_timeout(1600)
            check(await b.evaluate('S.screen')=='s-rv','question %d : correction affichée'%(qi+1))
            if qi==0:
                check(await b.is_visible('.mel-board'),'classement après la question')
                await b.screenshot(path=OUT+'b_rv.png',full_page=True)
                # reprise après rechargement chez le créateur
                await a.reload();await a.wait_for_timeout(2500)
                check(await a.evaluate('!!MEL.eng'),'Lina recharge la page : la partie reprend sur son téléphone')
            await a.wait_for_timeout(7600)
        await a.wait_for_timeout(1500)
        check(await b.evaluate('S.screen')=='s-end','fin de partie : podium')
        sc=await a.evaluate('JSON.stringify(Object.keys(MEL.eng.players).map(function(k){var p=MEL.eng.players[k];return [p.p,p.score]}))');print('scores',sc)
        await b.screenshot(path=OUT+'b_end.png',full_page=True)
        await b.click('#end-rm');await a.wait_for_timeout(1200)
        check(await a.evaluate('MEL.eng.phase')=='lobby' and await b.evaluate('S.screen')=='s-lobby','revanche : retour au salon')
        await b.click('#lb-leave') if await b.is_visible('#lb-leave') else None
        await br.close()
    print('erreurs JS :',errs or 'aucune')
    print('ÉCHECS :',bad or 'aucun')
asyncio.run(main())
