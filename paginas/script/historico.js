

// Muitas das funções daqui são iguais a da notificação
let postePrincipal;

const popUp = document.getElementById('pop-up');
const sectionNot = document.getElementById('sec-notificacoes');
const nomePoste = document.getElementById('nomePoste');
const descDeTextbox = document.querySelector('#pop-up #descricao');

async function changeStatusTo(element, bd_id) {    
    element.title = element.value;
    
    response = await fetch(`http://localhost:3001/editarnotificacao/${bd_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            status: typeSNotmenos1[element.title]
        })
        
    });
    carregarNotificacoesDoBD(localStorage.getItem('poste'));
}

async function deleteNotificacao(e) {
    // Para mudar no objeto Poste
    await fetch(`http://localhost:3001/deletarnotificacao/${e}`, {
            method: "DELETE"
        }
    );

    carregarNotificacoesDoBD(localStorage.getItem('poste'));
}

async function criarNotificacao() {
    if (!(nomePoste.value)) {
        alert('Sem nenhum poste selecionado!');
        return;
    }
    //
    let descricao = descDeTextbox.value;
    togglePopUp(false);
    descDeTextbox.value = '';

    //
    await fetch('http://localhost:3001/criarnotificacao', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            descricao,
            status: 0,
            id_poste_associado: localStorage.getItem('poste')
        })
    })
    carregarNotificacoesDoBD(localStorage.getItem('poste'))
}

function limparHTMLNot() {
    sectionNot.innerHTML = '';
}



function togglePopUp(bool) {
    if (!(bool)) {
        popUp.style.display = 'none';
    } else {
        popUp.style.display = 'flex';
        popUp.children[3].innerText = `Criando notificação no ${nomePoste.value}`
    }
    
}

function adicionarNotificacao(notificacao) {
    notificacao.atualizarNotificacao();
    sectionNot.innerHTML = `${notificacao.innerHTML} ${sectionNot.innerHTML}`;   
}

function selecionarTextoCertoDropdowns() {
    let dropdowns = document.getElementsByClassName('dropdown');
    for (let i = 0; i < dropdowns.length; i++) {
        let element = dropdowns[i];
        let index = typeSNotmenos1[element.title];
        element.selectedIndex = index;
    };
}

function selecionarTextoCertoDropdownsTitulo(id_poste) {
    let dropdowns = nomePoste;
    for (let i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i].obj.bd_id == id_poste) {
            nomePoste.selectedIndex = i;
            break;
        }

    };
}

function acharPostePeloID(idTotal) {
    indices = idTotal.innerText.split('#')[1].split('-');
    //o indice[0] é o indice do poste, e o indice[1] é o indice da notificação dentro do poste.
    return [empresa_logada.__postes[indices[1]-1], parseInt(indices[1])-1]
    // Retorna o poste e a notificação
}

// 1° parte é a página, agora é a integração com o resto
// Como é só pra ver os postes da empresa logada, utilizaria um idLocal pra pegar da lista de postes (da empresa logada)
function handleChangePoste(nome) {
    let idOf = empresa_logada.__postes[parseInt(nome.slice(nome.indexOf('#')+1)-1)].bd_id;
    carregarNotificacoesDoBD(idOf)
}

// @deprecated
async function pegarPoste(poste) { // Objeto poste
    postePrincipal = poste;
    limparHTMLNot();
    nomePoste.value = poste.titulo;
    let notificacaoes = [...poste.notificacoes];
    notificacaoes.forEach((infos) => {
        if (infos) {
            adicionarNotificacao(new Notificacao(...infos));
        }
    });

    selecionarTextoCertoDropdowns();
}

// BD
async function carregarPostesDoBD() {
    const response = await fetch('http://localhost:3001/mapa/postes', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_empresa: localStorage.id_empresa_logada,
        })
    })

    const postes = await response.json();

    postes.forEach(function(ponto) {
        new Poste(parseFloat(ponto.lat), parseFloat(ponto.lng), empresa_logada.db_id, [], {}, ponto.status, ponto.id)    
    });

    listarArrayEmElement(nomePoste, 'option', empresa_logada.__postes);

    let postePegado = localStorage.getItem('poste');
    if (postePegado == '' || postePegado == null || postePegado == 'null' || postePegado == 'undefined') {
        carregarNotificacoesDoBD(1)
    } else {
        carregarNotificacoesDoBD(postePegado)
    };
}

async function carregarNotificacoesDoBD(id_poste) {
    const response = await fetch(`http://localhost:3001/postes/notificacoes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_poste,
        })
    })

    const notificacoes = await response.json();

    sectionNot.innerHTML = '';
    notificacoes.forEach(function(ponto) {
        let novaData = ponto.data.split('T')[0] + ' as ' + ponto.data.split('T')[1].slice(0, -2);
        let temp = new Notificacao(ponto.descricao, ponto.id, novaData, ponto.status, ponto.id_poste_associado)    
        
        sectionNot.innerHTML += temp.innerHTML;
    });

    selecionarTextoCertoDropdowns();
    selecionarTextoCertoDropdownsTitulo(id_poste);
    localStorage.setItem('poste', id_poste);

}



carregarPostesDoBD();
