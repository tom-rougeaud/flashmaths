const fs=require('fs'),path=require('path');
const src=['bank_core.js','bank_items_a.js','bank_items_b.js','bank_items_c.js','bank_items_d.js','bank_items_e.js','bank_items_f.js','bank_curriculum.js','bank_engine.js'].map(f=>fs.readFileSync(path.join(__dirname,'../src',f),'utf8')).join('\n').replace(/"use strict";/g,'');
const tmp=path.join(__dirname,'../src/_d.js');fs.writeFileSync(tmp,src);const B=require(tmp);fs.unlinkSync(tmp);
const sets=[["cc_signes","cc_pythagore"],["pyth_hyp","aire_triangle","cc_pythagore"],["lit_dev","lit_reduire","eq1"],["cc_stats","moyenne","mediane"],["cc_pct","pct_de","pct_mental","coef_evol"]];
for(const sel of sets){let avoid={},rep=[];
  for(let g=0;g<3;g++){const qs=B.drawQuestions(sel,10,{},Date.now()+g*1000+Math.floor(Math.random()*1e6),avoid);let d=qs.filter(q=>avoid[q.q]).length;rep.push(qs.length+'q/'+d+' répét.');qs.forEach(q=>avoid[q.q]=1);}
  console.log(sel.join('+'),'→',rep.join(' | '));}
