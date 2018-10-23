let CACHE_ESTATICO = 'estatico_v1';
let CACHE_DINAMICO = 'dinamico_v1';

// Executado sempre que registrar um SW.
// Se o SW não foi modificado, nada ocorrerá.
self.addEventListener('install',function(event){
  console.log('[SW] Instalando SW',event)

  event.waitUntil( // Faz com que o método 'install' aguarde até o fim da execução desta promise, armazenando todos os recursos necessários
    caches.open(CACHE_ESTATICO) // Abre ou cria um cache com o nome fornecido
      .then(function(cache){

        // método add = adicionar itens ao cache um de cada vez
        // cache.add('/index.html');
        // metodo addAll: adiciona várias requisicoes

        console.log('Fazendo o cache do app shell');

            cache.addAll([
            './', //Não esquecer de adicionar a raiz no cache
            './index.html',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            './src/css/app.css',
            './src/css/feed.css',
            './src/css/material.indigo-red.min.css',
            './src/img/pwa.png',
            './src/js/app.js',
            './src/js/material.min.js',
            './ajuda/',
            './ajuda/index.html'
          ])
      })
      .catch(function(err){
        console.log('Erro ao acessar cache',err)
      })
  )
})

// Disparado quando ocorre a troca entre um SW antigo e um novo
// É um bom momento para eliminar caches antigos
self.addEventListener('activate',function(event){
  console.log('[SW] Ativando SW ',event);

  // Removendo caches antigos
  event.waitUntil(
    caches.keys() // Retorna a lista com os nomes dos caches
      .then(keys =>{
        return Promise.all( // Retorna uma Promise que é finalizada apenas quando as internas forem resolvidas
          keys.map(cache =>{ // Transforma a lista de nomes de caches em Promises (caches.delete)
            if(cache !== CACHE_ESTATICO && cache !== CACHE_DINAMICO){ // Se o nome do cache não é o atual, remover
              console.log('Removendo cache antigo: ',cache)
              return caches.delete(cache)
            }
          })
        )
      })
  )
})

// Captura as requisições feitas e trata cada uma delas
self.addEventListener('fetch',function(event){
  console.log('[SW] Fetch',event);

  // Se na url possui o endereço da nossa API de informações dinâmicas, não guardar no cache
  // No index.html possui um link para o service worker. Ele precisa estar explícito nesta lista
  // de exclusão, pois ao ser clicado ele não pode ser adicionado em cache.
  if(event.request.url.indexOf('baconipsum') > -1 ||
  event.request.url.indexOf('sw.js') > -1 ||
  event.request.url.indexOf('manifest.json') > -1
  ){
    event.respondWith(fetch(event.request))
  }
  else{
    // Primeiro verifica se o item está no cache.
    // Em caso positivo apenas retorna.
    // Caso o item não exista no cache o item é obtido e em seguida salvo em cache
    event.respondWith(
      caches.match(event.request)
        .then(function(res){
          if(res){ // Se a variável for verdadeira, o item já estava no cache. Apenas retornar
            return res
          }
          else{
            // Faz a requisição e em seguida armazena o item em cache
            return fetch(event.request)
              .then(function(res){

                return caches.open(CACHE_DINAMICO) // Abre ou cria um cache com o nome fornecido
                  .then(function(cache){
                    // Atenção ao valor obtido pela requisição, que só pode ser utilizada uma vez
                    // Caso necessário sempre clonar a variável
                    // Método cache.put: Utilizado quando já se tem a url e a resposta
                    cache.put(event.request.url,res.clone())
                    return res
                  })
              })
          }
        })
    );
  }
})
