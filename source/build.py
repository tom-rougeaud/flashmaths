# Assemble les pages finales (concaténation simple, pas de f-string : accolades CSS/JS intactes)
import io,os,sys,json,base64,re
here=os.path.dirname(os.path.abspath(__file__))
# bibliothèques intégrées (npm install dans ce dossier, voir package.json) ; FM_NODE_MODULES pour un autre emplacement
NM=os.environ.get('FM_NODE_MODULES') or (os.path.join(here,'node_modules')+'/' if os.path.isdir(os.path.join(here,'node_modules')) else '/tmp/claude-0/fonts/node_modules/')
if not NM.endswith('/'): NM+='/'
def rd(p): return io.open(os.path.join(here,p),encoding='utf-8').read()
def b64(p): return base64.b64encode(open(p,'rb').read()).decode('ascii')
def safe_js(s): return s.replace('</script','<\\/script').replace('<!--','<\\!--')
# polices Nunito intégrées
faces=[(w,NM+'@fontsource/nunito/files/nunito-latin-%d-normal.woff2'%w) for w in (600,700,800,900)]
fonts=''.join('@font-face{font-family:"Nunito";font-weight:%d;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,%s) format("woff2")}\n'%(w,b64(p)) for w,p in faces)
theme=rd('src/theme.css').replace('/*@@FONTS@@*/',fonts)
# KaTeX : CSS avec un sous-ensemble de polices intégrées
KD=NM+'katex/dist/'
keep={'KaTeX_AMS-Regular','KaTeX_Caligraphic-Regular','KaTeX_Main-Regular','KaTeX_Main-Bold','KaTeX_Main-Italic','KaTeX_Math-Italic','KaTeX_Size1-Regular','KaTeX_Size2-Regular','KaTeX_Size3-Regular','KaTeX_Size4-Regular'}
kcss=io.open(KD+'katex.min.css',encoding='utf-8').read()
def face(m):
    block=m.group(0)
    f=re.search(r'url\(fonts/(KaTeX_[A-Za-z0-9-]+)\.woff2\)',block).group(1)
    if f not in keep: return ''
    src='src:url(data:font/woff2;base64,%s) format("woff2")'%b64(KD+'fonts/'+f+'.woff2')
    return re.sub(r'src:[^}]*',src,block).replace('font-display:block','font-display:swap')
kcss=re.sub(r'@font-face\{[^}]*\}',face,kcss)
kjs=safe_js(io.open(KD+'katex.min.js',encoding='utf-8').read())
supa=safe_js(io.open(NM+'@supabase/supabase-js/dist/umd/supabase.js',encoding='utf-8').read())
qrjs=safe_js(io.open(NM+'qrcode-generator/dist/qrcode.js',encoding='utf-8').read())
# favicon (SVG + PNG pour Safari)
fav=('<link rel="icon" type="image/png" sizes="64x64" href="data:image/png;base64,%s">\n'%b64(os.path.join(here,'assets/fav64.png'))+
     '<link rel="icon" type="image/png" sizes="32x32" href="data:image/png;base64,%s">\n'%b64(os.path.join(here,'assets/fav32.png'))+
     '<link rel="apple-touch-icon" href="data:image/png;base64,%s">'%b64(os.path.join(here,'assets/apple180.png')))
LOGO='data:image/png;base64,'+b64(os.path.join(here,'assets/logo256.png'))
common=safe_js(rd('src/common.js').replace('/*@@LOGOURI@@*/',LOGO))
fx=safe_js(rd('src/fx.js'))
bank='\n'.join(rd('src/'+n) for n in ['bank_core.js','bank_items_a.js','bank_items_b.js','bank_items_c.js','bank_items_d.js','bank_items_e.js','bank_items_f.js','bank_curriculum.js','bank_engine.js'])
bank=safe_js(bank.replace('"use strict";','').split('if(typeof module!=="undefined")module.exports')[0]+'\n'+rd('src/qview.js'))
cours=json.dumps(json.loads(rd('src/cours.json')),ensure_ascii=False).replace('</','<\\/')
custom=safe_js(rd('src/custom.js')); progress=safe_js(rd('src/progress.js'))
out=os.path.join(here,'dist'); os.makedirs(out,exist_ok=True)
for fn in os.listdir(out): os.remove(os.path.join(out,fn))
def w(name,txt):
    assert '/*@@' not in txt and '<!--@@' not in txt, name+' : marqueur non remplacé'
    io.open(os.path.join(out,name),'w',encoding='utf-8').write(txt)
def base(h): return h.replace('<!--@@FAVICON@@-->',fav).replace('/*@@THEMECSS@@*/',theme)
for pg in ['index.html','contact.html','confidentialite.html']:
    w(pg,base(rd('src/'+pg)).replace('/*@@COMMONJS@@*/',common))
def game(h):
    return (base(h).replace('/*@@KATEXCSS@@*/',kcss).replace('/*@@FXCSS@@*/',rd('src/fx.css'))
            .replace('/*@@COURS@@*/',cours).replace('/*@@KATEXJS@@*/',kjs).replace('/*@@SUPABASE@@*/',supa)
            .replace('/*@@COMMONJS@@*/',common).replace('/*@@FXJS@@*/',fx).replace('/*@@BANK@@*/',bank))
prof=game(rd('src/prof.html')).replace('/*@@PROFCSS@@*/',rd('src/prof.css')).replace('/*@@QRJS@@*/',qrjs).replace('/*@@CUSTOM@@*/',custom)
profjs='\n'.join(safe_js(rd('src/'+n)) for n in ['prof_pick.js','prof_preview.js','prof_room.js','prof_game.js','prof_end.js','prof_players.js','prof_init.js'])
w('prof.html',prof.replace('/*@@PROFJS@@*/',profjs))
el=game(rd('src/eleve.html')).replace('/*@@ELEVECSS@@*/',rd('src/eleve.css')).replace('/*@@PROGRESS@@*/',progress).replace('/*@@ELEVEJS@@*/',safe_js(rd('src/eleve.js')))
w('eleve.html',el)
cfg=rd('src/config.js')
if len(sys.argv)>2:
    cfg='var FLASH_CONFIG={SUPABASE_URL:%s,SUPABASE_ANON_KEY:%s};\n'%(json.dumps(sys.argv[1]),json.dumps(sys.argv[2]))
w('config.js',cfg)
w('flash_maths.sql',rd('src/flash_maths.sql'))
for fn in sorted(os.listdir(out)): print('%-22s %8d'%(fn,os.path.getsize(os.path.join(out,fn))))
