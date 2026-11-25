'use strict';
const CACHE_PREFIX='leynilitir-colorbynumbers-';
const CACHE_NAME=CACHE_PREFIX+'v4';
const ASSETS=['./','./index.html','./styles.css','./puzzles.js','./app.js','./app-shell.js','./manifest.webmanifest','./icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png'];
const URLS=new Set(ASSETS.map(path=>new URL(path,self.registration.scope).href));
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS.map(path=>new Request(new URL(path,self.registration.scope),{cache:'reload'})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const key=new URL(event.request.url);key.search='';key.hash='';
  if(!URLS.has(key.href))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    try{
      const response=await fetch(event.request);
      if(response.ok){await cache.put(key.href,response.clone());return response;}
      return await cache.match(key.href)||response;
    }catch(error){
      const cached=await cache.match(key.href);
      if(cached)return cached;
      throw error;
    }
  })());
});
