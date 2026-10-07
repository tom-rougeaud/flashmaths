/* ═══════════════════════════════════════════════════════════════
   COURBES SVG faites main : lissées (Catmull-Rom → Bézier), animées
═══════════════════════════════════════════════════════════════ */
var _cid=0;
function smoothPath(pts,yMin,yMax){
  if(pts.length<2)return "";
  var d="M"+pts[0][0].toFixed(1)+","+pts[0][1].toFixed(1);
  for(var i=0;i<pts.length-1;i++){
    var p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
    var c1x=p1[0]+(p2[0]-p0[0])/6,c1y=clamp(p1[1]+(p2[1]-p0[1])/6,yMin,yMax);
    var c2x=p2[0]-(p3[0]-p1[0])/6,c2y=clamp(p2[1]-(p3[1]-p1[1])/6,yMin,yMax);
    d+=" C"+c1x.toFixed(1)+","+c1y.toFixed(1)+" "+c2x.toFixed(1)+","+c2y.toFixed(1)+" "+p2[0].toFixed(1)+","+p2[1].toFixed(1);
  }
  return d;
}
function niceMax(v){
  if(v<=0)return 1;
  var e=Math.pow(10,Math.floor(Math.log(v)/Math.LN10)),m=v/e;
  var n=m<=1?1:m<=2?2:m<=2.5?2.5:m<=5?5:10;
  return n*e;
}
/* opts : {w,h,series:[{name,color,vals,dash,label}],xl:[labels],yMax,yMin,yFmt,area,ySuffix,ticks,dots} */
function lineChart(o){
  var id="c"+(++_cid),W=o.w||640,H=o.h||300,L=o.padL||(o.ySuffix?74:58),R=o.padR||22,T=o.padT||18,B=o.padB||40;
  var n=0;o.series.forEach(function(s){n=Math.max(n,s.vals.length);});
  if(n<1)return "";
  var yMin=o.yMin!==undefined?o.yMin:0,mx=0;
  o.series.forEach(function(s){s.vals.forEach(function(v){if(v>mx)mx=v;});});
  var yMax=o.yMax!==undefined?o.yMax:niceMax(mx*1.05);
  if(yMax<=yMin)yMax=yMin+1;
  var iw=W-L-R,ih=H-T-B;
  var X=function(i){return L+(n===1?iw/2:iw*i/(n-1));};
  var Y=function(v){return T+ih*(1-(v-yMin)/(yMax-yMin));};
  var fmt=o.yFmt||function(v){return fmtInt(v);};
  var s='<svg viewBox="0 0 '+W+" "+H+'" width="100%" style="display:block;max-width:100%" role="img" aria-label="'+esc(o.title||"courbe")+'"><defs>';
  o.series.forEach(function(se,k){s+='<linearGradient id="'+id+"g"+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+se.color+'" stop-opacity=".38"/><stop offset="1" stop-color="'+se.color+'" stop-opacity=".02"/></linearGradient>';});
  s+="</defs>";
  var ticks=o.ticks||4;
  for(var t=0;t<=ticks;t++){
    var v=yMin+(yMax-yMin)*t/ticks,y=Y(v);
    s+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'" stroke="#25304A" stroke-opacity="'+(t===0?.55:.14)+'" stroke-width="'+(t===0?3:2)+'" '+(t===0?"":'stroke-dasharray="3 7" stroke-linecap="round"')+"/>";
    s+='<text x="'+(L-10)+'" y="'+(y+5)+'" text-anchor="end" font-family="Inter,sans-serif" font-size="15" font-weight="600" fill="#4A5878">'+fmt(v)+(o.ySuffix||"")+"</text>";
  }
  var every=Math.max(1,Math.ceil(n/(o.maxX||12)));
  for(var i=0;i<n;i++){
    if(i%every&&i!==n-1)continue;
    var lab=(o.xl&&o.xl[i]!==undefined)?o.xl[i]:String(i+1);
    s+='<text x="'+X(i)+'" y="'+(H-12)+'" text-anchor="middle" font-family="Inter,sans-serif" font-size="14" font-weight="600" fill="#25304A">'+esc(lab)+"</text>";
  }
  var yTop=T,yBot=T+ih;
  o.series.forEach(function(se,k){
    var pts=se.vals.map(function(v,i){return [X(i),Y(v)];});
    if(pts.length>=2){
      var path=smoothPath(pts,yTop,yBot);
      if(o.area!==false)s+='<path d="'+path+" L"+pts[pts.length-1][0].toFixed(1)+","+yBot+" L"+pts[0][0].toFixed(1)+","+yBot+' Z" fill="url(#'+id+"g"+k+')" style="animation:fade 1.4s both"/>';
      s+='<path d="'+path+'" fill="none" stroke="'+se.color+'" stroke-width="'+(se.w||4)+'" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="'+(se.dash?"0.02 0.02":"1")+'" '+(se.dash?"":'stroke-dashoffset="1" style="animation:draw 1.5s ease-out '+(k*.2)+'s forwards"')+"/>";
    }
    if(o.dots!==false)pts.forEach(function(p,i){
      s+='<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="'+(se.r||6)+'" fill="#fff" stroke="'+se.color+'" stroke-width="3" style="animation:pop .4s '+(0.9+i*0.04)+'s both"><title>'+esc(se.name+" · "+(o.xl&&o.xl[i]!==undefined?o.xl[i]:i+1)+" : "+fmt(se.vals[i])+(o.ySuffix||""))+"</title></circle>";
    });
  });
  if(o.refLine!==undefined){
    var yy=Y(o.refLine.v);
    s+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+yy+'" y2="'+yy+'" stroke="'+(o.refLine.c||"#E03131")+'" stroke-width="3" stroke-dasharray="10 8"/><text x="'+(W-R)+'" y="'+(yy-7)+'" text-anchor="end" font-family="Inter,sans-serif" font-size="15" font-weight="600" fill="'+(o.refLine.c||"#E03131")+'">'+esc(o.refLine.l||"")+"</text>";
  }
  return s+"</svg>";
}
function legend(series){
  return '<div style="display:flex;flex-wrap:wrap;gap:8px 14px;margin-top:6px">'+series.map(function(s){return '<span class="chip" style="border-color:'+s.color+'"><i style="display:inline-block;width:14px;height:14px;border-radius:50%;background:'+s.color+'"></i>'+esc(s.name)+"</span>";}).join("")+"</div>";
}
function donut(pct,color,label,size){
  size=size||150;var r=size/2-14,c=2*Math.PI*r,id="d"+(++_cid);
  return '<svg viewBox="0 0 '+size+" "+size+'" width="'+size+'" height="'+size+'"><circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="#fff" stroke="#E6E9F0" stroke-width="18"/>'+
   '<circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="18" stroke-linecap="round" transform="rotate(-90 '+size/2+" "+size/2+')" stroke-dasharray="'+c+'" stroke-dashoffset="'+c+'" style="--c:'+c+';animation:donut 1.3s ease-out forwards;animation-name:'+id+'"/>'+
   '<style>@keyframes '+id+'{to{stroke-dashoffset:'+(c*(1-clamp(pct,0,100)/100))+'}}</style>'+
   '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Plex,Inter,sans-serif" font-weight="700" font-size="'+size*0.23+'" fill="#25304A">'+Math.round(pct)+" %</text>"+
   (label?'<text x="50%" y="'+(size*0.68)+'" text-anchor="middle" font-family="Inter,sans-serif" font-weight="600" font-size="'+size*0.13+'" fill="#4A5878">'+esc(label)+"</text>":"")+"</svg>";
}
