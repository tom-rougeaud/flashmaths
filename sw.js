/* Service worker Flash Maths : met en cache les pages et les icônes (l’entraînement solo et les révisions marchent hors connexion).
   Réseau d’abord (toujours la dernière version), cache en secours. Supabase (autre origine) n’est jamais mis en cache. */
var V="fm-4.1";
var FILES=["./","index.html","prof.html","eleve.html","revisions.html","contact.html","confidentialite.html","config.js","manifest.json","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(FILES.map(function(f){return c.add(f).catch(function(){});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});}return res;}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match("index.html");});}));
});
