# CRVG Sem Filtro — Site do Vasco da Gama

## Sobre o Projeto

**CRVG Sem Filtro** é um site não-oficial dedicado ao Clube de Regatas Vasco da Gama, criado para fornecer informações dinâmicas e atualizadas sobre o clube. O projeto oferece uma visão completa do elenco do time, com dados detalhados de jogadores, estatísticas históricas, notícias, próximos jogos, curiosidades e muito mais. Tudo isso em uma interface moderna, acessível e responsiva, usando as mais recentes tecnologias de desenvolvimento web.

### Objetivos

- **Centralizar as informações sobre o Vasco** em um único site.
- **Fornecer estatísticas ao vivo** e atualizadas de partidas e jogadores.
- **Exibir notícias relevantes** sobre o clube com integração automática.
- **Oferecer uma experiência de usuário fluida** com navegação SPA (Single Page Application).

---

## Funcionalidades

- **Elenco Completo:** Exibição detalhada do elenco atual, com informações dos jogadores, como nome, posição, número e estatísticas de desempenho.
- **Estatísticas do Clube:** Dados históricos do Vasco, como títulos conquistados, participação em campeonatos e outras informações relevantes.
- **Próximos Jogos:** Exibição das próximas partidas do Vasco com dados ao vivo.
- **Últimos Jogos:** Resultados e estatísticas das últimas partidas, integrados com o SofaScore.
- **Notícias Automáticas:** Integração com a NewsAPI para exibir as últimas notícias sobre o Vasco.
- **Curiosidades:** Fatos históricos e curiosidades sobre o clube, coletados da Wikipedia.
- **SPA (Single Page Application):** Navegação sem recarregar a página.
- **Acessibilidade:** Navegação por teclado, foco visível, ARIA labels e responsividade.
- **Design Responsivo:** Layout adaptável para desktop e mobile.
- **Widgets Integrados:** Sofascore para placares e estatísticas ao vivo.

---

## Estrutura do Projeto

```

vasco-jogadores-site/
├── package.json
├── scripts/
│   └── noticiasVasco.js
└── src/
├── App.js
├── index.html
├── main.js
├── components/
│   ├── curiosities/
│   │   └── CuriositiesSection.js
│   ├── home/
│   │   ├── PlayerCard.js
│   │   ├── PlayerSection.js
│   │   └── Sidebar.js
│   ├── news/
│   │   └── NewsSection.js
│   └── others/
│       ├── Footer.js
│       └── Header.js
├── data/
│   └── jogadores.js
├── img/
│   ├── icones/
│   └── jogadores/
├── services/
│   ├── apiFutebolService.js
│   └── newsApiService.js
└── styles/
└── main-style.css

````

---

## Tecnologias Utilizadas

- **Frontend:** JavaScript (ES6+), HTML5, CSS3
- **APIs:** [SofaScore](https://www.sofascore.com/), [SportMonks](https://www.sportmonks.com/), [NewsAPI](https://newsapi.org/)
- **Node.js:** Scripts para coleta de notícias
- **Live Server:** Para desenvolvimento local
- **Acessibilidade:** ARIA, navegação por teclado, foco visível

---

## Como Executar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [npm](https://www.npmjs.com/) instalado

### Instalação

1. **Clone o repositório:**
   ```
   git clone https://github.com/arthursteinerr/vasco-site.git
   cd vasco-site/vasco-jogadores-site
    ````

2. **Instale as dependências:**

   ```bash
   npm install
     ```

3. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm start
   ````

   O site estará disponível em `http://127.0.0.1:8080` ou `http://localhost:8080`.

---

## Scripts Disponíveis

* `npm start` — Inicia o servidor local com live reload.
* `npm run build` — (placeholder) Processo de build customizado pode ser adicionado.

---

## APIs e Fontes de Dados

* **SofaScore:** Widgets de classificação, placar ao vivo e estatísticas.
* **SportMonks:** Dados de partidas, jogadores e estatísticas detalhadas.
* **NewsAPI:** Notícias recentes sobre o Vasco da Gama.
* **Wikipedia:** Resumo dinâmico sobre o clube.

> **Observação:** Algumas APIs podem exigir chave de acesso. Configure variáveis de ambiente ou edite os arquivos de serviço conforme necessário.

---

## Acessibilidade

* Navegação por teclado em todos os componentes.
* Foco visível e navegação SPA sem recarregar a página.
* Uso de ARIA labels e roles para leitores de tela.
* Layout responsivo e contraste adequado.

---

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b minha-feature`)
3. Commit suas alterações (`git commit -m 'feat: Minha nova feature'`)
4. Push para a branch (`git push origin minha-feature`)
5. Abra um Pull Request

---

## Créditos

* Dados e widgets: SofaScore, SportMonks, NewsAPI, Wikipedia
* Ícones e imagens: Logos oficiais do Vasco da Gama

---

**CRVG SEM FILTRO — O VASCO**
