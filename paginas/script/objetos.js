class Poste {
    constructor(coord_lat, coord_lng, empresa_dona, conexcoes = [], empresas_associadas = {}, status = 1, bd_id, id_empresa_dona) {
        this.titulo = 'Poste #'+ ++idPostes;
        this._globalId = globalIdPostes;
        this._localId = idPostes-1;
        this._StringGlobalId = `${empresa_logada.__cod}#${++globalIdPostes}`;

        this.lat = coord_lat;
        this.lng = coord_lng;
        // this.regiao = regiao; // Str

        this.dona = empresa_dona; // Str
        this.id_empresa_dona = id_empresa_dona; // Str
        this.associadas = empresas_associadas; // Objeto {empresa: serviço: array}
        this.status = typeStatus[status]; // Apenas -> 1: Ativo ; 0: Desligado ; 2: Em manutenção;
        this.bd_id = bd_id;

        this.conexcoes = conexcoes; // Lista objetos de outros postes => Ou null
        // Conexões vai servir como apenas ir, nunca voltar (se ter um loop vai dar problema)

        this.notificacoes = [];
        this.idNotificacao = 0; // id para as notificações | local

        this.atualizarPontoMaps();
        empresa_logada.__postes.push(this);
    }

    // Método para mudar o status do poste, usando o dict "toStatus" para o texto (no main.js tem o dict)
    async setStatus(toStatusNum) { // Recebe valor de, 0, 1, 2 
            // Editar status no BD
            
            await fetch(`http://localhost:3001/postes/${this.bd_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: toStatusNum
                })
                
            });
            
        
        const toStatus = typeStatus[toStatusNum];
        let element = this;
        const originalStatus = this.status;

        let listaConexcoes = this.conexcoes;

        // Elemento atual mudar
        this.status = toStatus;

        // SE não ter postes conectados.
        if (!(listaConexcoes)) {
            return;
        }

        // Mudar postes conectados
        // Ele chama esse mesmo métodos nos outros postes.
        for (let i = 0; i<listaConexcoes.length; i++) {
            element = listaConexcoes[i];
            if (element.status == toStatus) {
                continue;
            };

            if (element.status == typeStatus[2] && !(originalStatus == typeStatus[2]) ) {
                continue;
            }
            element.setStatus(typeStatusmenos1[toStatus]);            
        };

    }

    // Acho que aqui o BD brilha @SamuVortmann
    adicionarEmpresaAssociadas(empresa, ...servico) {
        this.associadas[empresa] = [servico];

        let id_empresa_bd;
        for (let i = 0; i < empresas.length; i++) {
            if (empresas[i].nome == empresa) {
                id_empresa_bd = empresas[i].db_id;
                break;
            }
        }

        fetch(`http://localhost:3001/associar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_empresa: id_empresa_bd,
                id_poste: this.bd_id
            })
        })
    }

    adicionarServico(empresa, servico) {
        this.associadas[empresa] = this.associadas[empresa].push(servico);
    }

    _mudarRegiao(regiaoNova) {
        this.regiao = regiaoNova;
    }

    adicionarConexcao(conectar) {
        this.conexcoes.push(conectar);
    }

    novaNotificacao(descricao, status = 0) {
        // Por enquanto, vai ser uma lista de notificações que ficam armazenadas numa lista dentro do objeto poste, que quando
        // entra na página de notificações, você plota o poste que você quer ver e ele puxa as notificações
        // Por enquanto, sem o banco de dados, irá ser preciso criar tudo no main.js/debug.js

        this.notificacoes.push([descricao, ++this.idNotificacao, new Date().toLocaleString(), status, this._localId]) // Status
    }

    adicionarNotificacao(notificacao) {
        this.notificacoes.push(notificacao)
    }

    // Deletar o proprio poste da existência.
    async apoptose() {
        // Se deletar
        if (!this.bd_id) return;

        await fetch(`http://localhost:3001/postes/${this.bd_id}`, {
            method: "DELETE",
        });

        empresa_logada.__postes[this._localId] = null;

        recarregarForcado.click();
        recarregarForcado.click();
    }

    // Criar / atualizar o menuzinho no mapa.
    atualizarPontoMaps() {
        this.obj = {
            lat: this.lat,
            lng: this.lng,
            title: this.titulo,
            
            content: `
                <div class="maps-content">
                    <h2>${this.titulo}</h2>
                    <h3 class="maps-status" title="${this.status}">Status: ${this.status}</h3>

                    <p><strong>Empresa dona:</strong> ${this.dona}</p>
                    <p><strong>Empresas associadas:</strong> ${Object.keys(this.associadas)}</p>

                    <a href="./historico.html" onclick="localStorage.setItem('poste', ${this.bd_id})" target="_blank" class="historicoInfo">Histórico de notificações</a>
                    <div class="setStatus">
                        <p onclick="handleMudarStatus(${this._localId}, 0)">Desativar</p>
                        <p onclick="handleMudarStatus(${this._localId}, 1)">Ativar</p>
                        <p onclick="handleMudarStatus(${this._localId}, 2)">Em Manutenção</p>
                    </div>
                </div>
            `,
        };
        
    }
}


