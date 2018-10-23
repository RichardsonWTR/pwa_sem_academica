self.addEventListener('fetch',function(event){
  console.log('[SW] Fetch',event.request);

  event.respondWith(fetch(event.request));

})
