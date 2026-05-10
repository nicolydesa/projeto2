
// Global -> Todas empresas lê essas variáveis
let globalIdPostes = 0;
let empresas = [];

// Local -> Apenas empresa logada lê
let idPostes = 0;

// front-end => Variaveis mudáveis
const statusColor = ['#FF7979', "#7ED957" ,"#598EFF", "#FF0000", "#00BF63", "#0051FF"]
// @deprecated vai virar da empresa específico


let map;
// Status geral
const typeStatus = ['Desligado', 'Ativo' ,'Em manutenção'];
const typeStatusmenos1 = {'Desligado': 0, 'Ativo': 1, 'Em manutenção': 2} // Como se fosse uma função na menos 1, só o contrário da "dict" normal
// Status da notificação
// Mesma coisa que o status geral
const typeNot = ['Ativa', 'Concluida','Manut.'];
const typeSNotmenos1 = {'Ativa': 0, 'Concluida': 1 ,'Manut.': 2}

// Código para mostrar as informações da empresa
const perfilEmpresa = document.getElementById('perfilEmpresa');
document.getElementById('iconeEmpresa').addEventListener('click', (e) => {
    if (perfilEmpresa.style.display == 'none') {
        perfilEmpresa.style.display = 'block';
    } else {
        perfilEmpresa.style.display = 'none';
    }
});


/* !Pega informações globais! */
// Pega uma lista de algo e transforma em objetos, então a estrutura base é:
// <objeto onchange ou onclick="listarArrayEmElement(this, 'objeto', array)">
// this -> o objeto criado para colocar o array dentro, podendo ser uma <ul> com <li> dentro.
// 'objeto' -> o <li> do <ul>, a <option> do <select>, que as informações do array vão para
// Array de objetos
function listarArrayEmElement(elementoPai, element, arraySelecionado) {
    elementoPai.innerHTML = '';

    arraySelecionado.forEach((item) => {
        let opcao = document.createElement(element);
        opcao.obj = item;
        if (item.nome){
            opcao.value = item.nome;
            opcao.innerText = item.nome;
        } else if (item.titulo) {
            opcao.value = item.titulo;
            opcao.innerText = item.titulo;
        }

        elementoPai.append(opcao);
    })
}

// Cria um elemento tantas vezes, mais front-end
function criarElementosXVezes(elementoPai, element, vezes, tipo = '', clase = '') {
    elementoPai.innerHTML = '';

    for (let i = 0; i< vezes; i++) {
        let opcao = document.createElement(element);

        if (tipo) opcao.type = tipo;
        if (clase) opcao.classList.add(clase);
        

        elementoPai.append(opcao);
    }
}

function acharIndiceDeXemY(elemento, pai) {
    let lista = pai.children;
    for (let i = 0; i < lista.length; i++) {
        if (lista[i] == elemento) {
            return i;
        }
    }
}

function removeItemDeArray(item, array) {
    for (let i = 0; i< array.length; i++) {
        if (array[i] == item) {
            array.splice(i, 1);
        }
    }
}