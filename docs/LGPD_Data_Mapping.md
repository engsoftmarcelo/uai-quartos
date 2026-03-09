# Inventário de Fluxo de Dados (Data Mapping) - UAI QUARTOS

## 1. Dados Pessoais Tradicionais (Identificação e Transação)
Estes dados são recolhidos para a execução do contrato de arrendamento e criação de conta.
* **Nome Completo e Email:** Capturados no ecrã de registo (SSO Google/Apple).
* **CPF/RG (Documentos):** Capturados no fluxo de KYC (Conheça o seu Cliente) para validar os senhorios/locadores.
* **Dados Financeiros:** Tokens de pagamento e chaves Pix transacionados de forma encriptada.
* **Morada/Geolocalização:** Endereço das repúblicas e raio de distância para as universidades.

## 2. Dados Pessoais Sensíveis (Algoritmo de Matching)
**Atenção Crítica (Art. 5º, II da LGPD):** Dados que podem gerar discriminação ou revelar aspetos íntimos da personalidade.
* **Hábitos de Convivência:** Rotinas de sono, tolerância a ruído, políticas de limpeza e receção de convidados.
* **Justificativa de Recolha:** Estritamente baseada no consentimento explícito (gamificado no front-end) e anonimizada sempre que possível no perfil público, sendo processada apenas pelo motor matemático para o *Match Score*.

## 3. Matriz de Responsabilidades (Controlador vs. Operador)

De acordo com as diretrizes da ANPD para Agentes de Pequeno Porte (ATPP):

* **O Controlador (UAI QUARTOS):** Nós somos a entidade que toma as decisões sobre o tratamento dos dados dos estudantes e locadores. A responsabilidade legal primária em caso de fuga de dados é da nossa plataforma.

* **Os Operadores (Serviços Terceirizados):**
    São as empresas que processam dados em nosso nome, estritamente de acordo com as nossas instruções programadas no backend.
    * **iugu (Gateway de Pagamentos):** Atua como Operador para o processamento do *Split Payment* e liquidação via Pix. Não tem autorização para utilizar os e-mails dos nossos estudantes para marketing próprio.
    * **AWS / Render (Cloud Provider):** Atua como Operador de infraestrutura, alojando a nossa base de dados PostgreSQL onde os perfis estão armazenados. O contrato de serviço deles garante a segurança física dos servidores.

## 4. Base Legal de Tratamento (Art. 7º da LGPD)
1.  **Consentimento:** Para o algoritmo de *matching* de hábitos de vida.
2.  **Execução de Contrato:** Para o repasse financeiro e geração do PDF de arrendamento digital (ICP-Brasil).
3.  **Cumprimento de Obrigação Legal:** Retenção de logs de acesso e recibos fiscais (IBS/CBS) por tempo determinado pela legislação nacional.

## 5. Tipificação de Casos de Uso e Bases Legais (RoPA - Parte 1)

O tratamento de dados no UAI QUARTOS obedece estritamente ao Art. 7º da LGPD. As finalidades estão consolidadas abaixo para prevenir a revogação indevida de dados críticos por parte dos usuários:

* **Processo:** Liquidação Financeira via Pix (Split Payment).
    * **Dados:** Chaves Pix, CPF, Histórico de Transações, Valores.
    * **Base Legal:** Execução de Contrato (Art. 7º, V) e Cumprimento de Obrigação Legal/Regulatória (Art. 7º, II).
    * **Justificativa:** O titular não pode invocar o direito de exclusão destes dados caso possua contratos ativos ou faturas emitidas nos últimos 5 anos, devido a normativas do Banco Central e Receita Federal.

* **Processo:** Algoritmo de Compatibilidade (Match Score).
    * **Dados:** Hábitos de sono, rotina, nível de sociabilidade (Dados Sensíveis).
    * **Base Legal:** Consentimento explícito e destacado (Art. 11, I).
    * **Justificativa:** O estudante pode revogar o consentimento a qualquer momento no painel, o que fará com que o sistema zere os seus vetores no banco de dados e o exclua do motor de busca de repúblicas.

