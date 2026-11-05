"""v4.0 : pari de certitude (×2 si juste, −300 si faux, score jamais négatif), règles, bilan prof, CSV"""
import asyncio,os
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/';OUT='/tmp/claude-0/e3/v40_'
MOCK=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'mock_rt.js')).read()
errs=[];bad=[]
def check(c,msg):
    print(('OK  ' if c else 'KO  ')+msg)
    if not c: bad.append(msg)
def watch(p,n):
    p.on('pageerror',lambda e:errs.append(n+' '+str(e)))
    p.on('console',lambda m:errs.append(n+' '+m.text) if m.type=='error' else None)
async def join(ctx,code,name):
    s=await ctx.new_page();watch(s,name);await s.set_viewport_size({'width':390,'height':844})
    await s.add_init_script('try{localStorage.removeItem("fm3_sess");localStorage.removeItem("fm3_pseudo")}catch(e){}')
    await s.goto(B+'eleve.html?c='+code);await s.wait_for_timeout(500);await s.fill('#ps-in',name);await s.click('#ps-go');await s.wait_for_timeout(500);return s
async def main():
    os.makedirs('/tmp/claude-0/e3',exist_ok=True)
    async with async_playwright() as pw:
        br=await pw.chromium.launch();ctx=await br.new_context();await ctx.add_init_script(MOCK)
        prof=await ctx.new_page();watch(prof,'PROF');await prof.set_viewport_size({'width':1366,'height':800})
        await prof.goto(B+'prof.html');await prof.wait_for_timeout(600)
        await prof.evaluate('P.read=0;P.sel=["relatifs","pct_mental"];P.nq=3;P.fmt="qcm";P.dur=20;P.mode="solo";P.auto=false;P.vary=false;P.est=false;P.pts="juste";saveSetup();refreshAll()')
        await prof.click('#acc-set summary') if await prof.is_visible('#acc-set summary') else None
        await prof.evaluate('$("o-bet").click()')
        check(await prof.evaluate('P.bet')==True,'réglage « Pari de certitude » activé')
        await prof.click('#b-gen');await prof.wait_for_timeout(400);await prof.click('#b-open');await prof.wait_for_timeout(900)
        code=(await prof.text_content('#lb-code')).strip()
        a=await join(ctx,code,'Lina');b=await join(ctx,code,'Sami');c=await join(ctx,code,'Noa')
        await prof.click('#lb-start');await prof.wait_for_timeout(600)
        rules=await prof.text_content('#rules-box')
        check('Pari de certitude' in rules,'règles du tableau : pari annoncé')
        check('Pari de certitude' in await a.evaluate('document.body.innerText'),'règles sur le téléphone : pari annoncé')
        await prof.click('#ru-go');await prof.wait_for_timeout(3900)
        q=await prof.evaluate('(function(){var q=G.qs[G.i];return {ans:q.ans,n:q.choices.length}})()')
        check(await a.is_visible('#q-bet'),'bouton « Je suis sûr(e) » visible')
        await a.screenshot(path=OUT+'s_bet.png')
        # Lina : sûre et juste ; Sami : sûr et faux ; Noa : pas de pari, juste
        await a.click('#q-bet');await a.click('#q-ans .ab[data-k="%d"]'%q['ans'])
        await b.click('#q-bet');await b.click('#q-ans .ab[data-k="%d"]'%((q['ans']+1)%q['n']))
        await c.click('#q-ans .ab[data-k="%d"]'%q['ans'])
        await prof.wait_for_timeout(1800)
        sc=await prof.evaluate('JSON.stringify(plist().map(function(p){return [p.p,p.score,p.ans[0].pts,p.ans[0].bt]}))')
        print('scores Q1 :',sc)
        S=dict((x[0],x) for x in __import__('json').loads(sc))
        check(S['Lina'][2]==2000 and S['Noa'][2]==1000,'pari gagné : points ×2 (2 000 contre 1 000 sans pari)')
        check(S['Sami'][2]==-300 and S['Sami'][1]==0,'pari perdu : −300, mais le score ne descend pas sous 0')
        txt=await prof.text_content('#g-rev')
        check('dans l’erreur' in txt and 'Sami' not in txt.split('sûr(e)')[0][-40:],'tableau : nombre de paris ratés, sans nom projeté')
        await prof.screenshot(path=OUT+'p_rv.png')
        ra=await a.text_content('#rv-card');rb=await b.text_content('#rv-card')
        check('Pari gagné' in ra and 'Pari perdu' in rb,'téléphones : « Pari gagné » / « Pari perdu »')
        await b.screenshot(path=OUT+'s_lost.png')
        # Q2 : Sami parie juste
        await prof.click('#g-next');await prof.wait_for_timeout(600)
        q=await prof.evaluate('(function(){var q=G.qs[G.i];return {ans:q.ans,n:q.choices.length}})()')
        check(not await b.evaluate('document.getElementById("q-bet").classList.contains("on")'),'le pari repart à zéro à chaque question')
        await b.click('#q-bet');await b.click('#q-ans .ab[data-k="%d"]'%q['ans'])
        check(await b.evaluate('document.getElementById("q-bet").disabled'),'pari verrouillé après la réponse')
        await prof.click('#g-next');await prof.wait_for_timeout(1500)
        check(await prof.evaluate('G.players[Object.keys(G.players).filter(function(k){return G.players[k].p==="Sami"})[0]].score')==2000,'Sami : 0 puis +2 000')
        await prof.click('#g-next');await prof.wait_for_timeout(600);await prof.click('#g-next');await prof.wait_for_timeout(1500)
        await prof.click('#g-next');await prof.wait_for_timeout(6500)
        tab=await prof.evaluate('document.getElementById("end-rank").innerText')
        check('Sûr(e) mais faux' in tab,'bilan prof : colonne « Sûr(e) mais faux »')
        print(tab.replace('\n',' | ')[:300])
        await prof.evaluate('$("end-body").classList.remove("hidden")');await prof.screenshot(path=OUT+'p_end.png',full_page=True)
        # sans pari : bouton absent
        await br.close()
    print('erreurs JS :',errs or 'aucune')
    print('ÉCHECS :',bad or 'aucun')
asyncio.run(main())
