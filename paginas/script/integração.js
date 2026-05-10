
// async function criarNotificacao(){

//     const texto = document.getElementById('descricao').value;
//     const id_do_poste = document.getElementById('nomePoste').value; // no html não tem opção de id, temos que arrumar isso ou só colocar id invés de nome
//     const status = document.getElementById('').value; // ainda não tem ou o meu ta bugado

//     response = await fetch('http://localhost:3001/criarnotificacao', {
//          method: "POST",
//          body: JSON.stringify({
//             texto,
//             id_do_poste,
//             status
//         })
//     });
// }

// const data = await response.json();



async function editarNotificacao(id) {
    response = await fetch('http://localhost:3001/editarnotificacao/id', {
        method: "PUT",
        body: JSON.stringify({
            texto,
            id_do_poste,
            status
        })
        
    });  
}


async function deletarNotificacao(id) {
    response = await fetch('htpp://localhost:3001/deletarnotificacao/id', {
        method: "DELETE",
        body: JSON.stringify({
            id
        })
    }
)};


// Empresas // 
async function criarEmpresa() {
    const nome = document.getElementById(nome).value;
    const email = document.getElementById(email).value;
    const senha = document.getElementById(senha).value;
    const cnpj = document.getElementById(cnpj).value;

    response = await fetch('htpp://localhost:3001/cadastrarempresa', {
        method: "POST",
        body: JSON.stringify({
            nome, 
            email, 
            senha, 
            cnpj
        })
    }

)};


//carregar

async function carregarPostesDoBD() {
    const response = await fetch('http://localhost:3001/postes', {
        method: "GET",
    });

    const postes = await response.json();

    postes.forEach(function(ponto) {
        new Poste(parseFloat(ponto.lat), parseFloat(ponto.lng), empresa_logada.db_id, [], {}, ponto.status, ponto.id)    
    });
    carregarTodasNotificacoes(empresa_logada.__postes);
}

async function carregarNotificacoesDoBD() {
    const response = await fetch('http://localhost:3001/notificacoes/:id_empresa', {
        method: "GET",
    });

    const postes = await response.json();

    postes.forEach(function(ponto) {
        new Poste(parseFloat(ponto.lat), parseFloat(ponto.lng), empresa_logada.db_id, [], {}, ponto.status, ponto.id)    
    });
    carregarTodasNotificacoes(empresa_logada.__postes);
}