* **Processo:** Intermediação de Contato (Chat WebSockets).
    * **Dados:** Conteúdo das mensagens trocadas entre estudante e locador.
    * **Base Legal:** Execução de Contrato e Legítimo Interesse (Art. 7º, IX).

    ## 6. Ciclo de Vida, Retenção e Deleção Ativa (Garbage Collection)

As políticas de retenção estão diretamente atreladas às tabelas do PostgreSQL e serão aplicadas via rotinas automatizadas (CRON Jobs) no backend:

* **Documentos de Verificação Antifraude (KYC):**
    * **Tabelas/Storage:** Buckets S3 temporários.
    * **Ciclo de Vida:** Retenção máxima de 48 horas.
    * **Deleção:** Assim que a API governamental retornar sinal positivo atestando a veracidade do locador, a imagem (RG/CNH) sofre varredura de exclusão definitiva (Hard Delete). O banco PostgreSQL passa a armazenar apenas um booleano `isVerified: true`.

* **Registros Financeiros e Logs de Acesso:**
    * **Tabelas:** `invoices`, `transactions`, `access_logs`.
    * **Ciclo de Vida:** 5 anos completos após o encerramento da conta, conforme Marco Civil da Internet (Art. 15) e legislação tributária.

* **Contas Inativas / Estudantes que não fecharam contrato:**
    * **Tabelas:** `users`, `preferences_vectors`.
    * **Ciclo de Vida:** 12 meses de inatividade.
    * **Deleção:** Após o prazo, os dados sensíveis são anonimizados (Soft Delete) para compor estatísticas gerais da plataforma, quebrando o vínculo com o CPF original.

    ## 7. Medidas de Segurança e Arquitetura Defensiva (Privacy by Design)

Para garantir a integridade e confidencialidade da carga de dados dos estudantes e senhorios, a plataforma implementa de forma obrigatória as seguintes salvaguardas cibernéticas:

* **Cifragem e Ofuscamento:**
    * **Em trânsito:** Toda a comunicação entre o cliente (navegador/app) e o servidor Node/NestJS, bem como chamadas internas para APIs externas, é estritamente realizada via protocolo TLS 1.3 de ponta a ponta.
    * **Em repouso:** Os dados sensíveis na base de dados (PostgreSQL) utilizam encriptação com matriz criptográfica padrão AES-256. As palavras-passe dos utilizadores são protegidas utilizando algoritmos de *hashing* fortes (bcrypt/Argon2) com *salt* dinâmico.

* **Estruturação de Consent Logs (Registos de Consentimento):**
    * A aceitação dos Termos de Uso e o consentimento explícito para o processamento de dados sensíveis (para o algoritmo de *matching*) são guardados numa coleção lógica *append-only* (apenas inserção, sem possibilidade de edição ou eliminação).
    * Cada registo preserva de forma perpétua e imutável a marcação temporal (*timestamp*) exata, o endereço IP de origem e o identificador do contrato aceite, servindo como prova legal irrefutável da vontade do titular.

    ## 8. Controlo de Partilha B2B e Prevenção de Exfiltração Operacional

O UAI QUARTOS aplica o princípio do menor privilégio e a minimização de dados na partilha de informações com parceiros corporativos (B2B):

* **Integração Financeira Atómica:** Vetores confidenciais cruciais atrelados à faturação (como CPFs, valores de arrendamento e chaves Pix) transitam única e exclusivamente via chamadas Secure HTTP diretas (API RESTful) do nosso *backend* para os *data centers* da iugu.
* **Proibição de Instâncias Mediadoras:** Fica terminantemente proibida a exportação manual de dados financeiros em lote (ficheiros CSV/Excel) ou o trânsito destas informações através de e-mails corporativos não encriptados.
* **Mitigação de Riscos:** Esta arquitetura hermética elimina o risco de exfiltração de dados por erro humano ou táticas de engenharia social (golpes de *phishing* contra terminais administrativos da plataforma), limitando a área de exposição aos túneis criptográficos geridos automaticamente pelo servidor.