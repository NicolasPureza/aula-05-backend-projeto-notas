# Documentação — Aula 05 (API REST CRUD de Notas + Postman)

## 1. Estrutura da Entrega
- `backend-projeto-notas/`: API REST em Express.js com persistência em `data.json`.
- `frontend-notas-react/`: Interface React com operações CRUD completas.
- `postman_collection.json`: Coleção pronta para importar no Postman (`Import -> File`).

## 2. Endpoints e Códigos de Resposta
| Método | Rota | Descrição | Códigos HTTP |
| :---: | :--- | :--- | :--- |
| `GET` | `/api/notes` | Lista todas as notas | `200 OK` |
| `GET` | `/api/notes/:id` | Busca uma nota pelo ID | `200 OK`, `404 Not Found` |
| `POST` | `/api/notes` | Cria nota (`titulo`, `texto`) | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/notes/:id` | Atualiza nota existente | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/notes/:id` | Exclui uma nota | `204 No Content`, `404 Not Found` |

## 3. Questões para Refletir (Respostas)

1. **Riscos de segurança do projeto e mitigação:**
   - *CORS totalmente aberto (`*`):* permite requisições de qualquer origem; deve ser restringido ao domínio do Front-end em produção.
   - *Ausência de autenticação/autorização:* qualquer pessoa com a URL pode ler, editar ou apagar notas; mitiga-se com JWT/OAuth e validação de permissões.
   - *Falta de rate limiting e sanitização:* requisições em massa ou payloads gigantes podem derrubar o servidor; mitiga-se com `express-rate-limit`, `helmet` e validação de esquema (ex.: Zod/Joi).

2. **Usar um arquivo JSON (`data.json`) em produção é boa prática?**
   - **Não.** *Vantagens:* simplicidade para protótipos e estudos sem configurar banco de dados. *Desvantagens:* risco de corrupção em escritas concorrentes, ausência de transações ACID, perda de dados em plataformas com sistema de arquivos efêmero (como plano gratuito do Render) e falta de índices de consulta.

3. **Limitações com 10.000 registros:**
   - Toda leitura/escrita usa `readFileSync`/`writeFileSync` carregando e reescrevendo o arquivo inteiro na memória e no disco de forma síncrona, bloqueando o Event Loop do Node.js, causando lentidão severa e alto risco de falha por concorrência.

4. **Por que concentrar tudo em `server.js` é problemático e como melhorar:**
   - Mistura configuração do servidor, rotas, regras de negócio e persistência no mesmo arquivo, dificultando testes e manutenção. A melhoria consiste em modularizar em camadas: `routes/`, `controllers/`, `services/` e `repositories/` (ou `models/`), além de middlewares separados para CORS e tratamento de erros.

## 4. Links e Evidências para Entrega
- **Repositório GitHub (Back-end):** *(inserir link)*
- **Deploy Render (Back-end):** *(inserir link)*
- **Repositório GitHub (Front-end):** *(inserir link)*
- **Deploy Vercel (Front-end):** *(inserir link)*
- **Link da Coleção no Postman:** *(importar `postman_collection.json` e inserir link compartilhado)*
