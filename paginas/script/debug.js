// Debug

function mostrarVariaveis(...itens) {
    itens.forEach((item) => {
        console.log(item);
    })
    console.log('##########')
}

function postesToString() {
    
    let objs = '';
    let conexcoes = ``;
    
    // Esse código utiliza localId, então "não funcionaria" no global
    empresa_logada.__postes.forEach((e) => {
        if (e.conexcoes != []){
            e.conexcoes.forEach((p) => {
                if (!p) return;
                conexcoes += `empresa_logada.__postes[${e._localId}].adicionarConexcao(empresa_logada.__postes[${p._localId}]) \n`;}
        )};


        objs += `new Poste(${e.lat}, ${e.lng}, empresa_logada.nome, 'IFC - Campus concórdia', [], {});\n`;
    });

    console.log(objs);
    console.log('')
    console.log('/* Conexções */')
    console.log('')
    console.log(conexcoes);

}

function postesToSQL() {
let objs = '';
    
    // Esse código utiliza localId, então "não funcionaria" no global
    empresa_logada.__postes.forEach((e) => {


        objs += `INSERT INTO postes (lat, lng, id_empresa_dona, status) VALUES (${e.lat}, ${e.lng}, 3, 1);\n`;

    });

    console.log(objs);
}

function abrirTodasGuias() {
    const paginas = ['index', 'cadastroEmpresa', 'cadastroFuncionario', 'historico', 'login', 'mapa', 'notificacoes', 'PerfilEmpresa'];
    const sufix = '.html';
    const url = "file:///home/bruno/IFC/Tecnico/2Ano/GitHub/PI-2---Grupo-5-2G/";

    paginas.forEach((pag) => {
        let prefix = '';
        if (pag != 'index') prefix = 'paginas/';

        window.open(`${url}${prefix}${pag}${sufix}`, '_blank');
    });
}