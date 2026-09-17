const CACHE = 'moncarnet-v1';
const FICHIERS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './favicon.png'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FICHIERS)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(noms=>Promise.all(noms.filter(n=>n!==CACHE).map(n=>caches.delete(n)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  if(e.request.url.includes('supabase.co')) return;
  e.respondWith(
    fetch(e.request).then(r=>{
      const copie=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copie));
      return r;
    }).catch(()=>caches.match(e.request))
  );
});
