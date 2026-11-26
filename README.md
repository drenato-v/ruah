# Ruah Cafeteria — site

Landing page da Ruah Cafeteria (São José do Rio Preto, SP)
Desenvolvido pela Axion — axion-brasil.com · @axion.brazil · WhatsApp (17) 99717-0139.

## Estrutura

```
index.html          página (só HTML + dados estruturados JSON-LD)
css/estilo.css      todos os estilos
js/main.js          interações: cardápio em abas, faixa, olhos, leque, vídeo, carregamento do 3D
js/xicara3d.js      cena 3D do topo, já compilada (não editar à mão)
fonte/xicara3d.js   código-fonte da cena 3D (bule de inox servindo café na xícara da Ruah)
img/                logo, favicon, imagem de compartilhamento (og-ruah.jpg), foto de reserva do topo
img/produtos/       fotos dos produtos enviadas pela Ruah (900px)
img/espaco/         fotos do espaço tiradas do reel da inauguração
video/              reel da inauguração (sem áudio, 1,3 MB) + capa
robots.txt, sitemap.xml, llms.txt, llms-full.txt   arquivos para buscadores e IAs
package.json        comando para gerar o 3D
```

Para ver no computador: `npm run dev` (ou o Live Server do VS Code). Abrindo o `index.html` direto pelo Finder o site funciona, mas o 3D não aparece (o navegador bloqueia módulos em `file://`) e fica a foto de reserva.

## Cena 3D do topo

Um bule de inox inclinado derrama um filete contínuo de café na xícara da Ruah, que está no pires. O café faz ondinhas e respingos onde cai, a cena gira um pouco com o mouse e pausa quando sai da tela. Sem WebGL, aparece a foto `img/hero-espresso.webp`; com "reduzir movimento" ligado, a cena fica parada.

Para mudar a cena, edite `fonte/xicara3d.js` e gere de novo:

```
npm install
npm run build:3d
```

## Arquivos para buscadores e IAs

- `robots.txt` — libera o site para buscadores e robôs de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended etc.) e aponta o sitemap.
- `sitemap.xml` — lista a página e as fotos dos produtos.
- `llms.txt` — resumo da cafeteria em Markdown para assistentes de IA (padrão llmstxt.org).
- `llms-full.txt` — cardápio completo, combos com preço e perguntas frequentes.
- `index.html` — dados estruturados JSON-LD (`CafeOrCoffeeShop` + `Menu` com preços dos combos), Open Graph e URL canônica.

Todos usam a URL `https://drenato-v.github.io/ruah/`. Se o site for para um domínio próprio, troque essa URL em todos esses arquivos (busca e substitui).

## Ajustes pendentes com o cliente

1. Cardápio (array `CARD` no script): itens vieram das fotos e dos slides da TV — confirmar o nome do "salgado assado", os sabores da soda italiana e os preços avulsos (só os combos têm preço: R$ 9 / 15 / 20).
2. Horário de fechamento (hoje: ter a dom a partir das 8h, segunda fechado). Endereço já confirmado: Av. Arthur Nonato, 4001 – Vila Sinibaldi, CEP 15084-000 (Casa Viva Church).
3. WhatsApp da cafeteria, se houver, para trocar o botão "Chamar no direct".
4. Fotos do espaço (`espaco.jpg`) e do cappuccino (`cafe.jpg`) ainda são do Instagram.
