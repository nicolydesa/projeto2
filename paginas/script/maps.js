const popUpCriarPoste = document.querySelector('#pop-up.adicionarPoste');
const popUpAdicionarAssociadas = document.querySelector('#pop-up.adicionarAssociadas');
const recarregarForcado = document.querySelector('main#maps button#recaregar');
const selecionarEmpresaOnLoad = document.getElementById('selecionarEmpresa');
const especificarServico = document.getElementById('especificarServico');



// Postes selecionados
let selecionados = [];


// Botão direito do mouse
let contextMenuWindow;

// Função inicial para o mapa do google maps
async function initMap() {
    // Inicializações básicas
    const { Map } =     await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    let logada = JSON.parse(localStorage.getItem('empresa'))

    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: parseFloat(logada.empresa.centro_lat), lng: parseFloat(logada.empresa.centro_lng)},
        zoom: logada.empresa.zoom,
        mapId: 'posteMapas'
    });

    function irMeio() {
        map.center = empresa_logada.centroMapa;
    }

    // Quando clicar no mapa ele vai tentar criar um poste.
    map.addListener("click", (e) => {
        // Se uma contextMenuWindow estiver aberta, feche-a
        if (contextMenuWindow) contextMenuWindow.close();
        // Se estar no mobile, então não pode criar postes clicando
        if (window.innerWidth <= 425) return;

        // confirmação para a criação do poste
        const confirmacao = confirm("Deseja adicionar um novo marcador aqui?");
        if (confirmacao) {        
            let lat = e.latLng.lat();
            let lng = e.latLng.lng();
            // Cria o poste, adicionando-o no empresa_logada.__postes, uma lista com todos os postes (ele adiciona dentro o proprio objeto)
            fetch('http://localhost:3001/postesCriar', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    latitude: lat, longitude: lng,
                    empresa_id: localStorage.id_empresa_logada,
                    status: '1',
                })
            })
            // new Poste(lat, lng, empresa_logada.nome);
            // Atualiza o mapa, "adicionando" o novo poste
            // atualizarMapa();
            carregarPostesDoBD()
        }
    });

   // Função de adicionar postes usando o objeto "ponto" 
    function addAdvancedMarker(ponto) {
        const infos = ponto.obj;
        // Criando o icone do poste
        glyphColor = statusColor[typeStatusmenos1[ponto.status]]
        glyphBorderColor = statusColor[typeStatusmenos1[ponto.status] + (statusColor.length/2) ] // 

        let lat = infos.lat;
        let lng = infos.lng;
        let title = infos.title;
        
        const image = document.createElement("img");
        image.src = "../assets/icones/lampada.svg";
        image.style.width = '28px';
        image.style.height = '28px';
        
        const pin = new PinElement({
            scale: 1.3,
            glyph: image,
            background: glyphColor,
            borderColor: glyphBorderColor
        });

        const marker = new AdvancedMarkerElement({
            map,
            position: {lat: lat, lng: lng},
            content: pin.element,

            title: title
        });

        marker._globalId = ponto._globalId;
        marker._localId = ponto._localId;
        marker._StringGlobalId = ponto._StringGlobalId;
        marker.bd_id = ponto.bd_id;

        const infoWindow = new google.maps.InfoWindow({
          content: infos.content,
        });

        ponto.objHtml = marker;

        // Neste poste, quando você clica pode, ou abrir as informações dele
        // Marcar o poste como selecionado
        // Marcar o poste para conectar ele a outro poste.
        marker.addListener("click", (event) => {
            if (contextMenuWindow) contextMenuWindow.close();
            // Se estiver com o CTRL segurado vai adicionar como selecionado
            if (event.domEvent.ctrlKey && action != 0) action = 2;

            // Switch case para mudas as ações dependendo da "ação" action
            switch (action){
            case 0:
                //Conectar poste
                conectarPostes(marker);
                break;
            case 1:
                // Abrir info postes
                // O normal
                infoWindow.open(map, marker);
                break;
            case 2:
                // Selecionar postes
                action = 1;
                let posteAchado = empresa_logada.__postes[acharIndicePoste(marker._StringGlobalId)];

                // Lógica da seleção de postes
                if (selecionados.includes(posteAchado)) {
                    selecionados.splice(selecionados.indexOf(posteAchado), 1);
                    marker.classList.remove('poste-selecionado');
                } else {
                    selecionados.push(posteAchado);
                    marker.classList.add('poste-selecionado')
                }
                break;
                
            }
            
        });

        // Abrir o botão direito do mapa, tem só o excluir por enquanto
        function showContextMenu(position, marker) {
            indicePoste = acharIndicePoste(marker._StringGlobalId);
            
            if (contextMenuWindow && contextMenuWindow.isOpen) {
                contextMenuWindow.close();
                const pos = JSON.parse(JSON.stringify(marker.position))

                if (contextMenuWindow.position.lat() == pos['lat'] && contextMenuWindow.position.lng() == pos['lng']) return;
            }

            const content = `
                <div id="contenxt-content">
                    <button class="bigger-button" onclick="empresa_logada.__postes[${marker._localId}].apoptose()">Deletar</button>
                </div>
            `;
            
            contextMenuWindow = new google.maps.InfoWindow({
                content: content,
                position: {lat: position.lat, lng: position.lng},
                headerDisabled: true,
                pixelOffset: {height: 35, width: 70},
                ariaLabel: 'context-window'
            });

            contextMenuWindow.open(map);
        }
        
        
        // Detectar o botão direito nos marcadores
        marker.addEventListener("contextmenu", () => {
            showContextMenu(marker.position, marker);
        });
        

        function atualizarVisibilidadeDosMarcadores() {
            const zoomAtual = map.getZoom();
            const mostrar = zoomAtual > 5;
            const marks = document.querySelectorAll('gmp-advanced-marker');


            marks.forEach(marker => {
                marker.style.display = mostrar ? '' : 'none';
            });
        }

        atualizarVisibilidadeDosMarcadores();

        // Atualizar visibilidade quando o zoom mudar
        map.addListener("zoom_changed", atualizarVisibilidadeDosMarcadores);

    }

    // Remover o HTML dos postes, usado para atualizá-los
    function removerMarkers() {
        const marks = document.querySelectorAll('gmp-advanced-marker');
        marks.forEach((e) => {
            e.remove();
        })
    }

    // Adicionar o HTML dos postes
    function carregarPostes() {
        // carregarPostesDoBD();
        empresa_logada.__postes.forEach(function(ponto) {
            if (!ponto) return;
            ponto.atualizarPontoMaps();
            addAdvancedMarker(ponto);
    });
    }

    async function carregarPostesDoBD() {
        removerMarkers();
        idPostes = 0;
        const postesRq = await fetch('http://localhost:3001/mapa/postes', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_empresa: localStorage.id_empresa_logada,
            })
        })
        
        const nomeEmpresasRq = await fetch('http://localhost:3001/nomeEmpresas', {
            method: "GET",
        })

        const associadasRq = await fetch('http://localhost:3001/empresasassociadas', {
            method: "GET",
        })
        
        

        const postes = await postesRq.json();
        const nomeId = await nomeEmpresasRq.json();
        const associadas = await associadasRq.json();

        empresas = [];
        empresa_logada.__postes = [];
        nomeId.forEach((empresaBase) => {
            new Empresa(empresaBase.nome, '', '', '', '', '', '', empresaBase.id)
        })
        

        postes.forEach(function(ponto) {
            empresa_dona = ponto.id_empresa_dona;
            let nome_empresa_dona = '';
            for (let i = 0; i < nomeId.length; i++) {
                if (nomeId[i].id == empresa_dona) {
                    nome_empresa_dona = nomeId[i].nome;
                    break;
                }
            }

            let associadasObj = {}
            for (let i = 0; i < associadas.length; i++) {
                if (ponto.id == associadas[i].id_poste) {
                    associadasObj[associadas[i].nome_empresa_associada] = '';
                    // break;
                }
            }
            
            new Poste(parseFloat(ponto.lat), parseFloat(ponto.lng), nome_empresa_dona, [], associadasObj, ponto.status, ponto.id, ponto.id_empresa_dona)    
        });
        atualizarMapa();
    }
    carregarPostesDoBD();

    

    function removerInfoWindow() {
        let infos = document.getElementsByClassName('gm-style-iw-a');
        let len = infos.length
        if (len == 0) return;
        for (let i = 0; i<len; i++) {
            infos[i].remove();
        }
    }

    function atualizarMapa() {
        selecionados = [];
        removerInfoWindow();
        removerMarkers();
        carregarPostes();
    }

    // Salva vidas :pray:
    recarregarForcado.addEventListener('click', carregarPostesDoBD);
    

    // Quando tudo carregar certo vai carregar todos os postes
    carregarPostes();

    // Ir pela empresa logada e habilitar todas as conexções dos postes dela por front-end
    empresa_logada.__postes.forEach((poste) => {
        for (i = 0; i<poste.conexcoes.length; i++) {
            desenharLinhaEntre(poste, poste.conexcoes[i]);
        }
    })
    toggleArrow(false);
}

