let deferredPrompt;
let addHomescreenBtn = document.querySelector("#addhomescreenbtn")

window.addEventListener('beforeinstallprompt',e =>{
  e.preventDefault();
  deferredPrompt = e;
  addhomescreenbtn.style.display = "block";
})

addHomescreenBtn.addEventListener('click',e =>{
  if(deferredPrompt){
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(choice => {
      if(choice.outcome === 'accepted')
        alert('App adicionado na homescreen!');
      else
        alert(' :( ');
      deferredPrompt = null;
      addhomescreenbtn.style.display = "none";
    })
  }
})

window.addEventListener('appinstalled', (evt) => {
  deferredPrompt = null;
  addhomescreenbtn.style.display = "none";
  console.log('Aplicativo instalado');
});
