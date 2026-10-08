"""v3.5 : renommage d’équipe stable pendant les arrivées, glisser-déposer prof, handicap du téléphone prof, ajustement à l’écran"""
import asyncio,os
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/';OUT='/tmp/claude-0/e3/v35_'
MOCK=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'mock_rt.js')).read()
errs=[];bad=[]
def check(c,msg):
    print(('OK  ' if c else 'KO  ')+msg)
    if not c: bad.append(msg)
def watch(p,n):
    p.on('pageerror',lambda e:errs.append(n+' '+str(e)))
    p.on('console',lambda m:errs.append(n+' '+m.text) if m.type=='error' else None)
async def newpage(ctx,n,vw=390,vh=844):
    s=await ctx.new_page();watch(s,n);await s.set_viewport_size({'width':vw,'height':vh})
    await s.add_init_script('try{localStorage.removeItem("fm3_sess");localStorage.removeItem("fm3_pseudo")}catch(e){}');return s
async def join(ctx,code,name):
    s=await newpage(ctx,name);await s.goto(B+'eleve.html?c='+code);await s.wait_for_timeout(500)
    await s.fill('#ps-in',name);await s.click('#ps-go');await s.wait_for_timeout(600);return s
async def overflow(p):
    return await p.evaluate('document.documentElement.scrollHeight>innerHeight+1||document.documentElement.scrollWidth>innerWidth+1')
async def main():
    os.makedirs('/tmp/claude-0/e3',exist_ok=True)
    async with async_playwright() as pw:
        br=await pw.chromium.launch();ctx=await br.new_context();await ctx.add_init_script(MOCK)
        # ---------- Duel : renommage + glisser-déposer ----------
        prof=await newpage(ctx,'PROF',1366,860)
        await prof.goto(B+'prof.html');await prof.wait_for_timeout(600)
        await prof.evaluate('P.read=0;P.sel=["relatifs","pct_mental"];P.nq=2;P.fmt="qcm";P.dur=15;P.mode="duel";P.nt=2;P.auto=false;P.tnames=null;saveSetup();refreshAll()')
        await prof.click('#b-gen');await prof.wait_for_timeout(400);await prof.click('#b-open');await prof.wait_for_timeout(900)
        code=(await prof.text_content('#lb-code')).strip()
        s1=await join(ctx,code,'Léa')
        # le prof commence à taper le nom de l’équipe 1 ; pendant ce temps un élève arrive et un autre change d’équipe
        await prof.click('[data-tn="0"]');await prof.fill('[data-tn="0"]','');await prof.keyboard.type('Les Mat',delay=40)
        s2=await join(ctx,code,'Hugo')
        await s1.click('.tcard[data-k="1"]');await prof.wait_for_timeout(500)
        await prof.keyboard.type('heux',delay=40)
        v=await prof.input_value('[data-tn="0"]');foc=await prof.evaluate('document.activeElement&&document.activeElement.getAttribute("data-tn")')
        check(v=='Les Matheux' and foc=='0','saisie du nom conservée pendant arrivée/changement d’équipe (%r, focus %r)'%(v,foc))
        await prof.press('[data-tn="0"]','Enter');await prof.wait_for_timeout(500)
        st=await s2.evaluate('Array.from(document.querySelectorAll(".tcard")).map(function(e){return e.textContent}).join("|")')
        check('Les Matheux' in st,'nouveau nom reçu côté élève')
        # glisser-déposer : Hugo (sans équipe) -> équipe 2
        chip=await prof.query_selector('.team.pool .pchip');tb=await chip.bounding_box()
        zone=await prof.query_selector('.team[data-team="1"]');zb=await zone.bounding_box()
        await prof.mouse.move(tb['x']+tb['width']/2,tb['y']+tb['height']/2);await prof.mouse.down()
        for i in range(1,10): await prof.mouse.move(tb['x']+tb['width']/2+(zb['x']+zb['width']/2-tb['x']-tb['width']/2)*i/9,tb['y']+tb['height']/2+(zb['y']+zb['height']/2-tb['y']-tb['height']/2)*i/9)
        await prof.mouse.up();await prof.wait_for_timeout(700)
        names=await prof.evaluate('Array.from(document.querySelectorAll(\'.team[data-team="1"] .pchip\')).map(function(e){return e.textContent.replace("✕","").trim()})')
        pool=await prof.evaluate('document.querySelectorAll(".team.pool .pchip").length')
        check('Hugo' in names and pool==0,'affichage prof après glisser-déposer : équipe 2 = %s, sans équipe = %d'%(names,pool))
        check(await s2.evaluate('S.team')==1,'côté élève : Hugo est dans l’équipe 2')
        await prof.screenshot(path=OUT+'p_lobby.png')
        await prof.click('#lb-close');await prof.click('#lb-close');await prof.wait_for_timeout(600)
        for s in (s1,s2): await s.close()
        # ---------- Boss : handicap 5 s ----------
        await prof.evaluate('show("s-pick");P.mode="boss";P.hd=5;P.hpen=true;P.nq=2;saveSetup();refreshAll()')
        await prof.click('#b-gen');await prof.wait_for_timeout(400);await prof.click('#b-open');await prof.wait_for_timeout(900)
        code=(await prof.text_content('#lb-code')).strip()
        a=await join(ctx,code,'Nina');b=await join(ctx,code,'Omar')
        ph=await newpage(ctx,'PHONE');await ph.goto(B+'eleve.html');await ph.wait_for_timeout(400)
        for ch in code[::-1]: await ph.click('#hexpad button[data-c="%s"]'%ch)
        await ph.wait_for_timeout(900)
        check(await ph.evaluate('S.host')==True,'téléphone prof connecté')
        await prof.click('#lb-start');await prof.wait_for_timeout(500)
        rules=await prof.text_content('#rules') if await prof.is_visible('#rules') else await prof.evaluate('document.body.innerText')
        check('5 s' in rules,'règles : handicap de 5 s annoncé')
        await prof.click('#ru-go');await prof.wait_for_timeout(3900)
        await ph.wait_for_timeout(300)
        wait_txt=await ph.evaluate('document.body.innerText')
        check('Handicap' in wait_txt,'téléphone prof : la question est retardée')
        await ph.screenshot(path=OUT+'ph_wait.png')
        q=await prof.evaluate('(function(){var q=G.qs[G.i];return {ans:q.ans,n:q.choices.length}})()')
        for s in (a,b):
            if await s.is_visible('#q-ans .ab[data-k="0"]'): await s.click('#q-ans .ab[data-k="%d"]'%q['ans'])
        await prof.wait_for_timeout(1500)
        check(await prof.evaluate('G.phase')=='q','correction pas déclenchée tant que le téléphone prof n’a pas répondu')
        await ph.click('#q-ans .ab[data-k="%d"]'%((q['ans']+1)%q['n']),timeout=8000)
        await prof.wait_for_timeout(1600)
        bs=await prof.evaluate('JSON.stringify({ph:G.phase,pc:G.boss.pc,pp:G.boss.pp})')
        print('après Q1 (classe 100 %, prof faux, malus erreur) :',bs)
        check(await prof.evaluate('G.phase')=='rv','correction déclenchée dès la réponse du téléphone prof')
        await prof.screenshot(path=OUT+'p_rv.png');await ph.screenshot(path=OUT+'ph_rv.png')
        check(not await overflow(ph) and not await overflow(a),'téléphones : pas de défilement')
        check(not await overflow(prof),'prof : pas de défilement')
        await br.close()
    print('erreurs JS :',errs or 'aucune')
    print('ÉCHECS :',bad if bad else 'aucun')
asyncio.run(main())
