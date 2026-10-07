/* ═══════════════════════════════════════════════════════════════
   PAGE PROF — 1. Choisir les notions et régler la partie
═══════════════════════════════════════════════════════════════ */
var P={lvl:"all",sel:[],mode:"duel",nq:10,dur:0,ord:"rand",fmt:"mix",nt:2,tnames:null,hide:false,auto:false,early:true,names:true,view:null,mute:false,vary:true,est:true,read:3,pts:"vite"};
function loadSetup(){var s=store.get("prof",null);if(s&&typeof s==="object")for(var k in P)if(s[k]!==undefined)P[k]=s[k];P.sel=(P.sel||[]).filter(function(id){return !!ITEM_BY_ID[id];});}
function saveSetup(){store.set("prof",P);}
function teamNames(){var a=P.tnames&&P.tnames.length?P.tnames:[];return TEAMS.map(function(t,i){return a[i]||t.n;});}

var DURS=[[0,"Auto"],[15,"15 s"],[30,"30 s"],[60,"1 min"],[120,"2 min"],[300,"5 min"]];
var NQS=[5,10,15,20];
var ORDS=[["rand","Mélangé"],["prog","Progressif"]];
var FMTS=[["qcm","QCM"],["mix","Mixte"],["libre","Saisie libre"]];
var READS=[[0,"Aucun"],[3,"3 s"],[5,"5 s"]];
var PTSM=[["vite","Justesse et rapidité"],["juste","Justesse seule"]];
var OPEN_CH={};      /* chapitres et sous-chapitres ouverts */
var TREE_SEL={};     /* clé de chapitre ou sous-chapitre → notions affichées */
var OPEN_IT=null;    /* item dont les options sont dépliées */
var EX_IT=null;      /* item dont l’exemple est affiché */

function normS(s){return String(s||"").toLowerCase().normalize?String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""):String(s||"").toLowerCase();}
function dStars(d){return '<span class="dstars" title="Difficulté '+d+'/3">'+"★★★".slice(0,d)+'<span style="opacity:.25">'+"★★★".slice(d)+"</span></span>";}
function canFree(it){
  if(it.custom){var c=customById(it.id);return !!c&&c.qs.some(function(q){return q.num!==undefined||q.lit;});}
  if(it.cours)return false;
  var q=makeQuestion(it.id,12345,{});return isFree(q);
}
var FREE_CACHE={};
function freeTag(it){if(FREE_CACHE[it.id]===undefined)FREE_CACHE[it.id]=canFree(it);return FREE_CACHE[it.id]?'<span class="tag t-sky" title="Peut se jouer en saisie libre">saisie</span>':"";}

/* ─── niveaux ─── */
function renderLevels(){
  var h='<button type="button" data-l="all"'+(P.lvl==="all"?' class="on"':"")+'>Tous</button>';
  NIVEAUX.forEach(function(n){h+='<button type="button" data-l="'+n.id+'" style="--lc:'+n.color+'"'+(P.lvl===n.id?' class="on"':"")+'>'+esc(n.court)+"</button>";});
  $("lvls").innerHTML=h;
}
$("lvls").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;P.lvl=b.getAttribute("data-l");saveSetup();renderLevels();renderTree();});

