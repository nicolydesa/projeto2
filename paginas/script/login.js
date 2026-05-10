// 0 -> Empresa
// 1 -> Funcionário
let estaEm = 0;

const logar = document.getElementById('login-button');
const seletor = document.getElementById('selector');

function setQuem(status) {
    estaEm = status;

    if (estaEm) {
        funcionario();
    } else {
        empresa();
    }
}

function funcionario() {
    seletor.children[0].classList.add('nao-selecionado')
    seletor.children[1].classList.remove('nao-selecionado')

}

function empresa() {
    seletor.children[0].classList.remove('nao-selecionado')
    seletor.children[1].classList.add('nao-selecionado')

}


// Validação
logar.addEventListener('click', async (e) => {
    // Debug
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    if (email.search('@') == -1) {
        e.preventDefault();
    }
    
    const senha = document.getElementById('senha').value;

    console.log(JSON.stringify({
        email,
        senha,
    }));

    const response = await fetch('http://localhost:3001/loginempresas', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            senha,
        })
    })

    const data = await response.json();

    if (!data.empresa) {
        alert(data.mensagem);
        return
    };

    localStorage.clear();
    let id = data.empresa.id;
    let strang = JSON.stringify(data)
    localStorage.setItem('empresa', strang);
    localStorage.setItem('id_empresa_logada', id);

    window.location.href = 'mapa.html';

    // for (let i = 0; i < empresas.length; i++){
    //     let empresa = empresas[i];
    //     if (empresa.__email == email && empresa.__senha == senha /* && empresa.__cod == codUnicSelecionado*/) {
    //         localStorage.setItem('empresa_logada', i);
    //         e.preventDefault();
    //         // window.location.replace('mapa.html');
    //         window.location.href = 'mapa.html'; 
            
    //         return;
    //     };
    // }

    
})