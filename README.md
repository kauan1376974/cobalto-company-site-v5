# Cobalto Company — versão 5.0 (upgrades comerciais)

## Como abrir
1. Extraia o ZIP.
2. Abra esta pasta no VS Code.
3. Abra `index.html` com Live Server.

## Upgrades incluídos
1. Botão flutuante de WhatsApp com configuração segura do número comercial.
2. Portfólio com três conceitos demonstrativos: sorveteria 3D, site institucional e atendimento IA.
3. Chat demonstrativo roteirizado da Cobalto Assistant.
4. Área de confiança transparente; explica que depoimentos reais serão publicados somente após projetos concluídos e autorização dos clientes.
5. Formulário refinado com campos acessíveis, limites de texto, validação nativa e feedback; composição de e-mail via `mailto:`. Ainda não armazena nem envia dados para um servidor.
6. SEO básico, metadados Open Graph/Twitter, favicon SVG, imagem de compartilhamento e dados estruturados Organization.

## Antes de publicar
### 1) Configurar o WhatsApp oficial
No arquivo `script.js`, procure:
`const COBALTO_WHATSAPP_NUMBER = "";`
Preencha com o número oficial da empresa no formato internacional, somente dígitos. Exemplo de formato: `55` + DDD + número. Não use o número de teste/pessoal. Enquanto estiver vazio, o botão informa que o WhatsApp está em configuração e não abre uma conversa.

### 2) Formulário
O formulário continua abrindo o aplicativo de e-mail do visitante com a mensagem preenchida. Para receber e organizar leads automaticamente, será necessário configurar um endpoint real (por exemplo, um webhook do n8n) e testar o envio; nenhum endpoint foi inventado nesta versão.

### 3) Chat demonstrativo
O chat usa respostas roteirizadas em JavaScript para demonstrar a experiência. Não é a Cobalto Assistant de produção, não chama a OpenAI API, não conecta ao WhatsApp e não armazena conversas.

### 4) SEO e compartilhamento
A imagem social e o favicon ficam em `assets/`. As URLs canônicas e Open Graph apontam para `https://cobalto-company.vercel.app/`. Se o domínio mudar, atualize as URLs no `<head>` e no JSON-LD.

## Dependências
- Google Fonts e Three.js são carregados por CDN; conexão com a internet é necessária para esses recursos.
- A imagem de fundo e os arquivos de compartilhamento são locais.

## Publicação na Vercel
Substitua os arquivos do projeto atual pelos desta pasta e faça um novo deploy. Teste desktop, celular, navegação, formulário, chat demonstrativo e WhatsApp depois de configurar o número oficial.
