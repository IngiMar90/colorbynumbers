(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  let installPrompt=null;
  const installedMode=matchMedia('(display-mode: standalone)');
  const fullscreenMode=matchMedia('(display-mode: fullscreen)');
  let installed=navigator.standalone===true||installedMode.matches||fullscreenMode.matches;
  function syncInstallButton(){ $('install-app').hidden=installed; }
  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();installPrompt=event;syncInstallButton();
  });
  window.addEventListener('appinstalled',()=>{
    installed=true;installPrompt=null;syncInstallButton();
    if($('install-dialog').open)$('install-dialog').close();
    $('announcer').textContent='Leynilitir hafa verið settir upp sem app.';
  });
  installedMode.addEventListener('change',event=>{if(event.matches)installed=true;syncInstallButton();});
  $('install-app').addEventListener('click',async()=>{
    if(installPrompt){
      const prompt=installPrompt;installPrompt=null;
      try{await prompt.prompt();await prompt.userChoice;}catch{showInstallHelp();}
    }else showInstallHelp();
  });
  function showInstallHelp(){
    const appleMobile=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    $('install-help').textContent=appleMobile
      ?'Í Safari: Opnaðu Deila (Share) og veldu Bæta á heimaskjá (Add to Home Screen). Opnaðu síðan Leyniliti með nýja appmerkinu.'
      :'Í Chrome eða Edge: Opnaðu valmynd vafrans (⋮ eða …) og veldu Setja upp Leyniliti / Install Leynilitir. Þú getur líka smellt á uppsetningartáknið við veffangið þegar það birtist. Á sumum skólatækjum þarf leyfi frá skólanum til að setja upp öpp.';
    $('install-dialog').showModal();$('close-install').focus();
  }
  $('close-install').addEventListener('click',()=>$('install-dialog').close());
  function syncFullscreen(){
    const active=Boolean(document.fullscreenElement);
    $('fullscreen').setAttribute('aria-pressed',String(active));
    $('fullscreen').setAttribute('aria-label',active?'Hætta á fullum skjá':'Opna á fullum skjá');
    $('fullscreen').querySelector('.control-label').textContent=active?'Minnka skjá':'Fullur skjár';
  }
  $('fullscreen').hidden=!document.fullscreenEnabled||!document.documentElement.requestFullscreen;
  $('fullscreen').addEventListener('click',async()=>{
    try{
      if(document.fullscreenElement)await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    }catch{$('announcer').textContent='Ekki tókst að opna á fullum skjá. Leikurinn passar áfram í gluggann.';}
  });
  document.addEventListener('fullscreenchange',syncFullscreen);
  syncFullscreen();syncInstallButton();
  if('serviceWorker' in navigator&&['https:','http:'].includes(location.protocol)){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'})
        .then(registration=>registration.update())
        .catch(()=>{/* Playing online does not require offline storage permission. */});
    });
  }
})();
