let deferredPrompt; // Evento de adicionar o app na home screen
let addHomescreenBtn = document.querySelector("#addhomescreenbtn") // Botão para adicionar o app na home screen
let conteudo_dinamico = document.querySelector("#conteudo_dinamico") // Elemento para a inclusão do conteúdo dinâmico

// Guarda o evento do banner de instalação na home screen para usar mais tarde
// O evento é armazenado na variável deferredPrompt
// Em seguida exibe o botão 'Add na home screen' na tela para o usuário
window.addEventListener('beforeinstallprompt',e =>{
  e.preventDefault();
  deferredPrompt = e;
  addhomescreenbtn.style.display = "block";
})

// Trata o evento do botão 'Add na home screen' e em seguida oculta o botão.
addHomescreenBtn.addEventListener('click',e =>{
  if(deferredPrompt){
    deferredPrompt.prompt(); // Exibe o prompt

    deferredPrompt.userChoice.then(choice => { // Trata a resposta do usuário
      if(choice.outcome === 'accepted')
        alert('App adicionado na homescreen!');
      else
        alert(' :( ');
      deferredPrompt = null;
      addhomescreenbtn.style.display = "none";
    })
  }
})

// Evento disparado quando o app é instalado com sucesso na home screen
window.addEventListener('appinstalled', (evt) => {
  deferredPrompt = null;
  addhomescreenbtn.style.display = "none";
  console.log('Obrigado por instalar nosso app!');
});

// Faz a requisição do conteúdo dinâmico da página com a API  de testes baconipsum
fetch('https://baconipsum.com/api/?type=meat-and-filler')
  .then(res => res.json()) // Obtêm o conteúdo da requisição
  .then(conteudo_processado => conteudo_dinamico.innerText = conteudo_processado)
