import asyncio,json,sys,time
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/'
OUT='/tmp/claude-0/e3/'
import os
MOCK=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'mock_rt.js')).read()
errs=[]
def watch(p,name):
    p.on('pageerror',lambda e:errs.append(name+' PAGEERROR '+str(e)))
    p.on('console',lambda m:errs.append(name+' console.'+m.type+' '+m.text) if m.type in ('error','warning') else None)
async def main():
    async with async_playwright() as pw:
        br=await pw.chromium.launch()
        ctx=await br.new_context()
        await ctx.add_init_script(MOCK)
        prof=await ctx.new_page();watch(prof,'PROF')
        await prof.set_viewport_size({'width':1366,'height':860})
        await prof.goto(B+'prof.html');await prof.wait_for_timeout(800)
        await prof.screenshot(path=OUT+'p1_pick.png')
        # niveau CAP + surprise
        await prof.click('#lvls button[data-l="cap"]');await prof.click('#b-surprise');await prof.wait_for_timeout(300)
        await prof.screenshot(path=OUT+'p2_surprise.png',full_page=True)
        # réglages : duel, 6 questions -> 5, format mixte, temps 15 s
        await prof.click('#acc-set summary')
        await prof.click('#modes .mode[data-m="duel"]');await prof.click('#seg-nq button[data-v="5"]');await prof.click('#seg-dur button[data-v="15"]');await prof.click('#seg-fmt button[data-v="mix"]')
        await prof.screenshot(path=OUT+'p3_settings.png',full_page=True)
        await prof.evaluate('P.vary=false;P.est=false;saveSetup()')
        await prof.evaluate('P.read=0;saveSetup()');await prof.click('#b-gen');await prof.wait_for_timeout(500)
        await prof.screenshot(path=OUT+'p4_preview.png',full_page=True)
        # édition d’une question (la 1re)
        await prof.click('#pv-list .pq[data-i="0"] [data-a="edit"]');await prof.wait_for_timeout(200)
        await prof.screenshot(path=OUT+'p5_qedit.png')
        await prof.click('#mq-save');await prof.wait_for_timeout(200)
        await prof.click('#b-open');await prof.wait_for_timeout(1200)
        code=(await prof.text_content('#lb-code')).strip();print('code',code)
        await prof.screenshot(path=OUT+'p6_lobby_empty.png')
        studs=[]
        for k,ps in enumerate(['Zoé','Léo maths','Inès_42']):
            s=await ctx.new_page();watch(s,'S%d'%k);await s.set_viewport_size({'width':390,'height':844});await s.add_init_script('try{localStorage.removeItem("fm3_sess")}catch(e){}')
            await s.goto(B+'eleve.html?c='+code);await s.wait_for_timeout(500)
            await s.fill('#ps-in',ps);
            if k==0: await s.screenshot(path=OUT+'s1_pseudo.png')
            await s.click('#ps-go');await s.wait_for_timeout(900)
            studs.append(s)
        await studs[0].screenshot(path=OUT+'s2_lobby.png')
        # S0 : glisser son jeton dans l’équipe 1 ; S1 : toucher équipe 0 ; S2 : glisser équipe 1
        async def drag(s,k):
            t=await s.query_selector('#token');tb=await t.bounding_box()
            c=await s.query_selector('.tcard[data-k="%d"]'%k);cb=await c.bounding_box()
            await s.mouse.move(tb['x']+tb['width']/2,tb['y']+tb['height']/2);await s.mouse.down()
            for i in range(1,8): await s.mouse.move(tb['x']+tb['width']/2+(cb['x']+cb['width']/2-tb['x']-tb['width']/2)*i/7,tb['y']+tb['height']/2+(cb['y']+cb['height']/2-tb['y']-tb['height']/2)*i/7)
            await s.mouse.up()
        await drag(studs[0],1);await studs[1].click('.tcard[data-k="0"]');await drag(studs[2],1)
        await prof.wait_for_timeout(700)
        await studs[0].screenshot(path=OUT+'s3_lobby_team.png')
        # le prof renomme l’équipe 0
        await prof.fill('[data-tn="0"]','Les Matheux');await prof.press('[data-tn="0"]','Enter');await prof.wait_for_timeout(500)
        await prof.screenshot(path=OUT+'p7_lobby.png')
        await studs[1].screenshot(path=OUT+'s4_lobby_renamed.png')
        await prof.click('#lb-start');await prof.wait_for_timeout(500);await prof.click('#ru-go');await prof.wait_for_timeout(3600)
        N=await prof.evaluate('G.qs.length')
        for qi in range(N):
            await prof.wait_for_timeout(400)
            q=await prof.evaluate('(function(){var q=G.qs[G.i];return {libre:!!q.libre,ans:q.ans,lit:q.lit||null,num:q.num===undefined?null:q.num,unit:q.unit||"",shown:q.choices[q.ans].t,n:q.choices.length}})()')
            print('Q',qi+1,q)
            if qi==0: await prof.screenshot(path=OUT+'p8_question.png');await studs[0].screenshot(path=OUT+'s5_question.png')
            for k,s in enumerate(studs):
                good=(k!=2) or (qi%2==0)
                if q['libre']:
                    if q['lit']: txt=q['shown'].replace('$','').replace(' ','') if good else '999'
                    else:
                        v=q['num']; txt=(('%g'%v).replace('.',',') if good else '12345')
                        if good and k==1 and q['unit']!='%': txt=(('%g'%(v*100)).replace('.',','))+'%'   # 450 % pour 4,5
                    for ch in txt:
                        key={'-':'−','*':None,'^':None}.get(ch,ch)
                        if ch=='²': key='x²'
                        if key is None: continue
                        if ch=='x' and txt.find('x²')>=0: pass
                        try: await s.click('#kpad button[data-key="%s"]'%key,timeout=1500)
                        except Exception as e: errs.append('pad key %r: %s'%(key,e))
                    if qi<=4 and k==0: await s.screenshot(path=OUT+'s6_free_%d.png'%qi)
                    await s.click('#kpad button.ok')
                else:
                    a=q['ans'] if good else (q['ans']+1)%q['n']
                    await s.click('#q-ans .ab[data-k="%d"]'%a)
                await s.wait_for_timeout(150)
            await prof.wait_for_timeout(1700)
            await prof.screenshot(path=OUT+'p9_reveal_%d.png'%qi)
            if qi<2: await studs[0].screenshot(path=OUT+'s7_reveal_%d.png'%qi);await studs[2].screenshot(path=OUT+'s7b_reveal_%d.png'%qi)
            await prof.click('#g-next');await prof.wait_for_timeout(600)
        await prof.wait_for_timeout(3500)
        await prof.screenshot(path=OUT+'p10_end.png',full_page=True)
        await studs[0].wait_for_timeout(500);await studs[0].screenshot(path=OUT+'s8_end.png',full_page=True)
        res=await prof.evaluate('rankList().map(function(x){return [x.p,x.s,G.players[x.id].ok]})')
        print('classement',res,'equipes',await prof.evaluate('G.tscore'))
        await br.close()
asyncio.run(main())
print('\n'.join(errs[:40]) or 'aucune erreur JS')
