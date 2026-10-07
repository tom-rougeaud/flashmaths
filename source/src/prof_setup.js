/* ═══════════════════════════════════════════════════════════════
   PAGE PROF — A. réglages : arbre programme, recherche, panneau
═══════════════════════════════════════════════════════════════ */
var P={sel:{},mode:"duel",level:"std",hide:false,nteams:4,nq:10,dur:0,ds:5,metiers:["general"],boss:"normal",profPlays:false,code:genCode(),mute:false,auto:false,view:null};
var SAVEKEY="flash_prof_setup";
function loadSetup(){
  try{var s=JSON.parse(localStorage.getItem(SAVEKEY)||"null");if(s)for(var k in s)if(k!=="code")P[k]=s[k];}catch(e){}
  var ok={};Object.keys(P.sel||{}).forEach(function(id){if(ITEM_BY_ID[id]&&P.sel[id])ok[id]=true;});P.sel=ok;
  if(!P.metiers||!P.metiers.length)P.metiers=["general"];
}
function saveSetup(){try{localStorage.setItem(SAVEKEY,JSON.stringify(P));}catch(e){}}
function selIds(){return Object.keys(P.sel).filter(function(k){return P.sel[k];});}
function toast(msg,ms){var t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(function(){t.remove();},ms||2600);}
function norm(s){return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");}

/* ── arbre niveaux > chapitres > items ── */
var TREE=buildTree(),HAY={},OTHERS={};
function rebuildHay(){
  HAY={};OTHERS={};
  var lvlWords={"3pm":"3pm 3e 3eme troisieme prepa metiers college","cap":"cap certificat aptitude professionnelle","2nde":"2nde seconde 2de bac pro","1re":"1re premiere 1ere bac pro","term":"term terminale tle bac pro"};
  BANK.forEach(function(it){
    var txt=[it.titre,it.chap,it.tags.join(" ")];
    it.niv.forEach(function(n){txt.push(lvlWords[n]);});
    Object.keys(METIERS).forEach(function(m,k){var q=makeQuestion(it.id,4242+k,{metiers:[m]});if(q)txt.push(q.q);});
    HAY[it.id]=norm(txt.join(" "));
    OTHERS[it.id]=it.niv;
  });
}
rebuildHay();
function refreshAll(){TREE=buildTree();rebuildHay();renderTree();applySearch();var u=$("b-unhide");u.classList.toggle("hidden",!hiddenCount());u.textContent="Restaurer les questions masquées ("+hiddenCount()+")";}
function niveauCourt(id){var r="";NIVEAUX.forEach(function(n){if(n.id===id)r=n.court;});return r;}
function stars(d){return "●".repeat(d)+"○".repeat(3-d);}
function renderTree(){
  var h="";
  TREE.forEach(function(L){
    h+='<details class="acc lvl" data-niv="'+L.niv.id+'" style="--lc:'+L.niv.color+'55"><summary><input type="checkbox" class="cb" data-lv="'+L.niv.id+'"><span>'+L.niv.emoji+" "+esc(L.niv.label)+'</span><span class="cnt" data-lc="'+L.niv.id+'"></span><span class="chev">▶</span></summary>';
    L.chaps.forEach(function(C,ci){
      var key=L.niv.id+"|"+ci;
      h+='<details class="acc chap" data-ch="'+key+'"><summary><input type="checkbox" class="cb" data-chk="'+key+'"><span class="ct">'+esc(C.nom)+'</span><span class="cnt" data-cc="'+key+'"></span><span class="chev">▶</span></summary><div class="items">';
      C.items.forEach(function(it){
        var oth=it.niv.filter(function(n){return n!==L.niv.id;}).map(niveauCourt).join(" · ");
        h+='<label class="item" data-id="'+it.id+'"><input type="checkbox" class="cb" data-it="'+it.id+'"><span class="t">'+esc(it.titre)+"</span>"+(it.custom?'<span class="cust">perso</span>':"")+(oth?'<span class="also" title="Cet item existe aussi dans ces niveaux (une seule sélection)">+ '+esc(oth)+"</span>":"")+'<span class="dif" title="Difficulté">'+stars(it.d)+'</span><input class="tmin'+(TIMES[it.id]?" set":"")+'" type="number" min="5" max="1800" step="5" placeholder="s" value="'+(TIMES[it.id]||"")+'" data-tm="'+it.id+'" title="Temps de réponse en secondes pour cette notice (vide = automatique)"><button class="ibtn" data-edit="'+it.id+'" title="'+(it.custom?"Modifier cette question":"Dupliquer et modifier")+'">Éditer</button><button class="ibtn" data-del="'+it.id+'" title="'+(it.custom?"Supprimer":"Masquer")+'">✕</button><button class="eye" data-eye="'+it.id+'" title="Voir un exemple de question">Voir</button></label>';
      });
      h+="</div></details>";
    });
    h+="</details>";
  });
  $("tree").innerHTML=h;
  refreshTree();
}
function refreshTree(){
  var lv={},ch={};
  TREE.forEach(function(L){
    var lt=0,ls=0;
    L.chaps.forEach(function(C,ci){
      var key=L.niv.id+"|"+ci,tot=C.items.length,s=0;
      C.items.forEach(function(it){if(P.sel[it.id])s++;});
      ch[key]=[s,tot];lt+=tot;ls+=s;
    });
    lv[L.niv.id]=[ls,lt];
  });
  var set=function(box,a){box.checked=a[0]>0&&a[0]===a[1];box.indeterminate=a[0]>0&&a[0]<a[1];};
  var i,els;
  els=document.querySelectorAll("[data-it]");for(i=0;i<els.length;i++){var id=els[i].getAttribute("data-it");els[i].checked=!!P.sel[id];els[i].closest(".item").classList.toggle("sel",!!P.sel[id]);}
  els=document.querySelectorAll("[data-chk]");for(i=0;i<els.length;i++){set(els[i],ch[els[i].getAttribute("data-chk")]);}
  els=document.querySelectorAll("[data-lv]");for(i=0;i<els.length;i++){set(els[i],lv[els[i].getAttribute("data-lv")]);}
  els=document.querySelectorAll("[data-cc]");for(i=0;i<els.length;i++){var a=ch[els[i].getAttribute("data-cc")];els[i].textContent=a[0]+"/"+a[1];els[i].classList.toggle("on",a[0]>0);}
  els=document.querySelectorAll("[data-lc]");for(i=0;i<els.length;i++){var b=lv[els[i].getAttribute("data-lc")];els[i].textContent=b[0]+"/"+b[1];els[i].classList.toggle("on",b[0]>0);}
  updateSummary();
}
function itemsOfChap(key){var p=key.split("|"),r=[];TREE.forEach(function(L){if(L.niv.id===p[0])r=L.chaps[+p[1]].items;});return r;}
function itemsOfLevel(id){var r=[];TREE.forEach(function(L){if(L.niv.id===id)L.chaps.forEach(function(C){r=r.concat(C.items);});});return r;}
function setMany(items,on){items.forEach(function(it){if(on)P.sel[it.id]=true;else delete P.sel[it.id];});saveSetup();refreshTree();}
$("tree").addEventListener("change",function(e){
  var t=e.target;
  if(t.hasAttribute("data-it")){var id=t.getAttribute("data-it");if(t.checked)P.sel[id]=true;else delete P.sel[id];saveSetup();refreshTree();}
  else if(t.hasAttribute("data-chk"))setMany(visibleOnly(itemsOfChap(t.getAttribute("data-chk"))),t.checked);
  else if(t.hasAttribute("data-lv"))setMany(visibleOnly(itemsOfLevel(t.getAttribute("data-lv"))),t.checked);
});
var DELARM=null;
$("tree").addEventListener("click",function(e){
  var b=e.target.closest("[data-eye]");if(b){e.preventDefault();e.stopPropagation();openPreview(b.getAttribute("data-eye"));return;}
  b=e.target.closest("[data-edit]");if(b){e.preventDefault();e.stopPropagation();openEditor(b.getAttribute("data-edit"));return;}
  b=e.target.closest("[data-del]");
  if(b){
    e.preventDefault();e.stopPropagation();
    var id=b.getAttribute("data-del");
    if(DELARM!==id){DELARM=id;b.textContent="Sûr ?";b.style.background="#FEE2E2";setTimeout(function(){if(DELARM===id){DELARM=null;if(b.isConnected){b.textContent="✕";b.style.background="";}}},3000);return;}
    DELARM=null;delete P.sel[id];
    if(ITEM_BY_ID[id].custom){deleteCustomItem(id);toast("Question supprimée");}
    else{hideBuiltin(id);toast("Notice masquée (restaurable en haut de la liste)");}
    saveSetup();refreshAll();
  }
});
$("tree").addEventListener("change",function(e){
  var t=e.target;if(!t.hasAttribute("data-tm"))return;
  var v=parseInt(t.value,10);setTime(t.getAttribute("data-tm"),v>0?v:0);t.classList.toggle("set",v>0);
  if(!(v>0))t.value="";
});

function visibleOnly(items){return SEARCH.terms.length?items.filter(function(it){return SEARCH.match[it.id];}):items;}

/* ── recherche sur tout le contenu ── */
var SEARCH={terms:[],match:{},saved:null};
function hlText(text,terms){
  var n=norm(text),mark=new Array(text.length+1).join("0").split(""),i;
  terms.forEach(function(t){var p=0,k;while((k=n.indexOf(t,p))>=0){for(i=k;i<k+t.length;i++)mark[i]="1";p=k+t.length;}});
  var out="",open=false;
  for(i=0;i<text.length;i++){
    if(mark[i]==="1"&&!open){out+="<mark>";open=true;}
    if(mark[i]!=="1"&&open){out+="</mark>";open=false;}
    out+=esc(text.charAt(i));
  }
  return out+(open?"</mark>":"");
}
function applySearch(){
  var raw=$("q").value.trim(),terms=norm(raw).split(/\s+/).filter(Boolean);
  SEARCH.terms=terms;SEARCH.match={};
  $("q-x").classList.toggle("hidden",!raw);
  var dets=document.querySelectorAll("#tree details");
  if(terms.length&&!SEARCH.saved){SEARCH.saved=[];for(var i=0;i<dets.length;i++)SEARCH.saved.push(dets[i].open);}
  var nm=0;
  BANK.forEach(function(it){
    var m=terms.every(function(t){return HAY[it.id].indexOf(t)>=0;});
    if(m){SEARCH.match[it.id]=true;nm++;}
  });
  var rows=document.querySelectorAll("#tree label.item");
  for(var r=0;r<rows.length;r++){
    var id=rows[r].getAttribute("data-id"),vis=!terms.length||SEARCH.match[id],t=rows[r].querySelector(".t");
    rows[r].classList.toggle("hidden",!vis);
    t.innerHTML=terms.length&&vis?hlText(ITEM_BY_ID[id].titre,terms):esc(ITEM_BY_ID[id].titre);
  }
  var chs=document.querySelectorAll("#tree details.chap");
  for(var c=0;c<chs.length;c++){
    var any=chs[c].querySelector("label.item:not(.hidden)"),has=!terms.length||!!any;
    chs[c].classList.toggle("hidden",!has);
    var ct=chs[c].querySelector(".ct"),orig=itemsOfChap(chs[c].getAttribute("data-ch"));
    chs[c].querySelector(".ct").innerHTML=terms.length?hlText(chapName(chs[c].getAttribute("data-ch")),terms):esc(chapName(chs[c].getAttribute("data-ch")));
    if(terms.length&&has)chs[c].open=true;
  }
  var lvs=document.querySelectorAll("#tree details.lvl");
  for(var l=0;l<lvs.length;l++){
    var anyc=lvs[l].querySelector("details.chap:not(.hidden)"),hasl=!terms.length||!!anyc;
    lvs[l].classList.toggle("hidden",!hasl);
    if(terms.length&&hasl)lvs[l].open=true;
  }
  if(!terms.length&&SEARCH.saved){var all=document.querySelectorAll("#tree details");for(var k=0;k<all.length&&k<SEARCH.saved.length;k++)all[k].open=SEARCH.saved[k];SEARCH.saved=null;}
  var rb=$("resbar");
  if(terms.length){
    rb.classList.remove("hidden");
    rb.innerHTML=nm?'<span class="chip">'+nm+" résultat"+(nm>1?"s":"")+'</span><button class="btn btn-sm btn-green" id="rb-all">Tout sélectionner</button><button class="btn btn-sm" id="rb-none">Désélectionner</button>':'<span class="chip">Aucun résultat — essaie un autre mot (ex. « pourcentage », « 1re », « TVA »)</span>';
    var a=$("rb-all"),b=$("rb-none");
    if(a)a.onclick=function(){setMany(BANK.filter(function(it){return SEARCH.match[it.id];}),true);};
    if(b)b.onclick=function(){setMany(BANK.filter(function(it){return SEARCH.match[it.id];}),false);};
  }else rb.classList.add("hidden");
}
function chapName(key){var p=key.split("|"),r="";TREE.forEach(function(L){if(L.niv.id===p[0])r=L.chaps[+p[1]].nom;});return r;}
$("q").addEventListener("input",applySearch);
$("q-x").onclick=function(){$("q").value="";applySearch();$("q").focus();};
$("b-open").onclick=function(){
  var ds=document.querySelectorAll("#tree details:not(.hidden)"),allOpen=true,i;
  for(i=0;i<ds.length;i++)if(!ds[i].open)allOpen=false;
  for(i=0;i<ds.length;i++)ds[i].open=!allOpen;
  $("b-open").textContent=allOpen?"Tout déplier":"Tout replier";
};
$("b-none").onclick=function(){P.sel={};saveSetup();refreshTree();};
$("b-rand").onclick=function(){
  var chaps=[];TREE.forEach(function(L){L.chaps.forEach(function(C){chaps.push(C);});});
  var r=mulberry32(Date.now()),pickc=shuffle(r,chaps).slice(0,3);
  P.sel={};pickc.forEach(function(C){C.items.forEach(function(it){P.sel[it.id]=true;});});
  saveSetup();refreshTree();toast("3 chapitres tirés au hasard : "+pickc.map(function(c){return c.nom;}).join(" · "),4200);
};

/* ── aperçu d’une question ── */
var PREV={id:null,seed:1};
function openPreview(id,seed){
  PREV.id=id;PREV.seed=seed||Math.floor(Math.random()*1e6);
  var it=ITEM_BY_ID[id],q=makeQuestion(id,PREV.seed,{metiers:P.metiers});
  $("mp-t").textContent=it.titre;
  if(!q){$("mp-b").innerHTML="<p>Impossible de générer un exemple.</p>";}
  else{
    var h='<div class="qmeta"><span class="chip">'+esc(it.chap)+'</span><span class="chip">'+stars(it.d)+" · "+(it.d===1?"15":it.d===3?"30":"20")+' s</span></div><div class="prevq">'+esc(q.q)+'</div><div class="prevc">';
    q.choices.forEach(function(c,k){var a=ANS[k];h+='<div style="background:'+a.c+";color:"+a.t+";"+(k===q.ans?"outline:5px solid #2F9E44;outline-offset:2px":"")+'">'+a.s+" "+esc(c.t)+(k===q.ans?" ✔":"")+"</div>";});
    h+='</div><div class="expl" style="margin-top:14px"><small>Comment faire</small>'+esc(q.expl)+"</div>";
    var errs=q.choices.filter(function(c,k){return k!==q.ans&&c.err&&c.err!=="autre";});
    if(errs.length){h+='<div style="font-weight:800;margin-top:8px">Pièges repérés par la question :</div>';errs.forEach(function(c){var E=ERR[c.err];h+='<div style="font-weight:700;margin:4px 0">'+E.e+" <b>"+esc(c.t)+"</b> → "+esc(E.l)+"</div>";});}
    $("mp-b").innerHTML=h;
  }
  $("m-prev").classList.add("on");
}
$("mp-re").onclick=function(){openPreview(PREV.id);};
$("mp-x").onclick=function(){$("m-prev").classList.remove("on");};
$("m-prev").addEventListener("click",function(e){if(e.target===this)this.classList.remove("on");});

/* ── panneau « Ma partie » ── */
var DURS=[[0,"Auto"],[15,"15 s"],[30,"30 s"],[60,"1 min"],[120,"2 min"],[300,"5 min"]],LVLS=[["std","Standard"],["prog","Progressif"],["exp","Expert"]],DSS=[[0,"Aucune"],[5,"5 s"],[10,"10 s"]],BOSSL=[["easy","Facile"],["normal","Normal"],["hard","Costaud"]];
var CTILE=["#14213D"];
function codeTiles(code){return code.split("").map(function(c,i){return '<div class="ctile" style="background:'+CTILE[i%4]+'">'+c+"</div>";}).join("");}
function studentUrl(){
  var base=location.href.split("#")[0].split("?")[0];
  return /prof\.html$/i.test(base)?base.replace(/prof\.html$/i,"eleve.html"):base.replace(/[^\/]*$/,"eleve.html");
}
function segHtml(list,cur,attr){return list.map(function(x){return '<button data-'+attr+'="'+x[0]+'" class="'+(String(cur)===String(x[0])?"on":"")+'">'+x[1]+"</button>";}).join("");}
function renderPanel(){
  $("codebox").innerHTML=codeTiles(P.code);
  $("urlhint").innerHTML="Page élève : <b>"+esc(studentUrl().replace(/^https?:\/\//,""))+"</b>";
  var h="";
  Object.keys(MODES).forEach(function(k){var m=MODES[k];h+='<button class="mode'+(P.mode===k?" on":"")+'" data-mode="'+k+'"><span class="em">'+m.emoji+'</span><span><b>'+m.nom+"</b><small>"+m.desc+"</small></span></button>";});
  $("modes").innerHTML=h;
  var tl=[];for(var i=2;i<=6;i++)tl.push([i,i]);
  $("seg-teams").innerHTML=segHtml(tl,P.nteams,"nt");
  $("seg-boss").innerHTML=segHtml(BOSSL,P.boss,"bs");
  $("seg-lvl").innerHTML=segHtml(LVLS,P.level,"lvl");
  $("c-hide").checked=!!P.hide;
  $("seg-dur").innerHTML=segHtml(DURS,P.dur,"du");
  $("seg-ds").innerHTML=segHtml(DSS,P.ds,"dc");
  $("r-teams").classList.toggle("hidden",P.mode!=="duel");
  $("r-boss").classList.toggle("hidden",P.mode!=="boss");
  $("r-prof").classList.toggle("hidden",P.mode!=="boss");
  $("c-prof").checked=!!P.profPlays;
  $("nq").value=P.nq;$("nq-v").textContent=P.nq;
  var m="";Object.keys(METIERS).forEach(function(k){m+='<button class="mchip'+(P.metiers.indexOf(k)>=0?" on":"")+'" data-met="'+k+'">'+METIERS[k].emoji+" "+METIERS[k].label+"</button>";});
  $("metiers").innerHTML=m;
  updateSummary();
}
function updateSummary(){
  var n=selIds().length,per=(P.dur||21)+P.ds+9,mins=Math.max(1,Math.round(P.nq*per/60));
  $("sum").innerHTML=n?"<span class=\"hl\">"+n+" item"+(n>1?"s":"")+"</span> · "+P.nq+" questions · ≈ "+mins+" min":"Coche au moins un chapitre ou un item";
  $("b-open-room").disabled=!n;
}
$("panel").addEventListener("click",function(e){
  var b=e.target.closest("button");if(!b)return;
  if(b.hasAttribute("data-mode")){P.mode=b.getAttribute("data-mode");if(P.mode==="ronde")P.ds=Math.min(P.ds,0);}
  else if(b.hasAttribute("data-nt"))P.nteams=+b.getAttribute("data-nt");
  else if(b.hasAttribute("data-bs"))P.boss=b.getAttribute("data-bs");
  else if(b.hasAttribute("data-lvl"))P.level=b.getAttribute("data-lvl");
  else if(b.hasAttribute("data-du"))P.dur=+b.getAttribute("data-du");
  else if(b.hasAttribute("data-dc"))P.ds=+b.getAttribute("data-dc");
  else if(b.hasAttribute("data-met")){
    var k=b.getAttribute("data-met"),i=P.metiers.indexOf(k);
    if(i>=0){if(P.metiers.length>1)P.metiers.splice(i,1);}else P.metiers.push(k);
    if(k!=="general"&&P.metiers.indexOf("general")>=0&&P.metiers.length>1&&i<0)P.metiers.splice(P.metiers.indexOf("general"),1);
  }
  else return;
  saveSetup();renderPanel();
});
$("nq").addEventListener("input",function(){P.nq=+this.value;$("nq-v").textContent=P.nq;saveSetup();updateSummary();});
$("c-prof").addEventListener("change",function(){P.profPlays=this.checked;saveSetup();});
$("c-hide").addEventListener("change",function(){P.hide=this.checked;saveSetup();});
$("b-code").onclick=function(){P.code=genCode();$("codebox").innerHTML=codeTiles(P.code);$("urlhint").innerHTML="Page élève : <b>"+esc(studentUrl().replace(/^https?:\/\//,""))+"</b>";};
$("b-link").onclick=function(){
  var url=studentUrl()+"?c="+P.code;
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(function(){toast("Lien copié : "+url);},function(){toast(url,6000);});
  else toast(url,6000);
};