/* ─── arborescence (accordéons par chapitre) ─── */
function itemRow(it){
  var on=P.sel.indexOf(it.id)>=0,tm=TIMES[it.id];
  var h='<div class="it'+(on?" sel":"")+'" data-id="'+it.id+'"><input type="checkbox" '+(on?"checked ":"")+'aria-label="'+esc(it.titre)+'">'+
    '<div class="nm" data-tog="1">'+esc(it.titre)+(it.custom?' <span class="tag t-sun">perso</span>':"")+(it.cours?' <span class="tag t-mint">cours</span>':"")+'</div>'+
    '<div class="tg">'+(tm?'<span class="tag" title="Temps personnalisé">'+fmtDur(tm)+"</span>":"")+dStars(it.d)+'<button type="button" class="more" data-more="'+it.id+'" title="Options de la notion" aria-label="Options">⋯</button></div>';
  if(OPEN_IT===it.id){
    h+='<div class="it-x"><span class="small muted">Temps :</span><select class="inp" data-tm="'+it.id+'">'+[0,10,15,20,30,45,60,90,120,180,300].map(function(s){return '<option value="'+s+'"'+((tm||0)===s?" selected":"")+">"+(s?fmtDur(s):"automatique")+"</option>";}).join("")+'</select>'+
      '<button type="button" class="btn btn-sm btn-soft" data-ex="'+it.id+'">'+ICO.eye+'Exemple</button>'+
      (it.custom?'<button type="button" class="btn btn-sm btn-soft" data-edit="'+it.id+'">'+ICO.edit+'Modifier</button><button type="button" class="btn btn-sm btn-ghost" data-del="'+it.id+'">'+ICO.trash+'Supprimer</button>'
                :'<button type="button" class="btn btn-sm btn-soft" data-dup="'+it.id+'">'+ICO.edit+'Copier dans Mes questions</button><button type="button" class="btn btn-sm btn-ghost" data-hide="'+it.id+'">'+ICO.eyeoff+'Masquer</button>')+"</div>";
  }
  if(EX_IT===it.id){
    var q=makeQuestion(it.id,(Date.now()&0xffff)+7,{});
    if(q)h+='<div class="it-ex">'+kindTagHtml(q)+'<div class="ex-q">'+rt(q.q)+"</div>"+figBlock(q.fig)+exAnswers(q)+"</div>";
  }
  return h+"</div>";
}
function exAnswers(q){
  var k=qKind(q),c=qCorr(q);
  if(k==="assoc")return assocHtml(q,c);
  if(k==="ordre")return ordreHtml(q,c,q.sep);
  if(k==="slider")return scaleHtml(q.sl,{zone:{a:q.sl.ans,t:q.sl.tol},ans:q.sl.ans});
  return '<div class="ex-c">'+q.choices.map(function(c2,i){return '<span'+(i===q.ans?' class="ok"':"")+">"+rt(c2.t)+"</span>";}).join("")+"</div>";
}
function fmtDur(s){return s>=60?(s%60?Math.floor(s/60)+" min "+(s%60)+" s":(s/60)+" min"):s+" s";}
/* arborescence : niveau › chapitre › sous-chapitre › notions (accordéons emboîtés, teintes légères par profondeur) */
function matchQ(it,q){return !q||normS(it.titre+" "+it.chap+" "+(it.tags||[]).join(" ")).indexOf(q)>=0;}
function cntHtml(n,t){return '<span class="cnt'+(n?"":" z")+'">'+n+" / "+t+"</span>";}
function renderTree(){
  var tree=buildTree(),q=normS($("q-search").value.trim()),h="",any=false,lv=P.lvl;
  TREE_SEL={};
  tree.forEach(function(br){
    if(lv!=="all"&&br.niv.id!==lv)return;
    var chs="";
    br.chaps.forEach(function(ch){
      var key=br.niv.id+"|"+ch.nom,subs="",all=[];
      ch.subs.forEach(function(sc){
        var items=sc.items.filter(function(it){return matchQ(it,q);});
        if(!items.length)return;
        all=all.concat(items);
        var sk=key+"|"+sc.nom,ns=items.filter(function(it){return P.sel.indexOf(it.id)>=0;}).length,so=q||(OPEN_CH[sk]!==undefined?OPEN_CH[sk]:ns>0);
        TREE_SEL[sk]=items;
        subs+='<details class="sub" data-k="'+esc(sk)+'"'+(so?" open":"")+'><summary><input type="checkbox" class="chk" data-key="'+esc(sk)+'" '+(ns===items.length?"checked":"")+' aria-label="Tout le sous-chapitre « '+esc(sc.nom)+' »">'+
          '<span class="sn">'+esc(sc.nom)+"</span>"+cntHtml(ns,items.length)+'</summary><div class="items">'+items.map(itemRow).join("")+"</div></details>";
      });
      if(!all.length)return;
      any=true;TREE_SEL[key]=all;
      var nsel=all.filter(function(it){return P.sel.indexOf(it.id)>=0;}).length,open=q||OPEN_CH[key];
      chs+='<details class="acc chap" data-k="'+esc(key)+'" style="--lc:'+br.niv.color+'"'+(open?" open":"")+'><summary><input type="checkbox" class="chk" data-key="'+esc(key)+'" '+(nsel===all.length?"checked":"")+' aria-label="Tout le chapitre « '+esc(ch.nom)+' »">'+
        '<span class="cn">'+esc(ch.nom)+"</span>"+cntHtml(nsel,all.length)+'</summary><div class="subs">'+subs+"</div></details>";
    });
    if(chs)h+=(lv==="all"?'<div class="lvl-h" style="--lc:'+br.niv.color+'"><i></i>'+esc(br.niv.label)+"</div>":"")+chs;
  });
  $("tree").innerHTML=any?h:'<div class="none">Aucune notion ne correspond à « '+esc($("q-search").value)+' ».</div>';
  updateSel();
}
function chapItems(key){return TREE_SEL[key]||[];}
function toggleSel(id,on){var i=P.sel.indexOf(id);if(on&&i<0)P.sel.push(id);if(!on&&i>=0)P.sel.splice(i,1);}
$("tree").addEventListener("click",function(e){
  var t=e.target;
  var chk=t.closest("input.chk");
  if(chk){e.stopPropagation();var its=chapItems(chk.getAttribute("data-key"));its.forEach(function(it){toggleSel(it.id,chk.checked);});saveSetup();renderTree();return;}
  var row=t.closest(".it");
  if(t.matches(".it input[type=checkbox]")){toggleSel(row.getAttribute("data-id"),t.checked);saveSetup();row.classList.toggle("sel",t.checked);updateSel();updateChapCounts();return;}
  if(t.closest("[data-tog]")){var cb=row.querySelector("input[type=checkbox]");cb.checked=!cb.checked;toggleSel(row.getAttribute("data-id"),cb.checked);saveSetup();row.classList.toggle("sel",cb.checked);updateSel();updateChapCounts();return;}
  var b=t.closest("button");if(!b)return;
  if(b.hasAttribute("data-more")){var id=b.getAttribute("data-more");OPEN_IT=OPEN_IT===id?null:id;if(OPEN_IT!==id)EX_IT=null;renderTree();return;}
  if(b.hasAttribute("data-ex")){var id2=b.getAttribute("data-ex");EX_IT=EX_IT===id2?null:id2;renderTree();return;}
  if(b.hasAttribute("data-edit")){openItemEditor(b.getAttribute("data-edit"));return;}
  if(b.hasAttribute("data-dup")){dupBuiltin(b.getAttribute("data-dup"));return;}
  if(b.hasAttribute("data-hide")){var hid=b.getAttribute("data-hide");hideBuiltin(hid);toggleSel(hid,false);saveSetup();OPEN_IT=null;renderTree();toast("Notion masquée (menu › Mes questions pour la réafficher).");return;}
  if(b.hasAttribute("data-del")){
    if(b.getAttribute("data-arm")!=="1"){b.setAttribute("data-arm","1");b.innerHTML=ICO.trash+"Confirmer ?";setTimeout(function(){if(b.isConnected){b.removeAttribute("data-arm");b.innerHTML=ICO.trash+"Supprimer";}},3000);return;}
    var did=b.getAttribute("data-del");deleteCustomItem(did);toggleSel(did,false);saveSetup();OPEN_IT=null;renderTree();toast("Notion supprimée.");
  }
});
$("tree").addEventListener("change",function(e){var s=e.target.closest("select[data-tm]");if(s){setTime(s.getAttribute("data-tm"),+s.value);renderTree();}});
$("tree").addEventListener("toggle",function(e){var d=e.target;if(d.matches&&d.matches("details.chap,details.sub"))OPEN_CH[d.getAttribute("data-k")]=d.open;},true);
function updateChapCounts(){
  $$("#tree details.chap,#tree details.sub").forEach(function(d){
    var its=$$(".it",d),n=its.filter(function(r){return r.classList.contains("sel");}).length,sm=d.querySelector("summary"),c=sm.querySelector(".cnt"),k=sm.querySelector(".chk");
    c.textContent=n+" / "+its.length;c.classList.toggle("z",!n);k.checked=n===its.length;
  });
}
function updateSel(){
  var n=P.sel.length;
  $("sel-count").textContent=n?n+" notion"+(n>1?"s":"")+" cochée"+(n>1?"s":""):"Aucune notion cochée";
  $("b-gen").disabled=!n;$("b-gen").classList.toggle("pulse",n>0);
  $("set-sum").textContent=P.nq+" questions, "+(P.dur?fmtDur(P.dur):"temps auto")+", "+FMTS.filter(function(f){return f[0]===P.fmt;})[0][1].toLowerCase()+(P.read?", lecture "+P.read+" s":"")+(P.pts==="juste"?", justesse seule":"");
}
$("q-search").addEventListener("input",function(){clearTimeout(this._t);this._t=setTimeout(renderTree,150);});
$("b-clear").addEventListener("click",function(){P.sel=[];saveSetup();renderTree();});