window.initMap = initMap;

function handleMudarStatus(id, status) {
    empresa_logada.__postes[id].setStatus(status);
    recarregarForcado.click();
}

/* Resto */
let action = 1;
let posteSelecionado;

// Função para manusear as ações, dizendo se: quando vc clica ele tá selecionando ou abrindo ou qualquer outra coisa.
function toggleConnect(element) {
    // Por enquanto action é só -> 1 => conectar postes
                                // 0 => Criar postes
    if (action == 1) {
        action = 0;
        toggleArrow(true);
    } else {
        action = 1;
        toggleArrow(false);
    }

    element.classList.toggle('nao-selecionado')
    
}

/* Função de conectar postes, ele usa a variável "posteSelecionado", ele entra o parâmetro o poste que acabou de clicar
a lógica base é:
SE tem um poste selecionado:
    Conectar aquele poste ao poste que você acabou de clicar
    fim
Se não:
    o poste que você acabou de clicar é um posteSelecionado, então no proximo conectará

(Junto disto uns frufru)
*/
function conectarPostes(elementHTML) {    
    
    let element = empresa_logada.__postes[acharIndicePoste(elementHTML._StringGlobalId)];
    
    if (posteSelecionado == element) {
        
        posteSelecionado = null;
        elementHTML.style.background = '';
        console.log('des-selecionado - igual');
    }
    else if (posteSelecionado) {    
        posteSelecionado.conexcoes.push(element);

        desenharLinhaEntre(posteSelecionado, element);

        posteSelecionado.objHtml.style.background = '';
        posteSelecionado = null;
        console.log('des-selecionado - sucesso');
    } 
    else {
        posteSelecionado = element;

        elementHTML.style.background = 'var(--corBackground)';
        console.log('selecionado')
    }

}


