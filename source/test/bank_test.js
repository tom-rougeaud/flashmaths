/* Test de la banque : KaTeX valide, pas de doublon, auto-correction cohérente pour tous les formats */
const fs=require('fs'),path=require('path');
const src=['bank_core.js','bank_items_a.js','bank_items_b.js','bank_items_c.js','bank_items_d.js','bank_items_e.js','bank_items_f.js','bank_curriculum.js','bank_engine.js'].map(f=>fs.readFileSync(path.join(__dirname,'../src',f),'utf8')).join('\n').replace(/"use strict";/g,'');
const tmp=path.join(__dirname,'../src/_bank_all.js');fs.writeFileSync(tmp,src);
const B=require(tmp);
let katex;try{katex=require(path.join(__dirname,'../node_modules/katex'));}catch(e){katex=require('/tmp/claude-0/fonts/node_modules/katex');}
function tex(s){const parts=String(s).split('$');if(parts.length%2===0)throw new Error('$ impair: '+s);for(let i=1;i<parts.length;i+=2){katex.renderToString(parts[i],{throwOnError:true,strict:'error'});}}
function vis(s){return String(s).replace(/\$[^$]*\$/g,'XXXX');}
const N=+process.argv[2]||300;
let n=0,errs=[],kinds={},free=0,fb=0,per={},figs=0,qx=0;
const MET=['general','cuisine','batiment','commerce','coiffure','auto','logistique','sante'];
for(const it of B.BANK){per[it.id]={n:0,txt:new Set(),k:{}};
  for(let s=0;s<N;s++){
    const q=B.makeQuestion(it.id,s*7919+13,{metiers:MET});
    if(!q){errs.push(it.id+' null seed '+s);continue;}
    n++;per[it.id].n++;per[it.id].txt.add(q.q+'|'+JSON.stringify((q.choices||[]).map(c=>c.t).sort())+JSON.stringify((q.L||q.D||[]).slice().sort())+(q.sl?q.sl.ans:'')+JSON.stringify(q.fig||''));
    const k=B.qKind(q);kinds[k]=(kinds[k]||0)+1;per[it.id].k[k]=1;
    if(q.nfb)fb++;if(q.fig)figs++;if(q.qx)qx++;
    try{tex(q.q);tex(q.expl);(q.choices||[]).forEach(c=>tex(c.t));(q.L||[]).forEach(tex);(q.R||[]).forEach(tex);(q.D||[]).forEach(tex);tex(B.answerText(q));}catch(e){errs.push(it.id+' TEX '+e.message.slice(0,140));break;}
    if(q.fig){const h=B.figHtml(q.fig);if(!h||/NaN|undefined/.test(h))errs.push(it.id+' figure vide/NaN '+JSON.stringify(q.fig).slice(0,80));}
    if(/NaN|undefined|Infinity/.test(q.q+JSON.stringify(q.choices)+q.expl+JSON.stringify(q.L||'')+JSON.stringify(q.R||'')+JSON.stringify(q.D||'')+JSON.stringify(q.sl||'')))errs.push(it.id+' NaN '+q.q.slice(0,80));
    const pub=B.qPublic(q),ps=JSON.stringify(pub);
    if(k==='qcm'||k==='vf'){
      const ts=q.choices.map(c=>c.t);if(new Set(ts).size!==ts.length)errs.push(it.id+' doublon '+ts.join('|'));
      if(q.ans<0||q.ans>=q.choices.length)errs.push(it.id+' ans');
      if(q.choices.some(c=>vis(c.t).length>52))errs.push(it.id+' long: '+ts.join(' | '));
      const j=B.judge(q,{k:q.ans});if(!j.ok)errs.push(it.id+' judge qcm');
      q.choices.forEach((c,i)=>{if(i!==q.ans&&B.judge(q,{k:i}).ok)errs.push(it.id+' judge faux accepté');});
      if(B.isFree(q)){free++;
        const shown=q.ft||q.choices[q.ans].t;
        const r=B.checkTyped(q,q.lit?shown.replace(/\$/g,''):shown);
        if(!r.valid||!r.ok){const r2=B.checkTyped(q,String(q.num).replace('.',','));if(!(r2.valid&&r2.ok))errs.push(it.id+' autocheck KO: '+shown+' num='+q.num+' unit='+q.unit+' lit='+q.lit);}
        q.choices.forEach((c,i)=>{if(i===q.ans)return;const rr=B.checkTyped(q,c.t.replace(/\$/g,''));if(rr.ok)errs.push(it.id+' distracteur accepté '+c.t+' vs '+shown);});
      }
    }else if(k==='assoc'||k==='ordre'){
      const cor=B.qCorr(q);const j=B.judge(q,{v:cor});if(!j.ok)errs.push(it.id+' judge '+k);
      const bad=cor.slice();const t0=bad[0];bad[0]=bad[1];bad[1]=t0;if(B.judge(q,{v:bad}).ok)errs.push(it.id+' '+k+' faux accepté');
      if(ps.indexOf('"rk"')>=0||ps.indexOf('"op"')>=0)errs.push(it.id+' fuite de la réponse');
      (q.L||q.D).concat(q.R||[]).forEach(t=>{if(vis(t).length>44)errs.push(it.id+' tuile longue: '+t);});
    }else if(k==='slider'){
      const s=q.sl,W=s.max-s.min;
      if(!(s.ans>=s.min&&s.ans<=s.max))errs.push(it.id+' curseur hors bornes');
      if(s.tol>W/6)errs.push(it.id+' tolérance trop large '+s.tol+' / '+W);
      if(s.step>s.tol)errs.push(it.id+' pas > tolérance');
      if(!B.judge(q,{v:s.ans}).ok)errs.push(it.id+' judge slider');
      if(B.judge(q,{v:s.ans+3*s.tol}).ok&&s.ans+3*s.tol<=s.max)errs.push(it.id+' slider trop tolérant');
      if(ps.indexOf('"ans"')>=0||ps.indexOf('"tol"')>=0)errs.push(it.id+' fuite curseur');
    }
  }
}
const uniq=[...new Set(errs)];
let poor=Object.keys(per).filter(id=>per[id].txt.size<Math.min(40,N/4)).map(id=>id+'('+per[id].txt.size+')');
console.log('items',B.BANK.length,'questions',n,'formats',JSON.stringify(kinds),'saisie libre',free,'figures',figs,'étape fausse',qx,'repli distracteurs',fb);
console.log('items à faible variété (<40 énoncés distincts / '+N+') :',poor.length,poor.join(' '));
console.log('erreurs',uniq.length);console.log(uniq.slice(0,50).join('\n'));
fs.unlinkSync(tmp);
module.exports={per};
