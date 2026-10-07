/* ═══════════════════════════════════════════════════════════════
   AFFICHAGE DES FORMATS (commun prof / élève) :
   figures, tuiles à associer, remise en ordre, curseur d’estimation.
   Tout le texte passe par rt() (échappé, formules KaTeX).
═══════════════════════════════════════════════════════════════ */
var PAIR_C=["#5B55C4","#D9822F","#2E9E7E","#3F7BC4","#C24E74"];
function figBlock(fig){var h=figHtml(fig);return h?'<div class="fig">'+h+"</div>":"";}
function fmtSl(sl,v){return f(v,sl.d)+(sl.u?" "+sl.u:"");}
/* graduation « ronde » d’un curseur : 5 repères */
function slTicks(sl){var o=[];for(var i=0;i<=4;i++)o.push(rd(sl.min+(sl.max-sl.min)*i/4,6));return o;}
/* curseur statique : o = {zone:{a,t}, ans:valeur, dots:[{v,c}], me:valeur, big} */
function scaleHtml(sl,o){
  o=o||{};
  var W=sl.max-sl.min||1,pc=function(v){return Math.max(0,Math.min(100,(v-sl.min)/W*100));},h='<div class="scale'+(o.big?" big":"")+(o.ans!==undefined?" wa":"")+'">';
  if(o.dots&&o.dots.length){
    var bins={},rows=0;
    h+='<div class="sc-dots">';
    o.dots.forEach(function(d){var b=Math.round(pc(d.v)/2.2),r=bins[b]||0;bins[b]=r+1;rows=Math.max(rows,r+1);h+='<i class="sc-dot '+(d.c||"")+'" style="left:'+rd(pc(d.v),2)+"%;bottom:"+(r*(o.big?0.95:0.62))+'rem" title="'+esc(fmtSl(sl,d.v))+'"></i>';});
    h+="</div>";
    h=h.replace('<div class="sc-dots">','<div class="sc-dots" style="height:'+(Math.min(rows,8)*(o.big?0.95:0.62)+0.4)+'rem">');
  }
  h+='<div class="sc-track">';
  if(o.zone){var a=o.zone.a,t=o.zone.t;
    h+='<i class="sc-near" style="left:'+rd(pc(a-2.5*t),2)+"%;width:"+rd(pc(a+2.5*t)-pc(a-2.5*t),2)+'%"></i><i class="sc-zone" style="left:'+rd(pc(a-t),2)+"%;width:"+rd(pc(a+t)-pc(a-t),2)+'%"></i>';}
  if(o.me!==undefined&&o.me!==null&&isFinite(o.me))h+='<span class="sc-me" style="left:'+rd(pc(o.me),2)+'%"><em>'+esc(o.meLab||"toi")+" : "+esc(fmtSl(sl,o.me))+"</em></span>";
  if(o.ans!==undefined)h+='<span class="sc-ans" style="left:'+rd(pc(o.ans),2)+'%"><em>≈ '+esc(fmtSl(sl,o.ans))+"</em></span>";
  h+="</div>";
  h+='<div class="sc-ticks">'+slTicks(sl).map(function(v,i){return '<span style="left:'+(i*25)+'%">'+esc(f(v,sl.d))+"</span>";}).join("")+"</div>";
  if(sl.u)h+='<div class="sc-u">'+esc(sl.u)+"</div>";
  return h+"</div>";
}
/* tuiles (tableau du prof, aperçu) ; cor[i] = index de la tuile de droite associée à L[i] ; pct = % de réussite par paire */
function assocHtml(q,cor,pct){
  if(!cor)return '<div class="tl2"><div class="tcol">'+q.L.map(function(t){return '<div class="tile">'+rt(t)+"</div>";}).join("")+'</div><div class="tcol">'+q.R.map(function(t){return '<div class="tile r">'+rt(t)+"</div>";}).join("")+"</div></div>";
  return '<div class="pairs">'+q.L.map(function(t,i){return '<div class="pair" style="--pc:'+PAIR_C[i%5]+'"><span class="tile">'+rt(t)+'</span><span class="pa">⟷</span><span class="tile r">'+rt(q.R[cor[i]])+"</span>"+(pct?'<b class="ppct">'+pct[i]+" %</b>":"")+"</div>";}).join("")+"</div>";
}
/* remise en ordre ; cor = indices d’affichage dans le bon ordre */
function ordreHtml(q,cor,sep){
  var list=cor?cor.map(function(j){return q.D[j];}):q.D;
  var s=cor&&sep?'<span class="osep">'+esc(String(sep).trim())+"</span>":"";
  return '<div class="orow'+(cor?" done":"")+'">'+list.map(function(t,k){return (k&&s?s:"")+'<span class="tile'+(cor?" ok":"")+'">'+(cor?'<b class="on">'+(k+1)+"</b>":"")+rt(t)+"</span>";}).join("")+"</div>";
}
/* correction attendue au format de la question (pour l’aperçu et le bilan) */
function corrOf(q){return qCorr(q);}
