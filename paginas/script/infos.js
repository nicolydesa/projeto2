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
   
}
carregarPostesDoBD();
