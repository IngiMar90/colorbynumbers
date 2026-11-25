const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..'),base='/colorbynumbers/';
 const server=http.createServer((req,res)=>{if(!req.url.startsWith(base)){res.writeHead(404);res.end();return;}const name=decodeURIComponent(req.url.split('?')[0].slice(base.length))||'index.html';const file=path.join(root,name);try{res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':name.endsWith('.svg')?'image/svg+xml':name.endsWith('.png')?'image/png':name.endsWith('.webmanifest')?'application/manifest+json':'text/html');res.setHeader('Cache-Control','no-cache');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.LEYNILITIR_CHROMIUM_PATH||undefined,headless:true,args:['--no-sandbox']});const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}${base}`);await page.evaluate(()=>navigator.serviceWorker.ready);
 await page.reload();assert(await page.evaluate(()=>Boolean(navigator.serviceWorker.controller)));
 const cdp=await context.newCDPSession(page);const manifest=await cdp.send('Page.getAppManifest');assert.equal(manifest.errors.length,0);const data=JSON.parse(manifest.data);assert.equal(data.display,'fullscreen');assert.equal(data.scope,'./');
 console.log('Manifest verified',data.icons.map(i=>i.sizes).join(', '));
 const installability=await cdp.send('Page.getInstallabilityErrors');assert.deepEqual(installability.installabilityErrors,[]);console.log('Chromium reports no installability errors.');
 const settle=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 async function checkBounds(selector,label){const bad=await page.locator(selector).evaluateAll(es=>es.filter(e=>{const r=e.getBoundingClientRect();return r.width<=0||r.height<=0||r.top<-.5||r.left<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5;}).map(e=>({tag:e.id||e.className,box:JSON.stringify(e.getBoundingClientRect().toJSON()),view:[innerWidth,innerHeight]})));assert.deepEqual(bad,[],label);}
 for(const [width,height] of [[1366,768],[1280,720],[1024,600],[800,600],[1920,1080],[390,844],[360,640],[320,568],[844,390],[667,375]]){
  await page.setViewportSize({width,height});await settle();if(await page.locator('#back').isVisible())await page.locator('#back').click();await settle();
  await checkBounds('.level-card,.puzzle-card,#install-app,#fullscreen',`home controls fit ${width}x${height}`);
  for(const level of [0,3]){
   await page.locator('.level-card').nth(level).click();await page.locator('.puzzle-card').first().click();await settle();
   assert.equal(await page.locator('.cell').count(),[144,256,400,900][level]);assert.equal(await page.locator('.color-button').count(),[6,8,10,12][level]);
   await checkBounds('#board,.cell,.color-button,.color-key-row,#fullscreen,#back,#hint,#restart',`game controls fit ${width}x${height} level ${level+1}`);
   const overflow=await page.locator('#board-scroll').evaluate(e=>({x:e.scrollWidth-e.clientWidth,y:e.scrollHeight-e.clientHeight}));assert(overflow.x<=1&&overflow.y<=1,`unzoomed board must fit: ${JSON.stringify({width,height,overflow})}`);
   assert.equal(await page.locator('#brush-preview').getAttribute('data-color'),'#ffffff');
   const n=Number(await page.locator('.cell').first().textContent());await page.locator('.color-button').nth(n-1).click();await page.locator('.cell').first().click();assert(await page.locator('.cell.filled').count()>0);
   await page.locator('#back').click();
  }
  console.log(`Fits ${width}×${height}`);
 }
 await page.setViewportSize({width:1366,height:768});await page.locator('.puzzle-card').first().click();await settle();
 await page.locator('#fullscreen').click();await settle();assert(await page.evaluate(()=>Boolean(document.fullscreenElement)));await checkBounds('#board,.color-button,.color-key-row','fullscreen fits');await page.locator('#fullscreen').click();await page.waitForFunction(()=>!document.fullscreenElement);assert.equal(await page.evaluate(()=>Boolean(document.fullscreenElement)),false);
 const fitWidth=await page.locator('#board').evaluate(e=>e.getBoundingClientRect().width);await page.locator('#zoom-in').click();assert(await page.locator('#board').evaluate(e=>e.getBoundingClientRect().width)>fitWidth);await page.locator('#fit-board').click();assert.equal(await page.locator('#board').evaluate(e=>e.getBoundingClientRect().width),fitWidth);
 // Existing saved progress survives new app assets and offline reloads.
 const before=await page.locator('.cell.filled').count();await context.setOffline(true);await page.reload();await page.locator('.puzzle-card').first().click();await settle();assert.equal(await page.locator('.cell.filled').count(),before);
 const n=Number(await page.locator('.cell:not(.filled)').first().textContent());await page.locator('.color-button').nth(n-1).click();await page.locator('.cell:not(.filled)').first().click();assert.equal(await page.locator('.cell.filled').count(),before+1);console.log('Offline reload, play and persistence pass.');
 await context.setOffline(false);await page.locator('#install-app').click();assert(await page.locator('#install-dialog').isVisible());await page.locator('#close-install').click();
 // Test the deferred-install button path without installing anything on the user's device.
 await page.evaluate(()=>{const e=new Event('beforeinstallprompt',{cancelable:true});e.prompt=async()=>{window.installPromptTest=true;};e.userChoice=Promise.resolve({outcome:'dismissed'});window.dispatchEvent(e);});await page.locator('#install-app').click();assert(await page.evaluate(()=>window.installPromptTest));
 assert.deepEqual(errors,[]);console.log('PASS: responsive shell, actual fullscreen, zoom reset, manifest, installability, install UI, offline and saved progress.');await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1);});
