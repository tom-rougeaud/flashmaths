"""e2e v3.2 : tuiles, ordre, curseur, étape fausse, figure, saisie libre — partie en direct (prof + 2 élèves)"""
import asyncio,json
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/';OUT='/tmp/claude-0/e3/v32_'
import os
MOCK=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'mock_rt.js')).read()
errs=[]
def watch(p,n):
    p.on('pageerror',lambda e:errs.append(n+' '+str(e)))
    p.on('console',lambda m:errs.append(n+' '+m.text) if m.type=='error' else None)
async def newpage(ctx,n,vw=390,vh=844):
    s=await ctx.new_page();watch(s,n);await s.set_viewport_size({'width':vw,'height':vh})
    await s.add_init_script('try{localStorage.removeItem("fm3_sess");localStorage.removeItem("fm3_pseudo")}catch(e){}');return s
PICK='''(function(){
 function find(id,ok){for(var s=1;s<400;s++){var q=makeQuestion(id,s*7919+3,CTX);if(q&&ok(q))return q;}return null;}
 var L=[find("tables",function(q){return q.kind==="assoc"}),find("ranger_dec",function(q){return q.kind==="ordre"}),find("estim_calc",function(q){return q.kind==="slider"}),
        find("prio_err",function(q){return q.qx}),find("axe_gradue",function(q){return !!q.fig}),find("pct_de",function(q){return !q.kind})];
 L[5].libre=true;
 L.forEach(function(q,i){q.seed=1000+i;q.uid=genId();});
 QS=L;renderPreview();return L.map(function(q){return qKind(q)+(q.qx?"+qx":"")+(q.fig?"+fig":"")});
})()'''
async def answer(s,q,good):
    k=q['kind']
    if k=='assoc':
        for i,j in enumerate(q['cor']):
            jj=j if good or i>1 else q['cor'][(i+1)%len(q['cor'])] if False else j
            await s.click('#q-wid [data-s="L"][data-i="%d"]'%i);await s.click('#q-wid [data-s="R"][data-i="%d"]'%jj)
        if not good:  # on défait deux paires et on les croise
            await s.click('#q-wid [data-s="L"][data-i="0"]');await s.click('#q-wid [data-s="L"][data-i="1"]')
            await s.click('#q-wid [data-s="L"][data-i="0"]');await s.click('#q-wid [data-s="R"][data-i="%d"]'%q['cor'][1])
            await s.click('#q-wid [data-s="L"][data-i="1"]');await s.click('#q-wid [data-s="R"][data-i="%d"]'%q['cor'][0])
        await s.click('#w-ok')
    elif k=='ordre':
        seq=q['cor'] if good else list(reversed(q['cor']))
        for j in seq: await s.click('#q-wid [data-o="in"][data-j="%d"]'%j)
        await s.click('#w-ok')
    elif k=='slider':
        v=q['sl']['ans'] if good else q['sl']['ans']+2*q['sl']['tol']
        await s.evaluate('(function(v){var i=document.getElementById("wsl");i.value=v;i.dispatchEvent(new Event("input",{bubbles:true}));})(%r)'%v)
        await s.click('#w-ok')
    elif k=='libre':
        await s.click('#f-in');await s.keyboard.type(q['typed'] if good else '999');await s.keyboard.press('Enter')
    else:
        await s.click('#q-ans .ab[data-k="%d"]'%(q['ans'] if good else (q['ans']+1)%q['n']))
async def main():
    async with async_playwright() as pw:
        br=await pw.chromium.launch();ctx=await br.new_context();await ctx.add_init_script(MOCK)
        prof=await newpage(ctx,'PROF',1366,860)
        await prof.goto(B+'prof.html');await prof.wait_for_timeout(600)
        await prof.evaluate('P.read=0;P.sel=["tables"];P.nq=6;P.fmt="mix";P.dur=30;P.mode="solo";P.auto=false;saveSetup();refreshAll()')
        await prof.click('#b-gen');await prof.wait_for_timeout(400)
        print('formats forcés :',await prof.evaluate(PICK))
        await prof.wait_for_timeout(300);await prof.screenshot(path=OUT+'p_preview.png',full_page=True)
        T='(function(v){var i=document.getElementById("pv-show");i.checked=v;i.dispatchEvent(new Event("change"));})(%s)'
        await prof.evaluate(T%'true');await prof.wait_for_timeout(200);await prof.screenshot(path=OUT+'p_preview_ans.png',full_page=True);await prof.evaluate(T%'false')
        # édition : tuiles
        await prof.click('#pv-list .pq[data-i="0"] [data-a="edit"]');await prof.wait_for_timeout(300)
        await prof.screenshot(path=OUT+'p_edit_assoc.png');await prof.click('#m-q [data-close]')
        # conversion estimation
        await prof.click('#pv-list .pq[data-i="5"] [data-a="tgl"]');await prof.wait_for_timeout(150)
        await prof.click('#b-open');await prof.wait_for_timeout(900)
        code=(await prof.text_content('#lb-code')).strip();print('code',code)
        s1=await newpage(ctx,'Léa');await s1.goto(B+'eleve.html?c='+code);await s1.wait_for_timeout(700);await s1.fill('#ps-in','Léa');await s1.click('#ps-go');await s1.wait_for_timeout(500)
        s2=await newpage(ctx,'Hugo',1280,800);await s2.goto(B+'eleve.html?c='+code);await s2.wait_for_timeout(700);await s2.fill('#ps-in','Hugo');await s2.click('#ps-go');await s2.wait_for_timeout(500)
        await prof.click('#lb-start');await prof.wait_for_timeout(500);await prof.click('#ru-go');await prof.wait_for_timeout(3700)
        res=[]
        for qi in range(6):
            await prof.wait_for_timeout(400)
            q=await prof.evaluate('''(function(){var q=G.qs[G.i];return {kind:qKind(q),ans:q.ans,n:q.choices?q.choices.length:0,cor:qCorr(q),sl:q.sl||null,
              typed:q.num!==undefined?String(q.num).replace(".",","):""}})()''')
            await prof.screenshot(path=OUT+'p_q%d_%s.png'%(qi,q['kind']))
            await s1.screenshot(path=OUT+'s1_q%d_%s.png'%(qi,q['kind']))
            await answer(s1,q,True);await answer(s2,q,False)
            await prof.wait_for_timeout(2700)
            await prof.screenshot(path=OUT+'p_rv%d_%s.png'%(qi,q['kind']))
            await s1.screenshot(path=OUT+'s1_rv%d.png'%qi);await s2.screenshot(path=OUT+'s2_rv%d.png'%qi)
            st=await prof.evaluate('(function(){var h=G.hist[G.i];return {rate:h.rate,who:h.who.map(function(w){return w[0]+":"+w[1]}),errs:h.errs,pts:plist().map(function(p){return p.p+"="+p.ans[G.i].pts})}})()')
            card1=await s1.get_attribute('#rv-card','class');card2=await s2.get_attribute('#rv-card','class')
            res.append((q['kind'],st,card1,card2));print(qi,q['kind'],json.dumps(st,ensure_ascii=False),'| élève1',card1,'| élève2',card2)
            await prof.click('#g-next')
        await prof.wait_for_timeout(6500);await prof.screenshot(path=OUT+'p_end.png',full_page=True)
        print('diagnostic :',(await prof.text_content('#end-diag'))[:300])
        await br.close()
asyncio.run(main())
print('\n'.join(errs[:20]) or 'aucune erreur JS')