// Estrutura da notificação
class Notificacao {
    constructor(descricaoNotificacao='', idNotificacao, data, status = 0, idPoste) {
        this.descricaoNotificacao = descricaoNotificacao; // - text
        this.idNotificacao = idNotificacao; // global
        this.data = data;  // Tempo
        this.status = status; // é igual do poste, mas tem as nomenclaturas específicas

        this.idPoste = idPoste; // do poste dono, seria um idPoste(fk)

        this.atualizarNotificacao();

        for (let i = 0; i< empresa_logada.__postes.length; i++) {
            if (empresa_logada.__postes[i].bd_id == idPoste) {
                empresa_logada.__postes[i].adicionarNotificacao(this);
                break;
            }
        }
    }


    // Front-end, pegando informações do poste e faz mostrar
    atualizarNotificacao() {

        this.innerHTML = `<div class="notificacao">

                <div class="identificacao">
                    <p>Notificação ${this.data}</p>
                    <p>ID #${this.idPoste}-${this.idNotificacao}</p>
                </div>

                <div class="descricao">
                    <p>${this.descricaoNotificacao.slice(0, 160)}</p>
                    <p>${this.descricaoNotificacao.slice(160, 360)}</p>
                </div>

                <div class="botoes">
                    <select title="${typeNot[this.status]}" value="${typeNot[this.status]}" class="dropdown" name="select-status" onchange='changeStatusTo(this, ${this.idNotificacao})'>${typeNot[this.status]}
                        <option>${typeNot[0]}</option>
                        <option>${typeNot[1]}</option>
                        <option>${typeNot[2]}</option>
                    </select>

                    <button class="lixo" onclick="deleteNotificacao(${this.idNotificacao})"></button>
                    
                </div>

        </div>`
    }
}

// por enquanto não faz nada de mais, apenas cria o objeto.
class Empresa {
    constructor(nome, codigo, email = '', centro_lat = '', centro_lng = '', zoom = 5, cnpj = '', id) {
        this.nome = nome;
        this.__cod = codigo;

        this.db_id = id;

        // this.__senha = senha;
        this.__email = email;

        this.__postes = [];
        this.__idPostes;


        this.zoom = zoom;
        this.centroMapa = {lat: centro_lat, lng: centro_lng};


        empresas.push(this);
    }

    //const centroDoMapa = { lat: -27.200476, lng: -52.082809 }; // Entrada do IF ->
    async mudarCentro(lat, lng, zoom) {
        // mostrarVariaveis(lat,lng, zoom)

        this.centroMapa = {
            lat,
            lng,
        }
        this.zoom = zoom;

        
        let res = await fetch('http://localhost:3001/editarcentro', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                lat,
                lng,
                zoom,
                id: localStorage.id_empresa_logada
            })
            
        });

        let data = await res.json()

        localStorage.setItem('empresa', JSON.stringify({empresa: data}));

        alert('Centro mudado com sucesso');
    }
}