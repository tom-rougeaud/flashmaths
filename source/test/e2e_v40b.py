"""v4.0 : nouveaux formats (intrus, texte à trous, qui suis-je, plusieurs bonnes réponses), types cochés, difficulté"""
import asyncio,os,json
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/';OUT='/tmp/claude-0/e3/v40b_'
MOCK=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'mock_rt.js')).read()
errs=[];bad=[]
def check(c,msg):
    print(('OK  ' if c else 'KO  ')+msg)
    if not c: bad.append(msg)
def watch(p,n):
    p.on('pageerror',lambda e:errs.append(n+' '+str(e)))
    p.on('console',lambda m:errs.append(n+' '+m.text) if m.type=='error' else None)
PICK='''(function(){
 function find(id,ok){for(var s=1;s<900;s++){var q=makeQuestion(id,s*7919+3,CTX);if(q&&ok(q))return q;}return null;}
 var L=[find("cc_pct",function(q){return q.sub==="intrus"}),find("cc_formules",function(q){return q.sub==="trou"}),find("cc_geo",function(q){return q.sub==="qui"}),
        find("cc_stats",function(q){return q.kind==="multi"}),find("lit_dev",function(q){return q.kind==="multi"})];
 L.forEach(function(q,i){q.seed=100+i;q.uid=genId();});QS=L;renderPreview();return L.map(function(q){return (q.sub||q.kind)+":"+q.q.slice(0,40)});})()'''
async def main():
    os.makedirs('/tmp/claude-0/e3',exist_ok=True)
    async with async_playwright() as pw:
        br=await pw.chromium.launch();ctx=await br.new_context();await ctx.add_init_script(MOCK)
        prof=await ctx.new_page();watch(prof,'PROF');await prof.set_viewport_size({'width':1366,'height':800})
        await prof.goto(B+'prof.html');await prof.wait_for_timeout(600)
        # réglages : types de questions
        await prof.evaluate('P.fk=null;P.fmt="mix";P.vary=true;P.est=true;P.diff=0;saveSetup();renderSettings()')
        n=await prof.evaluate('document.querySelectorAll("#seg-fk button.on").length')
        check(n==10,'10 types de questions proposés, tous cochés par défaut (%d)'%n)
        await prof.evaluate('P.sel=["frac_dec_pct","relatifs","eq1","lit_dev","angles_tri","conv","cc_fractions","cc_signes"];P.nq=20;P.mode="solo";saveSetup();refreshAll()')
        # ne garder que intrus + plusieurs réponses
        for k in ['qcm','vf','libre','slider','tuiles','etape','trou','qui']:
            await prof.evaluate('document.querySelector("#seg-fk button[data-v=%s]").click()'%k)
        fk=await prof.evaluate('profFk().join(",")');print('types :',fk)
        await prof.click('#b-gen');await prof.wait_for_timeout(500)
        ks=await prof.evaluate('QS.map(function(q){return fmtKey(q)})')
        print('formats générés :',ks)
        check(len(ks)>0 and all(k in ('intrus','multi') for k in ks),'génération : seulement intrus et plusieurs réponses (%d questions)'%len(ks))
        # difficulté
        await prof.evaluate('P.fk=null;P.diff=2;P.sel=["frac_dec_pct","frac_ops","relatifs","thales","eq1"];saveSetup();renderSettings()')
        await prof.evaluate('generate()');await prof.wait_for_timeout(300)
        ds=await prof.evaluate('QS.map(function(q){return q.d})');print('difficultés :',ds)
        check(ds and all(d==2 for d in ds),'difficulté « Initié » : seulement des notions ★★')
        await prof.evaluate('P.diff=0;saveSetup()')
        # partie avec les quatre nouveaux formats
        await prof.evaluate('P.read=0;P.dur=30;P.auto=false;P.pts="juste";P.bet=false;saveSetup()')
        print(await prof.evaluate(PICK))
        await prof.screenshot(path=OUT+'p_preview.png',full_page=True)
        await prof.click('#b-open');await prof.wait_for_timeout(900)
        code=(await prof.text_content('#lb-code')).strip()
        S=[]
        for name in ['Lina','Sami']:
            s=await ctx.new_page();watch(s,name);await s.set_viewport_size({'width':390,'height':844})
            await s.add_init_script('try{localStorage.removeItem("fm3_sess");localStorage.removeItem("fm3_pseudo")}catch(e){}')
            await s.goto(B+'eleve.html?c='+code);await s.wait_for_timeout(500);await s.fill('#ps-in',name);await s.click('#ps-go');await s.wait_for_timeout(500);S.append(s)
        a,b=S
        await prof.click('#lb-start');await prof.wait_for_timeout(500);await prof.click('#ru-go');await prof.wait_for_timeout(3900)
        for qi in range(5):
            q=json.loads(await prof.evaluate('JSON.stringify((function(){var q=G.qs[G.i];return {k:qKind(q),sub:q.sub||"",ans:q.ans,oks:q.oks||null,n:q.choices.length}})())'))
            tag=await a.text_content('#q-tag');print(qi,q['k'],q['sub'],'| tag élève :',tag)
            exp={'intrus':'intrus','trou':'trous','qui':'Qui suis-je','multi':'Plusieurs'}[q['sub'] or q['k']]
            check(exp in tag,'étiquette élève « %s »'%exp)
            await a.screenshot(path=OUT+'s_q%d.png'%qi);await prof.screenshot(path=OUT+'p_q%d.png'%qi)
            if q['k']=='multi':
                check(await a.is_visible('#q-mok') and await a.evaluate('document.getElementById("q-mok").disabled'),'multi : bouton Valider désactivé tant que rien n’est coché')
                for k in q['oks']: await a.click('#q-ans .ab[data-k="%d"]'%k)
                await a.click('#q-mok')
                # Sami : une seule bonne + rien d’autre (points partiels si au moins la moitié)
                await b.click('#q-ans .ab[data-k="%d"]'%q['oks'][0]);await b.click('#q-mok')
            else:
                await a.click('#q-ans .ab[data-k="%d"]'%q['ans'])
                await b.click('#q-ans .ab[data-k="%d"]'%((q['ans']+1)%q['n']))
            await prof.wait_for_timeout(1700)
            r=json.loads(await prof.evaluate('JSON.stringify(plist().map(function(p){var x=p.ans[G.i];return [p.p,x.ok,x.pa,x.pts]}))'))
            print('   ',r)
            R=dict((x[0],x) for x in r)
            check(R['Lina'][1] and R['Lina'][3]>0,'bonne réponse comptée juste')
            if q['k']=='multi':
                part=len(q['oks'])<=2
                check((R['Sami'][2]==1)==part,'multi incomplet : %s'%('points partiels (moitié des bonnes)' if part else 'pas de points (moins de la moitié)'))
                txt=await a.text_content('#rv-card')+await a.evaluate('document.getElementById("rv-extra").innerText')
                check('Les bonnes réponses' in txt,'correction élève : liste des bonnes réponses')
                await b.screenshot(path=OUT+'s_rv_multi.png')
            else: check(not R['Sami'][1],'mauvaise réponse comptée fausse')
            await prof.screenshot(path=OUT+'p_rv%d.png'%qi)
            await prof.click('#g-next');await prof.wait_for_timeout(500)
        await br.close()
    print('erreurs JS :',errs or 'aucune')
    print('ÉCHECS :',bad or 'aucun')
asyncio.run(main())
