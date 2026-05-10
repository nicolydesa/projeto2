async function criarEmpresa() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const senhaC = document.getElementById('confirm-senha').value;
    const cnpj = document.getElementById('cnpj').value;
    const telefone = document.getElementById('tel').value;
    const codigo = document.getElementById('cod').value;

    if (senha != senhaC) {
        alert('Confirme a senha corretamente!');
        return;
    }

    let response = await fetch('http://localhost:3001/cadastroempresa', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome, codigo, cnpj, telefone, email, senha
        })
    })
    let output = await response.json();
    return output.bool == 1;
};


async function handleSubmit(event) {
    event.preventDefault()

    let resposta = await criarEmpresa();

    if (resposta) {
        window.location.href = 'login.html'
    } else {
        alert('Dados duplicados!')
    }
}