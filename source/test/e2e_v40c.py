"""v4.0 : duel direct (vote, champions, +300 pour l’équipe), spectateurs, écran masqué"""
import asyncio,os,json
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/';OUT='/tmp/claude-0/e3/v40c_'
MOCK=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'mock_rt.js')).read()
errs=[];bad=[]
def check(c,msg):
    print(('OK  ' if c else 'KO  ')+msg)
    if not c: bad.append(msg)
def watch(p,n):
    p.on('pageerror',lambda e:errs.append(n+' '+str(e)))
    p.on('console',lambda m:errs.append(n+' '+m.text) if m.type=='error' else None)
async def main():
    os.makedirs('/tmp/claude-0/e3',exist_ok=True)
    async with async_playwright() as pw:
        br=await pw.chromium.launch();ctx=await br.new_context();await ctx.add_init_script(MOCK)
        prof=await ctx.new_page();watch(prof,'PROF');await prof.set_viewport_size({'width':1366,'height':800})
        await prof.goto(B+'prof.html');await prof.wait_for_timeout(600)
        await prof.evaluate('P.read=0;P.sel=["relatifs","pct_mental","frac_dec_pct"];P.nq=6;P.fk=["qcm","vf"];P.fmt="mix";P.vary=true;P.est=true;P.dur=20;P.mode="duel";P.nt=2;P.auto=false;P.bet=false;P.pts="juste";saveSetup();refreshAll()')
        await prof.click('#b-gen');await prof.wait_for_timeout(400);await prof.click('#b-open');await prof.wait_for_timeout(900)
        code=(await prof.text_content('#lb-code')).strip()
        S={}
        for name,team in [('Lina',0),('Sami',0),('Noa',1),('Yanis',1)]:
            s=await ctx.new_page();watch(s,name);await s.set_viewport_size({'width':390,'height':844})
            await s.add_init_script('try{localStorage.removeItem("fm3_sess");localStorage.removeItem("fm3_pseudo")}catch(e){}')
            await s.goto(B+'eleve.html?c='+code);await s.wait_for_timeout(500);await s.fill('#ps-in',name);await s.click('#ps-go');await s.wait_for_timeout(500)
            await s.click('.tcard[data-k="%d"]'%team);await s.wait_for_timeout(300);S[name]=s
        await prof.wait_for_timeout(500)
        await prof.click('#lb-start');await prof.wait_for_timeout(500)
        check('Duel direct' in await prof.text_content('#rules-box'),'règles : duel direct annoncé')
        await prof.click('#ru-go');await prof.wait_for_timeout(3900)
        q=json.loads(await prof.evaluate('JSON.stringify({ans:G.qs[G.i].ans,n:G.qs[G.i].choices.length})'))
        for name,s in S.items(): await s.click('#q-ans .ab[data-k="%d"]'%q['ans'])
        await prof.wait_for_timeout(1700)
        check(await prof.is_visible('#g-dd-btn') and not await prof.evaluate('$("g-dd-btn").disabled'),'bouton « Duel direct » disponible après la correction')
        ts0=await prof.evaluate('G.tscore.slice()');nq0=await prof.evaluate('G.qs.length')
        await prof.click('#g-dd-btn');await prof.wait_for_timeout(600)
        check(await prof.is_visible('#g-dd'),'tableau : écran de vote')
        check(await S['Lina'].evaluate('S.screen')=='s-vote','téléphones : écran de vote')
        await S['Lina'].screenshot(path=OUT+'s_vote.png');await prof.screenshot(path=OUT+'p_vote.png')
        ids=json.loads(await prof.evaluate('JSON.stringify(plist().reduce(function(o,p){o[p.p]=p.id;return o},{}))'))
        # équipe 0 vote Sami, équipe 1 vote Noa
        for v,who in [('Lina','Sami'),('Sami','Sami'),('Noa','Noa'),('Yanis','Noa')]:
            await S[v].click('#v-list .vbtn[data-id="%s"]'%ids[who])
        await prof.wait_for_timeout(1500)
        await prof.screenshot(path=OUT+'p_champs.png')
        await prof.wait_for_timeout(3500)
        check(await prof.evaluate('G.qs.length')==nq0+1,'question de duel ajoutée à la partie')
        dd=json.loads(await prof.evaluate('JSON.stringify(G.qs[G.i].dd||null)'))
        check(dd and set(dd['pn'])=={'Sami','Noa'},'champions : Sami et Noa (les plus votés)')
        check(await S['Lina'].evaluate('!!(S.ans&&S.ans.spec)'),'Lina (spectatrice) ne peut pas répondre')
        await S['Lina'].screenshot(path=OUT+'s_spec.png');await S['Sami'].screenshot(path=OUT+'s_champ.png')
        q=json.loads(await prof.evaluate('JSON.stringify({ans:G.qs[G.i].ans,n:G.qs[G.i].choices.length})'))
        await S['Noa'].click('#q-ans .ab[data-k="%d"]'%((q['ans']+1)%q['n']))
        await S['Sami'].click('#q-ans .ab[data-k="%d"]'%q['ans'])
        await prof.wait_for_timeout(1800)
        check(await prof.evaluate('G.phase')=='rv','correction dès que les deux champions ont répondu')
        ts1=await prof.evaluate('G.tscore.slice()');print('équipes avant/après :',ts0,ts1)
        check(ts1[0]-ts0[0]==300 and ts1[1]==ts0[1],'Sami gagne le duel : +300 pour son équipe, rien pour l’autre')
        check('remporte le duel' in await prof.text_content('#g-rev'),'tableau : « … remporte le duel »')
        check('remporte le duel' in await S['Lina'].text_content('#rv-card'),'téléphones : résultat du duel')
        await prof.screenshot(path=OUT+'p_rv.png');await S['Lina'].screenshot(path=OUT+'s_rv.png')
        check(await prof.evaluate('$("g-dd-btn").disabled'),'un seul duel par manche')
        # écran masqué
        await prof.click('#g-hide');await prof.wait_for_timeout(200)
        check(await prof.is_visible('#g-curtain'),'écran masqué affiché')
        await prof.keyboard.press('Escape');await prof.wait_for_timeout(200)
        check(not await prof.is_visible('#g-curtain'),'Échap réaffiche l’écran')
        await br.close()
    print('erreurs JS :',errs or 'aucune')
    print('ÉCHECS :',bad or 'aucun')
asyncio.run(main())
