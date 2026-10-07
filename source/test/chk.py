import re,subprocess,sys,os
d=os.path.join(os.path.dirname(__file__),'../dist')
bad=0
for f in ['prof','eleve','index','contact','confidentialite']:
    s=open(os.path.join(d,f+'.html'),encoding='utf8').read()
    for i,b in enumerate(re.findall(r'<script(?![^>]*src)([^>]*)>(.*?)</script>',s,re.S)):
        if 'application/json' in b[0]:
            import json;json.loads(b[1]);continue
        p='/tmp/claude-0/chk_%s_%d.js'%(f,i);open(p,'w',encoding='utf8').write(b[1])
        r=subprocess.run(['node','--check',p],capture_output=True,text=True)
        if r.returncode: bad+=1;print(f,i,r.stderr[:600])
print('scripts OK' if not bad else 'ERREURS %d'%bad)
