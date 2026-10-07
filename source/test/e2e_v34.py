"""e2e v3.4 : ordre de la page (réglages avant le niveau), arborescence chapitre › sous-chapitre › notion,
temps de lecture (réponses verrouillées), points « justesse seule », colonne des prénoms en direct (couleurs d’équipe),
départ en ampoules, guirlande de fin, lettres A B C D"""
import asyncio
from playwright.async_api import async_playwright
B='http://127.0.0.1:8770/';OUT='/tmp/claude-0/e3/v34_'
import os
MOCK=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'mock_rt.js')).read()
CLR='try{localStorage.removeItem("fm3_sess");localStorage.removeItem("fm3_pseudo")}catch(e){}'
errs=[]
def watch(p,n):
    p.on('pageerror',lambda e:errs.append(n+' '+str(e)))
    p.on('console',lambda m:errs.append(n+' '+m.text) if m.type=='error' else None)
async def stud(ctx,code,name):
    s=await ctx.new_page();watch(s,name);await s.add_init_script(CLR);await s.set_viewport_size({'width':390,'height':800})
    await s.goto(B+'eleve.html?c='+code);await s.wait_for_timeout(500);await s.fill('#ps-in',name);await s.click('#ps-go');await s.wait_for_timeout(400);return s
async def main():
    async with async_playwright() as pw:
        br=await pw.chromium.launch();ctx=await br.new_context();await ctx.add_init_script(MOCK)
        prof=await ctx.new_page();watch(prof,'PROF');await prof.set_viewport_size({'width':1366,'height':860})
        await prof.goto(B+'prof.html');await prof.wait_for_timeout(700)
        order=await prof.evaluate('(function(){var a=document.getElementById("modes"),b=document.getElementById("acc-set"),c=document.getElementById("lvls"),t=document.getElementById("tree");return [!!(a.compareDocumentPosition(c)&4),!!(b.compareDocumentPosition(c)&4),!!(c.compareDocumentPosition(t)&4),t.parentNode===c.closest(".card")]})()')
        print('modes avant niveau, réglages avant niveau, arbre sous le niveau, dans la même carte :',order)
        # arborescence : niveau 2nde, case d’un sous-chapitre
        await prof.click('#lvls button[data-l="2nde"]');await prof.wait_for_timeout(200)
        await prof.click('#tree details.chap:nth-of-type(2) > summary .cn');await prof.wait_for_timeout(200)
        sub=prof.locator('#tree details.chap[open] details.sub').first
        nm=(await sub.locator('summary .sn').text_content()).strip()
        await sub.locator('summary input.chk').check();await prof.wait_for_timeout(200)
        print('sous-chapitre coché :',nm,'| notions sélectionnées :',await prof.evaluate('P.sel.length'),'| compteur :',(await prof.locator('#tree details.chap[open] > summary .cnt').text_content()).strip())
        print('profondeurs (chapitres / sous-chapitres / notions) :',await prof.evaluate('[document.querySelectorAll("#tree details.chap").length,document.querySelectorAll("#tree details.sub").length,document.querySelectorAll("#tree .it").length]'))
        await prof.screenshot(path=OUT+'tree.png',full_page=True)
        # partie : duel, lecture 3 s, justesse seule
        await prof.evaluate('P.sel=["pct_mental","tables"];P.vary=false;P.est=false;P.nq=2;P.mode="duel";P.auto=false;P.dur=20;P.read=3;P.pts="juste";saveSetup();refreshAll()')
        await prof.click('#b-gen');await prof.wait_for_timeout(300);await prof.click('#b-open');await prof.wait_for_timeout(900)
        code=(await prof.text_content('#lb-code')).strip()
        s=[await stud(ctx,code,n) for n in ['Léa','Hugo','Nina']]
        await prof.evaluate('plist().forEach(function(p,i){p.team=i%2});renderLobby();pushLobby()')
        await prof.click('#lb-start');await prof.wait_for_timeout(500)
        print('règles (élève) mentionnent lecture et justesse :',await s[0].evaluate('(function(){var t=document.getElementById("lb-body").textContent;return [t.indexOf("lis bien")>=0,t.indexOf("quelle que soit la vitesse")>=0]})()'))
        await prof.click('#ru-go');await prof.wait_for_timeout(1500)
        print('ampoules du départ allumées :',await prof.evaluate('document.querySelectorAll("#g-cdb i.on").length'),'| élève :',await s[0].evaluate('document.querySelectorAll("#cd-b i.on").length'))
        await prof.wait_for_timeout(1700)
        q=await prof.evaluate('(function(){var q=G.qs[G.i];return {ans:q.ans,n:q.choices.length}})()')
        print('lettres :',await prof.evaluate('Array.prototype.map.call(document.querySelectorAll("#g-choices .gch .sh"),function(x){return x.textContent}).join("")'))
        print('pendant la lecture : voile prof',await prof.evaluate('$("g-choices").classList.contains("veil")'),'| élève verrouillé',await s[0].evaluate('$("q-ans").classList.contains("reading")'))
        await s[0].click('#q-ans .ab[data-k="%d"]'%q['ans'],force=True);await prof.wait_for_timeout(300)
        print('réponse pendant la lecture ignorée :',await prof.evaluate('Object.keys(G.ans).length===0'))
        await prof.screenshot(path=OUT+'read.png');await s[0].screenshot(path=OUT+'s_read.png')
        await prof.wait_for_timeout(3000)
        print('après la lecture : voile',await prof.evaluate('$("g-choices").classList.contains("veil")'),'| élève',await s[0].evaluate('$("q-ans").classList.contains("reading")'))
        await s[0].click('#q-ans .ab[data-k="%d"]'%q['ans']);await prof.wait_for_timeout(1200)
        await s[1].click('#q-ans .ab[data-k="%d"]'%q['ans']);await prof.wait_for_timeout(400)
        await s[2].click('#q-ans .ab[data-k="%d"]'%((q['ans']+1)%q['n']));await prof.wait_for_timeout(600)
        live=await prof.evaluate('Array.prototype.map.call(document.querySelectorAll("#gl-list li"),function(li){return li.textContent+":"+getComputedStyle(li).color})')
        print('colonne en direct :',live,'| compteur',(await prof.text_content('#gl-n')).strip())
        await prof.screenshot(path=OUT+'live.png')
        await prof.wait_for_timeout(2500)
        pts=await prof.evaluate('plist().map(function(p){return p.p+"="+p.ans[0].pts})')
        print('points justesse seule (Léa lente, Hugo rapide) :',pts)
        print('colonne après correction :',await prof.evaluate('Array.prototype.map.call(document.querySelectorAll("#gl-list li"),function(li){return li.textContent+":"+li.className})'))
        await prof.screenshot(path=OUT+'rv.png')
        await prof.evaluate('endGame(true)');await prof.wait_for_timeout(4500)
        print('guirlande : ampoules allumées',await prof.evaluate('document.querySelectorAll("#end-anim .pod.show").length'),'| initiales équipe 1 :',await prof.evaluate('(document.querySelector("#end-anim .pod.p1 .av")||{}).textContent'))
        await prof.screenshot(path=OUT+'end.png');await s[0].screenshot(path=OUT+'s_end.png')
        await br.close()
asyncio.run(main())
print('\n'.join(errs[:20]) or 'aucune erreur JS')
