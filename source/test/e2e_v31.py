import asyncio
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/';OUT='/tmp/claude-0/e3/v31_'
import os
MOCK=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'mock_rt.js')).read()
errs=[]
def watch(p,n):
    p.on('pageerror',lambda e:errs.append(n+' '+str(e)))
    p.on('console',lambda m:errs.append(n+' '+m.text) if m.type=='error' else None)
async def newpage(ctx,n,vw=390,vh=844):
    s=await ctx.new_page();watch(s,n);await s.set_viewport_size({'width':vw,'height':vh})
    await s.add_init_script('try{localStorage.removeItem("fm3_sess");localStorage.removeItem("fm3_pseudo")}catch(e){}');return s
async def typecode(s,code):
    await s.goto(B+'eleve.html');await s.wait_for_timeout(400)
    for ch in code: await s.click('#hexpad button[data-c="%s"]'%ch)
    await s.wait_for_timeout(700)
async def main():
    async with async_playwright() as pw:
        br=await pw.chromium.launch();ctx=await br.new_context();await ctx.add_init_script(MOCK)
        prof=await newpage(ctx,'PROF',1366,860)
        await prof.goto(B+'prof.html');await prof.wait_for_timeout(600)
        await prof.screenshot(path=OUT+'p_pick.png')
        await prof.evaluate('P.read=0;P.sel=["cc_signes","relatifs","pct_mental"];P.nq=4;P.fmt="mix";P.dur=15;P.mode="boss";P.auto=false;saveSetup();refreshAll()')
        await prof.click('#b-gen');await prof.wait_for_timeout(500)
        await prof.screenshot(path=OUT+'p_preview_hidden.png')
        hid=await prof.evaluate('getComputedStyle(document.querySelector("#pv-list .ch.ok")||document.body).backgroundColor')
        print('aperçu masqué (fond bonne réponse) =',hid)
        q1=await prof.evaluate('QS.map(function(q){return q.q})')
        await prof.click('#b-open');await prof.wait_for_timeout(900)
        code=(await prof.text_content('#lb-code')).strip();rev=code[::-1];print('code',code,'code prof',rev)
        # élèves : prénom par défaut vide
        s1=await newpage(ctx,'Léa');await typecode(s1,code)
        print('écran après code :',await s1.evaluate('S.screen'),'| prénom pré-rempli :',repr(await s1.input_value('#ps-in')))
        await s1.screenshot(path=OUT+'s_prenom.png')
        await s1.fill('#ps-in',"Léa");await s1.click('#ps-go');await s1.wait_for_timeout(500)
        s2=await newpage(ctx,'Hugo');await typecode(s2,code);await s2.fill('#ps-in','hugo');await s2.click('#ps-go');await s2.wait_for_timeout(500)
        # code inconnu
        s3=await newpage(ctx,'X');await typecode(s3,'0000');print('code inconnu :',await s3.text_content('#code-err'));await s3.close()
        # téléphone prof
        ph=await newpage(ctx,'PHONE');await typecode(ph,rev);await ph.wait_for_timeout(500)
        print('téléphone prof : écran',await ph.evaluate('S.screen'),'host',await ph.evaluate('S.host'),'|',await ph.text_content('#lb-me'))
        await ph.screenshot(path=OUT+'ph_lobby.png');await prof.screenshot(path=OUT+'p_lobby_boss.png')
        # code prof : modal
        await prof.click('#lb-hostcode');await prof.wait_for_timeout(300);print('code prof affiché :',await prof.text_content('#hc-code'));await prof.screenshot(path=OUT+'p_hostcode.png');await prof.click('#m-hostcode .x')
        # renommage forcé dans la salle
        await prof.click('#lb-players');await prof.wait_for_timeout(300)
        await prof.click('#mp-list [data-mp="ren"][data-id]:near(:text("hugo"))') if False else None
        hid_id=await prof.evaluate('Object.keys(G.players).filter(function(k){return G.players[k].p==="hugo"})[0]')
        await prof.click('#mp-list [data-mp="ren"][data-id="%s"]'%hid_id);await prof.fill('#mp-in','Hugo B');await prof.press('#mp-in','Enter');await prof.wait_for_timeout(600)
        await prof.screenshot(path=OUT+'p_players.png')
        print('renommé côté élève :',await s2.evaluate('S.pseudo'))
        await prof.click('#m-players .x')
        # règles
        await prof.click('#lb-start');await prof.wait_for_timeout(600)
        await prof.screenshot(path=OUT+'p_rules.png');await s1.screenshot(path=OUT+'s_rules.png')
        await prof.click('#ru-go');await prof.wait_for_timeout(3700)
        # retardataire
        s4=await newpage(ctx,'Nina');await s4.goto(B+'eleve.html?c='+code);await s4.wait_for_timeout(700);await s4.fill('#ps-in','Nina');await s4.click('#ps-go');await s4.wait_for_timeout(700)
        print('retardataire écran :',await s4.evaluate('S.screen'))
        studs=[s1,s2,s4]
        for qi in range(4):
            await prof.wait_for_timeout(300)
            q=await prof.evaluate('(function(){var q=G.qs[G.i];return {libre:!!q.libre,ans:q.ans,lit:q.lit||null,num:q.num===undefined?null:q.num,n:q.choices.length,shown:q.choices[q.ans].t}})()')
            if qi==1:
                await s2.evaluate('Object.defineProperty(document,"hidden",{configurable:true,get:function(){return true}});document.dispatchEvent(new Event("visibilitychange"))');await prof.wait_for_timeout(500)
                await prof.screenshot(path=OUT+'p_away.png')
                print('alerte page quittée :',await prof.text_content('#g-away'))
                await s2.evaluate('Object.defineProperty(document,"hidden",{configurable:true,get:function(){return false}});document.dispatchEvent(new Event("visibilitychange"))')
            for k,s in enumerate(studs+[ph]):
                good=(k+qi)%3!=0
                if await s.is_visible('#q-free'):
                    txt=(('%g'%q['num']).replace('.',',') if q['num'] is not None else q['shown'].replace('$','').replace(' ','')) if good else '999'
                    await s.click('#f-in');await s.keyboard.type(txt.replace('-','-'));await s.keyboard.press('Enter')
                elif await s.is_visible('#q-ans .ab[data-k="0"]'):
                    await s.click('#q-ans .ab[data-k="%d"]'%(q['ans'] if good else (q['ans']+1)%q['n']))
            await prof.wait_for_timeout(1900)
            await prof.screenshot(path=OUT+'p_rv%d.png'%qi)
            if qi==0: await ph.screenshot(path=OUT+'ph_rv.png')
            await prof.click('#g-next')
        await prof.wait_for_timeout(6000);await prof.screenshot(path=OUT+'p_end.png')
        print('boss',await prof.evaluate('G.boss'))
        # 2e partie immédiate, même thème : questions différentes ?
        await prof.click('#end-again');await prof.wait_for_timeout(500)
        q2=await prof.evaluate('QS.map(function(q){return q.q})')
        print('questions communes entre les 2 parties :',len(set(q1)&set(q2)),'/',len(q2))
        await br.close()
asyncio.run(main())
print('\n'.join(errs[:20]) or 'aucune erreur JS')