let Linhas = [];

// Puramente Front-end para representar as conexções dos mapas
function desenharLinhaEntre(lat1, lng1, lat2, lng2, mostrar = true) {
    let obj1 = lat1;
    let obj2 = lng1;
    // ele de principio espera lat e lng de ambos postes, mas se enviar só os objetos
    // Ele irá pegar e definicar pra cada coisa.
    if (typeof(lat1) == 'object') {
        lat1 = obj1.lat;
        lng1 = obj1.lng;
        lat2 = obj2.lat;
        lng2 = obj2.lng;
    }

    // Icone da seta
    const setaIcon = {
    icon: {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3,
        strokeColor: '#FFC107' //'var(--corBackground)'
    },
    offset: '100%'
    }
    
    setaLine = new google.maps.Polyline({
        path: [
        { lat: lat1, lng: lng1 },
        { lat: lat2, lng: lng2 }
        ],
        strokeColor: mostrar ? '#FFC107' : 'transparent', //'var(--corBackground)'
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [setaIcon]
    });

    // Adicionar seta ao mapa.
    setaLine.setMap(map);
    Linhas.push(setaLine);
    
}

// Mostrar ou Esconder as setas
function toggleArrow(mostrar) {
    if (!Linhas) return;
    Linhas.forEach((linha) => {

    if (mostrar) {
        linha.setMap(map)
    } else {
        linha.setMap(null)
    }
    
    });
}

