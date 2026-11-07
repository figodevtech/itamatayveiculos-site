# Carregamento e publicação do estoque

A navegação usa estruturas de carregamento por rota. Título, galeria, preço e contato dependem apenas do veículo; shorts e três similares chegam separadamente. A inicial envia oito resumos no HTML e busca mais oito por cursor na rolagem, com alternativa por botão e recuperação de falhas.

As consultas públicas executam no servidor, sem sessão do visitante. O navegador recebe resumos e opções de filtros, sem SDK Supabase para essas consultas. O logo usado no cabeçalho passou de 1.414.976 para 3.682 bytes. Imagens usam o otimizador Next, tamanhos responsivos e pré-carregamento limitado da galeria.

## Medições locais

Comparação de builds de produção com os mesmos 19 veículos públicos. Chromium local, viewport móvel 390×844, DPR 2, CPU 4× mais lenta, latência de 40 ms e download de 200 KB/s. Duas visitas por dispositivo; os números abaixo usam a primeira visita móvel e um clique após carregar a inicial. São amostras de laboratório, não percentis de usuários reais. O cache do otimizador no servidor pode estar aquecido pela visita desktop anterior.

| Medida móvel | Antes | Depois |
|---|---:|---:|
| Conteúdo principal da inicial (LCP) | 8.824 ms | 1.548 ms |
| Clique até troca de URL | 1.911 ms | 122 ms |
| Clique até título visível | 2.172 ms | 564 ms |
| HTML descomprimido da inicial | 310.840 bytes | 224.594 bytes |

O cache compartilhado dos dados estava desativado nas medições reais. Um teste inicial sem permissão de rede ficou sem estoque e foi descartado da comparação. As metas de LCP, INP e CLS devem ser confirmadas na hospedagem e em amostra de tráfego real.

## Configuração e ativação

Copie os nomes necessários de `.env.example`, sem versionar valores secretos. `PUBLIC_DATA_CACHE_ENABLED` permanece ausente ou `false` até verificar a integração completa. `true` ativa cache compartilhado por tags com revalidação de segurança de 60 segundos; a publicação pelo ERP expira os dados imediatamente, sem servir a versão anterior enquanto revalida.

O site recebe `POST /api/revalidate` com `Authorization: Bearer <SITE_REVALIDATE_SECRET>` e `{ eventId, topics, vehicleIds }`. Os tópicos aceitos são `vehicles`, `shorts`, `banners` e `settings`. O segredo precisa ter pelo menos 32 caracteres e ficar somente nos servidores. Eventos de veículos exigem seus IDs; lotes aceitam até 500 IDs e o ERP divide lotes maiores.

O ERP registra mudanças em uma outbox transacional, aguarda o ACK do site e retorna `siteSync.status` como `published` ou `pending`. A confirmação vale para novas navegações após o ACK. O histórico do navegador solicita atualização ao restaurar a rota; abas paradas não recebem atualização em tempo real.

No projeto `erpconcessionaria`, consulte `SITE-PUBLICATION.md` para a migração, as variáveis privadas, o agendamento Supabase Cron e a recuperação das pendências. Migração e scheduler precisam ser aplicados no Supabase desse ERP. Não use outro projeto das contas conectadas.

Ordem de implantação:

1. Aplicar e testar a migração da outbox em ambiente de teste, incluindo rollback transacional e rejeição de RPC para anon/authenticated.
2. Publicar o site com cache de dados desativado e o segredo de publicação configurado.
3. Publicar o ERP com URL/segredos corretos e configurar o Cron no Supabase.
4. Confirmar preço, disponibilidade, fotos, exclusões e banners nas novas navegações após ACK.
5. Ativar `PUBLIC_DATA_CACHE_ENABLED=true` e acompanhar logs de publicação, idade da pendência mais antiga e quantidade de eventos pendentes.

Em incidente de sincronização, desative a flag e faça novo deploy. As leituras voltam a consultar o banco a cada abertura. O cache de imagens permanece seguro porque arquivos substituídos usam URLs novas.

## Verificação

`npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit`, `npm.cmd test` e `npm.cmd run build` verificam o projeto. Os testes de navegador em `tests/README.md` usam banco simulado local em memória; exercitam paginação, falhas, feedback ao clique, isolamento de recursos lentos, filtros, histórico e invalidação após alteração de preço. Não execute os testes de mutação contra produção.

A migração real da outbox também foi executada em PostgreSQL 18.6 isolado (PGlite 0.5.15): oito cenários passaram para triggers, IDs antigos/novos, configurações públicas, rollback transacional, permissões anon/authenticated, RPCs service-role e confirmação/retry idempotentes. Isso valida o SQL; pg_cron, pg_net e a comunicação entre deployments continuam exigindo verificação no Supabase e hosting corretos.

Para comparar a hospedagem, registre o aparelho, rede, local, cache frio/quente e amostra. Compare resposta visual ao clique e conteúdo real separadamente. As metas são feedback em até 100 ms, título/preço em até 1 s com cache aquecido, LCP ≤2,5 s, INP ≤200 ms e CLS ≤0,1.
