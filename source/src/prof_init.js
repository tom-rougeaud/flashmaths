/* ═══════════════════════════════════════════════════════════════
   PAGE PROF — démarrage, en-tête, menu
═══════════════════════════════════════════════════════════════ */
function setView(v){
  P.view=v;document.body.classList.remove("v-proj","v-mob");document.body.classList.add("v-"+v);
  $$("#vsw button").forEach(function(b){b.classList.toggle("on",b.getAttribute("data-v")===v);});
  saveSetup();
}
$("vsw").addEventListener("click",function(e){var b=e.target.closest("button");if(b)setView(b.getAttribute("data-v"));});
function soundBtn(){$("b-sound").innerHTML=P.mute?ICO.mute:ICO.sound;$("b-sound").title=P.mute?"Son coupé":"Son activé";SND.setMute(P.mute);}
$("b-sound").addEventListener("click",function(){P.mute=!P.mute;saveSetup();soundBtn();SND.unlock();SND.pop();});
$("b-full").addEventListener("click",function(){
  var d=document,el=d.documentElement;
  try{
    if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d);}
    else{(el.requestFullscreen||el.webkitRequestFullscreen).call(el);}
  }catch(e){}
});
$("b-menu").addEventListener("click",function(e){e.stopPropagation();$("menu").classList.toggle("hidden");});
document.addEventListener("click",function(e){if(!e.target.closest(".menu-w"))$("menu").classList.add("hidden");});
$("menu").addEventListener("click",function(e){
  var b=e.target.closest("[data-m]");if(!b)return;$("menu").classList.add("hidden");
  var m=b.getAttribute("data-m");
  if(m==="hist"){openModal("m-hist");renderHist("local");}
  else if(m==="mine")openMine();
  else if(m==="diag")openDiag();
  else if(m==="help")openModal("m-help");
});
function dbBanner(){
  var c=fmConfig(),w=$("dbwarn");
  if(!c||c.bad){
    netPill("ko","Base non branchée");
    w.className="warn";w.innerHTML="<b>La base de données n’est pas encore branchée.</b> Vous pouvez préparer vos questions dès maintenant ; pour ouvrir une salle, suivez les 4 étapes du <a href=\"#\" id=\"dbw-go\">diagnostic</a> (5 minutes, une seule fois).";
    $("dbw-go").addEventListener("click",function(e){e.preventDefault();openDiag();});
    return;
  }
  w.className="hidden";
  rpc("fm_ping",{},8000).then(function(r){
      if(r&&r.ok)netPill("ok","Base connectée");else netPill("ko","Base : réponse inattendue");
      if(r&&r.ok&&r.version<4){w.className="warn";w.innerHTML="<b>Mise à jour de la base nécessaire :</b> relancez une fois le script <code>flash_maths.sql</code> dans Supabase (SQL Editor → Run). Sans cela, le code prof du mode Classe VS Prof ne fonctionne pas.";}
    })
    .catch(function(e){netPill("ko","Base injoignable");w.className="err";w.innerHTML=esc(netErrText(e))+' <a href="#" id="dbw-go">Ouvrir le diagnostic</a>';$("dbw-go").addEventListener("click",function(ev){ev.preventDefault();openDiag();});});
}
/* bouton « Ouvrir la salle » et compagnie : icônes */
$("b-gen").innerHTML=ICO.bolt+"Générer";
$("b-open").innerHTML=ICO.rocket+"Ouvrir la salle";
$("b-surprise").innerHTML=ICO.dice+"Surprends-moi";
$("b-import").innerHTML=ICO.upload+"Importer des questions";
$("b-newq").innerHTML=ICO.plus+"Créer une notion";
$("pv-regen").innerHTML=ICO.refresh+"Tout regénérer";
$("pv-add").innerHTML=ICO.plus+"Ajouter une question";
$("mine-imp").innerHTML=ICO.upload+"Importer des questions";
$("b-full").innerHTML=ICO.full;$("b-menu").innerHTML=ICO.menu;
$("lb-hostcode").innerHTML=ICO.lock+"Afficher le code prof";
$("g-players").innerHTML=ICO.users+"Joueurs";
$("m-q").addEventListener("click",function(e){if(e.target.id==="m-q"){var q=QS[MQ.i];if(q&&q.fresh){QS.splice(MQ.i,1);renderPreview();}}});
(function init(){
  $("brand").outerHTML=brandHtml("prof","index.html");
  $("foot").innerHTML=footHtml();
  initZoom("prof",$("zoom"));
  loadSetup();soundBtn();
  setView(P.view||(window.innerWidth<720?"mob":"proj"));
  refreshAll();dbBanner();
  var snap=readSnapshot();
  if(snap&&fmConfig()&&!fmConfig().bad){
    var r=$("resume");
    r.innerHTML='<div class="warn" style="margin-bottom:1rem">Une partie était en cours (salle <b>'+esc(snap.code)+"</b>"+(snap.phase!=="lobby"?", question "+(snap.i+1)+" / "+(snap.qs||[]).length:"")+') — <button type="button" class="btn btn-sm btn-mint" id="rs-go">Reprendre</button> <button type="button" class="btn btn-sm" id="rs-no">Ignorer</button></div>';
    $("rs-go").onclick=function(){r.innerHTML="";resumeGame(snap);};
    $("rs-no").onclick=function(){r.innerHTML="";var s=snap;rpc("fm_close_room",{p_code:s.code,p_token:s.token}).catch(function(){});clearSnapshot();};
  }
  window.addEventListener("beforeunload",function(e){if(G&&G.phase!=="lobby"&&G.phase!=="end"){snapshot();e.preventDefault();e.returnValue="";}});
  document.addEventListener("visibilitychange",function(){if(!document.hidden&&G)hostPing(false);});
})();
