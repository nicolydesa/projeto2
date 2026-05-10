Objeto poste {
    empresa_dona: str; \n
    empresas_associadas: object[empresa: serviço]; \n
    localização: tuple = (x, y) -> Posição global, coordenadas; \n

    conexção_outros_postes?: linked_list;
}

Funções objeto poste:
- Criar novo
- Excluir
- Modificar informações (técnico)
- Gerenciar (para usuário) 
 - Criar notificações
 - Ver notificações
 - Histórico de notificações
 - Excluir/Gerenciar notificações


Como vai funcionar as notificações?
 - Empresas associadas.keys (pegar as empreasas) => Iterar e Enviar email / Aparecer na aba de notificações dela sobre o poste.


Cada empresa terá um cadastro próprio, tipo um domínio (@gmail.com e @estudantes.ifc.edu.br)
Cada empresa pode cadastrar funcionários para gerenciar o domínio da empresa.



Mapa? Minima ideia ->  Chama Ritter que ele deve saber -> Ele fez projeto mt legal sobre mapa

Funcionamento do sistema
![image](https://github.com/user-attachments/assets/377d26d3-1e99-41e3-87de-82db4379b2b5)
