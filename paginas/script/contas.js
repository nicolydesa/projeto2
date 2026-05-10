
let empresa_logada;
let empresa;
try {
    empresa = JSON.parse(localStorage.getItem('empresa')).empresa;    
} catch (error) {
    window.location.href = '../index.html';
}

console.log(empresa)

empresa_logada = new Empresa(empresa.nome, empresa.codigo, empresa.email, parseFloat(empresa.centro_lat), parseFloat(empresa.centro_lng), empresa.zoom, empresa.cnpj, empresa.id);






const nomeEmpresaElement = document.getElementById('nome-empresa');
const telefoneEmpresaElement = document.getElementById('telefone-empresa');
const cnpjEmpresaElement = document.getElementById('cnpj-empresa');

nomeEmpresaElement.innerText = empresa.nome;
telefoneEmpresaElement.innerText = empresa.telefone;
cnpjEmpresaElement.innerText = empresa.cnpj;