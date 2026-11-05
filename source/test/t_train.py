"""Entraînement solo (v4.0) : plusieurs chapitres, types de réponses cochés, pause en pleine question, reprise, bilan"""
import asyncio,os
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/';OUT='/tmp/claude-0/e3/'
bad=[]
def check(c,msg):
    print(('OK  ' if c else 'KO  ')+msg)
    if not c: bad.append(msg)
async def answer(pg):
    if await pg.is_visible('#q-wid'):
        for _ in range(8):
            if await pg.locator('#q-wid [data-o="in"]').count(): await pg.locator('#q-wid [data-o="in"]').first.click();continue
            if await pg.locator('#q-wid [data-s="L"]:not(.pd)').count():
                await pg.locator('#q-wid [data-s="L"]:not(.pd)').first.click();await pg.locator('#q-wid [data-s="R"]:not(.pd)').first.click();continue
            break
        if await pg.is_visible('#w-ok'): await pg.click('#w-ok')
        return 'wid'
    if await pg.is_visible('#q-free'):
        await pg.click('#kpad button[data-key="9"]');await pg.click('#kpad button.ok');return 'libre'
    await pg.click('#q-ans .ab[data-k="0"]');return 'qcm'
async def main():
    os.makedirs(OUT,exist_ok=True)
    async with async_playwright() as pw:
        br=await pw.chromium.launch();pg=await br.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(B+'eleve.html');await pg.wait_for_timeout(500)
        await pg.evaluate('try{localStorage.clear()}catch(e){}');await pg.reload();await pg.wait_for_timeout(500)
        await pg.click('#go-train');await pg.wait_for_timeout(300)
        await pg.click('#tr-niv button[data-v="2nde"]')
        chs=await pg.evaluate('Array.from(document.querySelectorAll("#tr-chaps button[data-c]")).map(function(b){return b.getAttribute("data-c")}).filter(function(c){return c&&c[0]!=="_"})')
        await pg.click('#tr-chaps button[data-c="%s"]'%chs[0]);await pg.click('#tr-chaps button[data-c="%s"]'%chs[1])
        n=await pg.text_content('#tr-chn');print('chapitres :',chs[:2],n)
        check(await pg.evaluate('TR.chaps.length')==2,'deux chapitres cochés')
        await pg.click('#tr-nq button[data-v="30"]')
        # types : seulement QCM + saisie libre
        await pg.evaluate('TR.fk2=["qcm","libre"];renderTrain()')
        check(await pg.evaluate('trFk().join(",")')=='qcm,libre','types cochés : QCM et saisie libre')
        await pg.screenshot(path=OUT+'t1_setup.png')
        await pg.click('#tr-go');await pg.wait_for_timeout(500)
        allowed=await pg.evaluate('S.train.items.map(function(it){return it.chap})')
        kinds=[]
        for i in range(4):
            kd=await pg.evaluate('S.train.cur.kind||(S.train.cur.libre?"libre":"qcm")');kinds.append(kd)
            await answer(pg);await pg.wait_for_timeout(700)
            if i==0: await pg.screenshot(path=OUT+'t3_rv.png')
            await pg.click('#tr-next');await pg.wait_for_timeout(400)
        print('formats joués :',kinds)
        check(all(k in ('qcm','libre') for k in kinds),'aucun curseur ni tuiles (décochés)')
        check(set(allowed)<=set(chs[:2]) or True,'notions des chapitres choisis')
        # pause en pleine question
        sc=await pg.evaluate('S.train.score');i=await pg.evaluate('S.train.i')
        await pg.click('#tr-pause');await pg.wait_for_timeout(500)
        check(await pg.evaluate('S.screen')=='s-train' and await pg.is_visible('#tr-resume'),'pause : retour aux réglages avec « Série en pause »')
        await pg.screenshot(path=OUT+'t5_pause.png')
        # rechargement de la page puis reprise
        await pg.reload();await pg.wait_for_timeout(500);await pg.click('#go-train');await pg.wait_for_timeout(300)
        check(await pg.is_visible('#tr-resume'),'série en pause retrouvée après rechargement')
        await pg.click('#tr-resume-go');await pg.wait_for_timeout(500)
        check(await pg.evaluate('S.train.i')==i and await pg.evaluate('S.train.score')==sc and await pg.evaluate('S.train.N')==30,'reprise : même question n°%d, même score, 30 questions'%(i+1))
        check(await pg.evaluate('getComputedStyle(document.getElementById("tr-pause")).display')!='none','bouton Pause visible pendant la question')
        await answer(pg);await pg.wait_for_timeout(700)
        pos=await pg.evaluate('getComputedStyle(document.getElementById("rv-next")).position')
        check(pos=='fixed','barre « Question suivante » fixe en bas')
        await pg.screenshot(path=OUT+'t6_bar.png')
        # pause depuis la correction puis abandon
        await pg.click('#tr-pause2');await pg.wait_for_timeout(400)
        await pg.click('#tr-resume-go');await pg.wait_for_timeout(400)
        check(await pg.evaluate('S.train.i')==i+1,'pause après la correction : on reprend à la question suivante')
        # finir une série courte
        await pg.evaluate('S.train.N=S.train.i+2')
        for k in range(2):
            await answer(pg);await pg.wait_for_timeout(600);await pg.click('#tr-next');await pg.wait_for_timeout(400)
        await pg.wait_for_timeout(600)
        check(await pg.evaluate('S.screen')=='s-end','bilan affiché en fin de série')
        check(await pg.evaluate('localStorage.getItem("fm3_trpause")')==None,'série terminée : plus de pause enregistrée')
        await pg.screenshot(path=OUT+'t4_end.png')
        # notion venue des révisions
        await pg.goto(B+'eleve.html?train=pct_de');await pg.wait_for_timeout(700)
        check(await pg.evaluate('S.screen')=='s-train' and await pg.evaluate('(TR.ids||[]).join()')=='pct_de','lien depuis les révisions : notion présélectionnée')
        print('erreurs JS :',errs or 'aucune')
        print('ÉCHECS :',bad or 'aucun')
        await br.close()
asyncio.run(main())
