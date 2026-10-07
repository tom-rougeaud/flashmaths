/* ═══════════════════════════════════════════════════════════════
   PAGE PROF — éditeur de questions (ajout · modification · duplication)
═══════════════════════════════════════════════════════════════ */
var ED={id:null,from:null};
function errOptions(sel){return Object.keys(ERR).map(function(k){return '<option value="'+k+'"'+(k===sel?" selected":"")+'>'+esc(ERR[k].e+"  "+ERR[k].l)+"</option>";}).join("");}
function chapList(){var s={};BANK.forEach(function(it){s[it.chap]=1;});return Object.keys(s);}
function openEditor(id,newTpl){
  var c=null,it=id?ITEM_BY_ID[id]:null,fromBuiltin=false;
  if(it&&it.custom){c=CUSTOM.filter(function(x){return x.id===id;})[0];}
  else if(it){      /* notice intégrée : on part d’un exemple tiré au sort */
    var q=makeQuestion(id,Math.floor(Math.random()*1e6),{metiers:P.metiers});fromBuiltin=true;
    if(q){c={id:null,titre:it.titre+" (copie)",chap:it.chap,niv:it.niv.slice(),d:it.d,t:TIMES[id]||0,q:q.q,ok:q.choices[q.ans].t,
      wr:q.choices.filter(function(x,k){return k!==q.ans;}).map(function(x){return {t:x.t,err:x.err||"autre"};}),expl:q.expl,vars:[]};}
  }
  if(!c)c={id:null,titre:"",chap:"Mes questions",niv:NIVEAUX.map(function(n){return n.id;}),d:2,t:0,q:"",ok:"",wr:[{t:"",err:"calc"},{t:"",err:"calc"},{t:"",err:"calc"}],expl:"",vars:[]};
  ED.id=c.id;ED.from=fromBuiltin?id:null;
  var vt=(c.vars||[]).map(function(x){return x.n+"="+x.min+".."+x.max+(x.st!==1?"/"+x.st:"");}).join("\n");
  var h='<div class="ed">'+
   '<div class="edrow"><label>Chapitre<input id="ed-chap" list="ed-chaps" value="'+esc(c.chap)+'"><datalist id="ed-chaps">'+chapList().map(function(x){return '<option value="'+esc(x)+'">';}).join("")+'</datalist></label>'+
   '<label>Notion (titre court)<input id="ed-titre" value="'+esc(c.titre)+'" maxlength="90"></label></div>'+
   '<div class="edrow"><div><span class="edl">Niveaux concernés</span><div class="mchips">'+NIVEAUX.map(function(n){return '<label class="mchip"><input type="checkbox" class="ed-niv" value="'+n.id+'"'+(c.niv.indexOf(n.id)>=0?" checked":"")+'> '+esc(n.court||n.label)+"</label>";}).join("")+'</div></div>'+
   '<label>Difficulté<select id="ed-d"><option value="1"'+(c.d===1?" selected":"")+'>1 · facile</option><option value="2"'+(c.d===2?" selected":"")+'>2 · moyen</option><option value="3"'+(c.d===3?" selected":"")+'>3 · difficile</option></select></label>'+
   '<label>Temps (s)<input id="ed-t" type="number" min="5" max="1800" step="5" placeholder="auto" value="'+(c.t||"")+'" style="width:90px"></label></div>'+
   '<label>Énoncé<textarea id="ed-q" rows="3" maxlength="600">'+esc(c.q)+'</textarea></label>'+
   '<label>Bonne réponse<input id="ed-ok" value="'+esc(c.ok)+'" maxlength="120" placeholder="ex. 12,5 km"></label>'+
   [0,1,2].map(function(i){var w=c.wr[i]||{t:"",err:"calc"};return '<div class="edrow"><label>Mauvaise réponse '+(i+1)+'<input class="ed-wr" value="'+esc(w.t)+'" maxlength="120"></label><label>Piège qu’elle représente<select class="ed-er">'+errOptions(w.err)+"</select></label></div>";}).join("")+
   '<label>Explication « Comment faire »<textarea id="ed-ex" rows="2" maxlength="600">'+esc(c.expl)+'</textarea></label>'+
   '<details class="edv"><summary>Variables aléatoires (facultatif)</summary><p class="edh">Une variable par ligne, par exemple <code>a=2..9</code> ou <code>p=5..50/5</code> (pas de 5). Dans l’énoncé et les réponses, écris <code>{a}</code> ou un calcul <code>{a*p/100}</code> (fonctions : sqrt, round, abs). Chaque élève/partie reçoit alors des valeurs différentes.</p><textarea id="ed-vars" rows="3">'+esc(vt)+'</textarea></details>'+
   (fromBuiltin?'<label class="row" style="cursor:pointer"><input type="checkbox" class="cb" id="ed-hide"> Masquer la notice d’origine après enregistrement</label>':"")+
   '<div class="edmsg" id="ed-msg"></div>'+
   '<div class="row" style="justify-content:flex-end"><button class="btn btn-sm" id="ed-prev">Tester (exemple)</button><button class="btn btn-green" id="ed-save">Enregistrer</button></div></div>';
  $("me-t").textContent=c.id?"Modifier la question":fromBuiltin?"Dupliquer et modifier une notice":"Nouvelle question";
  $("me-b").innerHTML=h;$("m-edit").classList.add("on");
  $("ed-prev").onclick=function(){var r=readEditor();if(!r.c){$("ed-msg").textContent=r.err;return;}showEdPreview(r.c);};
  $("ed-save").onclick=saveEditor;
}
function readEditor(){
  var vars=parseVars($("ed-vars").value);
  var niv=[].slice.call(document.querySelectorAll(".ed-niv")).filter(function(x){return x.checked;}).map(function(x){return x.value;});
  var wr=[].slice.call(document.querySelectorAll(".ed-wr")).map(function(x,i){return {t:x.value.trim(),err:document.querySelectorAll(".ed-er")[i].value};});
  var raw={id:ED.id,titre:$("ed-titre").value.trim(),chap:$("ed-chap").value.trim(),niv:niv,d:+$("ed-d").value,t:+$("ed-t").value||0,q:$("ed-q").value.trim(),ok:$("ed-ok").value.trim(),wr:wr,expl:$("ed-ex").value.trim(),vars:vars};
  if(!raw.q)return {err:"L’énoncé est vide."};
  if(!raw.ok)return {err:"Indique la bonne réponse."};
  if(wr.some(function(w){return !w.t;}))return {err:"Il faut 3 mauvaises réponses."};
  if(!raw.titre)raw.titre="Question perso";
  var c=cleanItem(raw);
  if(!c)return {err:"Question incomplète."};
  var all=[c.ok].concat(c.wr.map(function(w){return w.t;}));
  if(!vars.length&&all.some(function(x,i){return all.indexOf(x)!==i;}))return {err:"Deux réponses sont identiques."};
  if(vars.length&&testCustom(c)>=10)return {err:"Avec ces variables, trop de tirages donnent des réponses identiques : ajuste les valeurs."};
  return {c:c};
}
function showEdPreview(c){
  var q=null,g=customGen(c);for(var t=0;t<20&&(!q||q.choices.length!==4);t++)q=g(mulberry32(Math.floor(Math.random()*1e6)));
  var h="<b>"+esc(q.q)+"</b><br>"+q.choices.map(function(x,k){return ANS[k].l+") "+esc(x.t)+(k===q.ans?"  ✔":"");}).join(" &nbsp; ");
  var n=answerNum(q);h+='<br><small>'+(n?"Éligible au mode expert (saisie libre).":"Non éligible à la saisie libre : en mode expert, cette question restera en QCM.")+"</small>";
  $("ed-msg").innerHTML=h;
}
function saveEditor(){
  var r=readEditor();if(!r.c){$("ed-msg").textContent=r.err;return;}
  var c=r.c,t=c.t;if(!c.id)c.id="c_"+genId();
  saveCustomItem(c);setTime(c.id,t);
  if(ED.from&&$("ed-hide")&&$("ed-hide").checked){hideBuiltin(ED.from);delete P.sel[ED.from];}
  P.sel[c.id]=true;saveSetup();
  $("m-edit").classList.remove("on");refreshAll();toast("Question enregistrée et sélectionnée");
}
$("me-x").onclick=function(){$("m-edit").classList.remove("on");};
$("m-edit").addEventListener("click",function(e){if(e.target===this)this.classList.remove("on");});
$("b-newq").onclick=function(){openEditor(null);};
$("b-expq").onclick=function(){if(!CUSTOM.length){toast("Aucune question personnalisée à exporter");return;}exportCustom();};
$("b-impq").onclick=function(){$("f-impq").click();};
$("f-impq").onchange=function(){
  var f=this.files[0];if(!f)return;
  importCustom(f,function(n){if(n<0)toast("Fichier illisible");else{toast(n+" question"+(n>1?"s":"")+" importée"+(n>1?"s":""));refreshAll();}});
  this.value="";
};
$("b-unhide").onclick=function(){restoreHidden();refreshAll();toast("Notices restaurées");};
