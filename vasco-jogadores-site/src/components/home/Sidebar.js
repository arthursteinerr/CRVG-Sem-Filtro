// src/components/Sidebar.js

const SOFASCORE_BASE_WIDGET_URL = 'https://widgets.sofascore.com/pt-BR/embed/';

// Flag para garantir que o iframe não seja recarregado
let iframeCarregado = false;
let iframeElement = null;

/**
 * Cria um elemento HTML com opções básicas.
 */
function createElement(tag, { classList = [], attributes = {}, textContent = '', html = '' } = {}) {
    const el = document.createElement(tag);
    if (classList.length) el.classList.add(...classList);
    Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
    if (textContent) el.textContent = textContent;
    if (html) el.innerHTML = html;
    return el;
}

/**
 * Cria uma seção com título e conteúdo.
 */
function createSection(id, title) {
    const section = createElement('section', { attributes: { id } });
    const heading = createElement('h2', { textContent: title });
    const content = createElement('div', {
        classList: ['estatisticas-box'],
    });
    section.append(heading, content);
    return { section, content };
}

/**
 * Widget de momentum do SofaScore.
 */
function carregarUltimoJogo() {
    // Se o iframe já foi carregado, retorna sem fazer nada
    if (iframeCarregado && iframeElement) {
        return iframeElement;
    }

    // Cria o container do iframe
    const container = createElement('div');

    // Cria o iframe e o armazena
    iframeElement = createElement('iframe', {
        attributes: {
            width: '100%',
            height: '286',
            src: 'https://widgets.sofascore.com/pt-BR/embed/attackMomentum?id=13955162&widgetTheme=light',
            frameborder: '0',
            scrolling: 'no'
        }
    });

    // Cria o crédito
    const credit = createElement('div', {
    });

    container.append(iframeElement, credit);

    // Marca o iframe como carregado
    iframeCarregado = true;

    return container;
}

/**
 * Widget de classificação do Brasileirão.
 */
function carregarClassificacao(content) {
    content.innerHTML = '';
    const tournamentId = 83;
    const seasonId = 72034;
    const iframe = createElement('iframe', {
        attributes: {
            id: `sofa-standings-embed-${tournamentId}-${seasonId}`,
            src: `${SOFASCORE_BASE_WIDGET_URL}tournament/${tournamentId}/season/${seasonId}/standings/Brasileiro%20Serie%20A%202025?widgetTitle=Brasileiro%20Serie%20A%202025&showCompetitionLogo=true`,
            style: 'height:1123px!important;width:100%!important;',
            frameborder: '0',
            scrolling: 'no',
            title: 'Tabela de Classificação do Brasileirão Série A'
        }
    });
    const credit = createElement('div', {
        attributes: { style: 'font-size:12px;font-family:Arial,sans-serif;text-align:right;margin-top:5px;' }
    });
    content.append(iframe, credit);
}

/**
 * Componente principal Sidebar.
 */
export default function Sidebar() {
    const aside = createElement('aside', {
        classList: ['sidebar'],
        attributes: {
            role: 'complementary',
            'aria-label': 'Informações e estatísticas do Vasco da Gama'
        }
    });

// Seção classificação
const { section: classifSection, content: tabelaBR } = createSection(
    'classificacao',
    'Classificação Brasileirão',
    '' // Removido o texto de carregamento
);
aside.append(classifSection);
carregarClassificacao(tabelaBR);

// Seção último jogo (com widget SofaScore)
const { section: ultimoJogoSection, content: ultimoJogoContent } = createSection(
    'ultimo-jogo',
    'Último Jogo',
    '' // Removido o texto de carregamento
);
ultimoJogoContent.append(carregarUltimoJogo());
aside.append(ultimoJogoSection);

return aside;

}