/* ─── Surprends-moi : des notions au hasard, dans UN niveau ─── */
$("b-surprise").addEventListener("click",function(){
  if(P.lvl==="all"){
    toast("Choisissez d’abord un niveau : la surprise reste dans ce niveau.");
    var l=$("lvls");l.classList.remove("shake");void l.offsetWidth;l.classList.add("shake");return;
  }
  var br=buildTree().filter(function(b){return b.niv.id===P.lvl;})[0];if(!br)return;
  var chs=shuffle(Math.random,br.chaps.map(function(c){return shuffle(Math.random,c.items);})),pick=[],k=0,want=Math.min(5,br.chaps.reduce(function(s,c){return s+c.items.length;},0));
  while(pick.length<want&&k<60){var c=chs[k%chs.length];if(c.length){var it=c.shift();if(pick.indexOf(it.id)<0)pick.push(it.id);}k++;}
  P.sel=pick;saveSetup();OPEN_CH={};
  renderTree();SND.pop();
  toast(pick.length+" notions tirées au sort en "+br.niv.court+".");
});

/* ─── réglages ─── */
function segHtml(list,cur){return list.map(function(x){var v=Array.isArray(x)?x[0]:x,l=Array.isArray(x)?x[1]:x;return '<button type="button" data-v="'+v+'"'+(String(cur)===String(v)?' class="on"':"")+">"+esc(l)+"</button>";}).join("");}
var MODE_IC={solo:ICO.user,duel:ICO.users,boss:ICO.shield},MODE_C={solo:"#DE8743",duel:"#4A86CF",boss:"#8A6CC9"};
function renderSettings(){
  $("modes").innerHTML=["solo","duel","boss"].map(function(m){var M=MODES[m];return '<button type="button" class="mode'+(P.mode===m?" on":"")+'" data-m="'+m+'"><span class="mi" style="--mc:'+MODE_C[m]+'">'+MODE_IC[m]+'</span><span><b>'+esc(M.nom)+"</b><small>"+esc(M.desc)+"</small></span></button>";}).join("");
  $("seg-nq").innerHTML=segHtml(NQS,P.nq);
  $("seg-dur").innerHTML=segHtml(DURS,P.dur);
  $("seg-ord").innerHTML=segHtml(ORDS,P.ord);
  $("seg-fmt").innerHTML=segHtml(FMTS,P.fmt);
  $("seg-read").innerHTML=segHtml(READS,P.read);
  $("seg-pts").innerHTML=segHtml(PTSM,P.pts);
  $("seg-nt").innerHTML=segHtml([2,3,4,5,6],P.nt);
  $("w-teams").classList.toggle("hidden",P.mode!=="duel");
  $("o-hide").checked=!!P.hide;$("o-auto").checked=!!P.auto;$("o-early").checked=P.early!==false;$("o-names").checked=P.names!==false;
  $("o-vary").checked=P.vary!==false;$("o-est").checked=P.est!==false;
  updateSel();
}
$("modes").addEventListener("click",function(e){var b=e.target.closest(".mode");if(!b)return;P.mode=b.getAttribute("data-m");saveSetup();renderSettings();});
[["seg-nq","nq",true],["seg-dur","dur",true],["seg-ord","ord",false],["seg-fmt","fmt",false],["seg-nt","nt",true],["seg-read","read",true],["seg-pts","pts",false]].forEach(function(x){
  $(x[0]).addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var v=b.getAttribute("data-v");P[x[1]]=x[2]?+v:v;saveSetup();renderSettings();});
});
$("o-hide").addEventListener("change",function(){P.hide=this.checked;saveSetup();});
$("o-auto").addEventListener("change",function(){P.auto=this.checked;saveSetup();});
$("o-early").addEventListener("change",function(){P.early=this.checked;saveSetup();});
$("o-names").addEventListener("change",function(){P.names=this.checked;saveSetup();});
$("o-vary").addEventListener("change",function(){P.vary=this.checked;saveSetup();});
$("o-est").addEventListener("change",function(){P.est=this.checked;saveSetup();});