// Adicionar empresas associadas.
function adicionarEmpresaAssociadas(event) {
    let adicionarServico = [];
    let adicionarEmpresa = [];
    
    for (let i = 0; i < especificarServico.childElementCount; i++) {
        let valor = especificarServico.childNodes[i].value;
        if (!valor) continue;
        console.log('adicionado empresa ' + empresas[i].nome);
        // ID da empresa => Serviço
        adicionarServico.push(valor);
        adicionarEmpresa.push(empresas[i]);
    }

    // Passa por todo poste e adiciona a empresa associada
    selecionados.forEach((e) => {
        for (let i = 0; i<adicionarServico.length; i++){
            e.adicionarEmpresaAssociadas(adicionarEmpresa[i].nome, ...adicionarServico[i]);
        }
    })

    for (let i = 0; i < especificarServico.childElementCount; i++) {
        especificarServico.childNodes[i].value = '';
    }
    recarregarForcado.click();
    togglePopUpAssociadas(false);
}

// esses popups são apenas htmls que aparecerem e somem com um style.display, nada de mais.
function togglePopUpCriarPoste(bool) {
    if (bool) {
        popUpCriarPoste.style.display = 'flex';
        togglePopUpAssociadas(false);
    } else {
        popUpCriarPoste.style.display = 'none';
    }
    
}

function togglePopUpAssociadas(bool) {
    if (bool) {

        if (selecionados.length < 1) {
            alert('Selecione postes segurando CTRL e clicando');
            return;
        }

        popUpAdicionarAssociadas.style.display = 'flex';
        listarArrayEmElement(selecionarEmpresaOnLoad, 'p', empresas);
        criarElementosXVezes(especificarServico, 'input', selecionarEmpresaOnLoad.childElementCount, 'text', 'servicoTextInput');
        
        togglePopUpCriarPoste(false);
    } else {
        popUpAdicionarAssociadas.style.display = 'none';
    }
}

// Criar um poste com o popUp
// Ele processa os dados e então envia para os objetos poste (e atualiza o mapa)
function criarPoste() {

    let lat = document.getElementById('PopUpLat').value;
    let lng = document.getElementById('PopUpLng').value;

    if (!(lat && lng)) return
    
    if (lat.includes('°')) lat = coordsStringToNumber(lat)
    if (lng.includes('°')) lng = coordsStringToNumber(lng)
    
    new Poste(parseFloat(lat), parseFloat(lng), empresa_logada.nome, [], {});
    togglePopUpCriarPoste(false);
    recarregarForcado.click();
    
}

/* Função de apoio */
function acharIndicePoste(achar) {
    for (let indice = 0; indice<empresa_logada.__postes.length; indice++){
        try {
            let posteStringId = empresa_logada.__postes[indice]._StringGlobalId;
        if (posteStringId.slice(0,5) != achar.slice(0,5)) {
            continue;
        }

        if (posteStringId == achar) {
            return indice;
        }
        } catch (error) {
            console.log(error)
        }
        
    }
}


// Transformar 27°18'36.9"S 52°11'53.7"W em {lat: -27.18369}
function coordsStringToNumber(coords) {
    
    let rosaVento = {
        'S': -1,
        'W': -1,
        'N': 1,
        'E': 1
    }
    coords = coords.replaceAll(' ', '');

    let I_grau = coords.indexOf('°')//°
    let I_minuto = coords.indexOf("'")//'
    let I_segundo = coords.indexOf('"')//"
    let L_rosa = coords[coords.length-1]//letra NEWS

    let grau = coords.slice(0, I_grau);
    let minuto = coords.slice(I_grau+1, I_minuto);
    let segundo = coords.slice(I_minuto+1, I_segundo);

    let total = `${grau}%${minuto}${segundo}`;
    total = parseFloat(total.replaceAll('.', '').replace('%', '.')) * rosaVento[L_rosa];
    // console.log(total);

    return total;
    
}

