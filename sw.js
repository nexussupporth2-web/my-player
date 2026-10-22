const C='omp-v20',HLS='https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js',A=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A).then(()=>c.add(HLS).catch(()=>{}))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!='GET')return;
 if(r.url==HLS){e.respondWith(caches.match(HLS).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const k=res.clone();caches.open(C).then(x=>x.put(HLS,k))}return res})));return}
 if(new URL(r.url).origin!=location.origin)return;
 if(r.mode=='navigate'){
  // app shell: answer from cache instantly (works offline), refresh it in the background
  e.respondWith((async()=>{const c=await caches.open(C);const hit=await c.match('index.html');
   const net=fetch(r).then(res=>{if(res.ok)c.put('index.html',res.clone());return res}).catch(()=>null);
   return hit||await net||new Response('Offline',{status:503,headers:{'Content-Type':'text/plain'}})})());
  return}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r)));
});