/* ═══ IMPORT DE QUESTIONS (texte avec « * ») ═══ */
function nivChecks(host,sel){
  $(host).innerHTML=NIVEAUX.map(function(n){return '<label><input type="checkbox" value="'+n.id+'"'+(sel.indexOf(n.id)>=0?" checked":"")+">"+esc(n.court)+"</label>";}).join("");
}
function nivRead(host){return $$("#"+host+" input:checked").map(function(i){return i.value;});}
function previewParsed(res,st,pv){
  var hs="";
  if(res.count)hs+='<div class="okbox"><b>'+res.count+" question"+(res.count>1?"s":"")+"</b> reconnue"+(res.count>1?"s":"")+(res.groups.length>1?" dans "+res.groups.length+" notions":"")+".</div>";
  var hard=res.errors.filter(function(e){return !e.soft;}),soft=res.errors.filter(function(e){return e.soft;});
  if(hard.length)hs+='<div class="err" style="margin-top:.5rem"><b>À corriger :</b><br>'+hard.slice(0,6).map(function(e){return "ligne "+e.line+" : "+esc(e.msg);}).join("<br>")+"</div>";
  if(soft.length)hs+='<div class="warn" style="margin-top:.5rem">'+soft.slice(0,4).map(function(e){return "ligne "+e.line+" : "+esc(e.msg);}).join("<br>")+"</div>";
  if(!res.count&&!res.errors.length)hs='<div class="muted">L’aperçu s’affiche ici pendant que vous tapez.</div>';
  $(st).innerHTML=hs;
  var h="";
  res.groups.forEach(function(g){
    if(res.groups.length>1||g.titre)h+='<div class="lbl">'+esc(g.titre||"Sans titre")+"</div>";
    g.qs.slice(0,40).forEach(function(o){
      h+='<div class="ipv"><div class="iq">'+rt(o.q)+'</div><div class="ic">';
      if(o.as)h+=o.as.map(function(p){return '<span class="ok">'+rt(p[0])+" ⟷ "+rt(p[1])+"</span>";}).join("");
      if(o.or)h+='<span class="ok">'+o.or.map(function(t){return rt(t);}).join(" → ")+"</span>";
      if(o.es)h+='<span class="ok">'+ICO.target.replace("<svg",'<svg style="width:1em;height:1em;vertical-align:-.15em"')+" ≈ "+esc(String(o.es.v).replace(".",","))+(o.es.u?" "+esc(o.es.u):"")+(o.es.min!==undefined?" (curseur de "+esc(String(o.es.min).replace(".",","))+" à "+esc(String(o.es.max).replace(".",","))+")":"")+"</span>";
      if(o.wr&&o.wr.length){h+='<span class="ok">'+rt(o.ok)+"</span>"+o.wr.map(function(w){return "<span>"+rt(w)+"</span>";}).join("");}
      if(o.num!==undefined||o.lit)h+='<span class="ok">'+ICO.keyb.replace("<svg",'<svg style="width:1em;height:1em;vertical-align:-.15em"')+" "+esc(o.ft)+"</span>";
      h+="</div>"+(o.x?'<div class="ix">'+rt(o.x)+"</div>":"")+(o.t?'<div class="ix">'+fmtDur(o.t)+"</div>":"")+"</div>";
    });
  });
  $(pv).innerHTML=h;
}
var IMP_RES=null;
function refreshImport(){
  var txt=$("imp-ta").value.trim();
  if(/^\{/.test(txt)){$("imp-st").innerHTML='<div class="info">Fichier de sauvegarde JSON détecté : il sera restauré tel quel.</div>';$("imp-pv").innerHTML="";$("imp-go").disabled=false;IMP_RES={json:txt};return;}
  IMP_RES=parseImportText(txt);previewParsed(IMP_RES,"imp-st","imp-pv");
  $("imp-go").disabled=!IMP_RES.count;
}
function openImport(){
  closeModal("m-mine");
  nivChecks("imp-niv",P.lvl!=="all"?[P.lvl]:[]);
  $("imp-title").value="";refreshImport();openModal("m-import");
}
$("imp-ta").addEventListener("input",function(){clearTimeout(this._t);this._t=setTimeout(refreshImport,200);});
$("imp-ex").addEventListener("click",function(){var ta=$("imp-ta");ta.value=(ta.value.trim()?ta.value.trim()+"\n\n":"")+IMPORT_HELP_EXAMPLE;refreshImport();});
$("imp-file").addEventListener("change",function(){var f=this.files[0];if(!f)return;readFileText(f,function(t){if(t===null){toast("Fichier illisible.","ko");return;}$("imp-ta").value=t;if(!$("imp-title").value)$("imp-title").value=f.name.replace(/\.[^.]+$/,"").slice(0,90);refreshImport();});this.value="";});
$("imp-go").addEventListener("click",function(){
  if(!IMP_RES)return;
  if(IMP_RES.json){try{var n=importCustomJson(IMP_RES.json);toast(n+" notion(s) restaurée(s).","ok");}catch(e){toast("Sauvegarde illisible.","ko");return;}closeModal("m-import");refreshAll();return;}
  var niv=nivRead("imp-niv");if(!niv.length)niv=P.lvl!=="all"?[P.lvl]:NIVEAUX.map(function(x){return x.id;});
  var base=$("imp-title").value.trim()||"Mes questions",made=[];
  IMP_RES.groups.forEach(function(g,i){
    var c=cleanItem({titre:g.titre||(IMP_RES.groups.length>1?base+" "+(i+1):base),chap:"Mes questions",niv:niv,d:2,qs:g.qs});
    if(c){saveCustomItem(c);made.push(c.id);}
  });
  made.forEach(function(id){toggleSel(id,true);});saveSetup();
  niv.forEach(function(n){OPEN_CH[n+"|Mes questions"]=true;});
  closeModal("m-import");$("imp-ta").value="";refreshAll();
  toast(IMP_RES.count+" question(s) importée(s) et cochée(s).","ok");
});

/* ═══ ÉDITEUR D’UNE NOTION PERSO ═══ */
var IT_EDIT=null;
function openItemEditor(id,preset){
  closeModal("m-mine");
  var c=id?customById(id):null;
  IT_EDIT=c?c.id:null;
  var src=c||preset||{titre:"",niv:P.lvl!=="all"?[P.lvl]:[],d:2,qs:[],vars:[]};
  $("it-h").textContent=c?"Modifier « "+c.titre+" »":"Nouvelle notion";
  $("it-title").value=src.titre||"";$("it-d").value=String(src.d||2);
  nivChecks("it-niv",src.niv||[]);
  $("it-ta").value=src.qs&&src.qs.length?itemToText(src):"";
  $("it-ta").placeholder=IMPORT_HELP_EXAMPLE;
  $("it-vars").value=varsText(src.vars);
  refreshItem();openModal("m-item");
}
function readItem(){
  var res=parseImportText($("it-ta").value),qs=[];res.groups.forEach(function(g){qs=qs.concat(g.qs);});
  return {res:res,obj:{id:IT_EDIT||undefined,titre:$("it-title").value.trim()||"Ma notion",chap:"Mes questions",niv:nivRead("it-niv"),d:+$("it-d").value,qs:qs,vars:parseVars($("it-vars").value)}};
}
function refreshItem(){var r=readItem();previewParsed(r.res,"it-st","it-pv");}
["it-ta","it-vars"].forEach(function(id){$(id).addEventListener("input",function(){clearTimeout(this._t);this._t=setTimeout(refreshItem,200);});});
$("it-save").addEventListener("click",function(){
  var r=readItem(),c=cleanItem(r.obj);
  if(!c){toast("Ajoutez au moins une question complète.","ko");return;}
  if(IT_EDIT)c.id=IT_EDIT;
  var bad=testCustom(c);if(bad>=10){toast("Certaines questions ne s’affichent pas correctement : vérifiez les variables.","ko");return;}
  saveCustomItem(c);toggleSel(c.id,true);saveSetup();
  c.niv.forEach(function(n){OPEN_CH[n+"|Mes questions"]=true;});
  closeModal("m-item");refreshAll();toast("Notion enregistrée.","ok");
});
function dupBuiltin(id){
  var it=ITEM_BY_ID[id],qs=[],seen={};
  for(var s=0;s<40&&qs.length<8;s++){
    var q=makeQuestion(id,1000+s*7919,{});if(!q||seen[q.q+(q.L||q.D||"")])continue;seen[q.q+(q.L||q.D||"")]=1;
    if(q.kind){var cr=qCorr(q),ok2={q:q.q,x:q.expl};
      if(q.kind==="assoc")ok2.as=q.L.map(function(t,k){return [t,q.R[cr[k]]];});
      else if(q.kind==="ordre"){ok2.or=cr.map(function(j){return q.D[j];});ok2.how=q.how;ok2.sep=q.sep;}
      else ok2.es={v:rd(q.sl.ans,4),min:q.sl.min,max:q.sl.max,tol:q.sl.tol,u:q.sl.u};
      qs.push(ok2);continue;}
    var o={q:q.q,ok:q.choices[q.ans].t,wr:q.choices.filter(function(c,i){return i!==q.ans;}).map(function(c){return c.t;}),x:q.expl};
    if(q.qx)o.keep=1;
    if(q.num!==undefined){o.num=q.num;o.unit=q.unit;o.dec=q.dec;o.ft=f(q.num,q.dec)+(q.unit?" "+q.unit:"");}
    if(q.lit){o.lit=q.lit;o.ft=q.choices[q.ans].t.replace(/\$/g,"");}
    qs.push(o);
  }
  openItemEditor(null,{titre:it.titre+" (ma version)",niv:it.niv,d:it.d,qs:qs});
}

/* ═══ MES QUESTIONS (gestion) ═══ */
function openMine(){
  var h=CUSTOM.length?CUSTOM.map(function(c){return '<div class="mine-it"><b>'+esc(c.titre)+' <small class="muted">· '+c.qs.length+" question"+(c.qs.length>1?"s":"")+" · "+c.niv.map(function(n){return (NIVEAUX.filter(function(x){return x.id===n;})[0]||{}).court;}).join(", ")+'</small></b><button type="button" class="btn btn-sm btn-soft" data-ed="'+c.id+'">'+ICO.edit+'Modifier</button></div>';}).join(""):'<p class="muted">Aucune question personnelle pour l’instant. Importez-en, c’est rapide !</p>';
  $("mine-list").innerHTML=h;
  var hc=hiddenCount();$("mine-unhide").textContent="Réafficher les notions masquées ("+hc+")";$("mine-unhide").disabled=!hc;
  openModal("m-mine");
}
$("mine-list").addEventListener("click",function(e){var b=e.target.closest("[data-ed]");if(b)openItemEditor(b.getAttribute("data-ed"));});
$("mine-exp").addEventListener("click",function(){exportCustomJson();});
$("mine-file").addEventListener("change",function(){var f=this.files[0];if(!f)return;readFileText(f,function(t){try{var n=importCustomJson(t);toast(n+" notion(s) restaurée(s).","ok");refreshAll();openMine();}catch(e){toast("Sauvegarde illisible.","ko");}});this.value="";});
$("mine-unhide").addEventListener("click",function(){restoreHidden();refreshAll();openMine();toast("Notions réaffichées.","ok");});
$("mine-imp").addEventListener("click",openImport);
$("b-import").addEventListener("click",openImport);
$("b-newq").addEventListener("click",function(){openItemEditor(null);});

function refreshAll(){FREE_CACHE={};renderLevels();renderTree();renderSettings();}
