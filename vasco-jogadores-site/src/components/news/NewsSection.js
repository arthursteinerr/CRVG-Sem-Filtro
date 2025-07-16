const NEWS_API_KEY = '6a19118961724132a0b9a333ee20f684';
const API_ENDPOINT = 'https://newsapi.org/v2/everything';
const FALLBACK_IMAGE = 'https://2.bp.blogspot.com/-V2wctvIJPPM/VuWlKz6IGDI/AAAAAAAAG88/mwNGulXIbswla5v9RuMDtnRP9coHUYaWA/s1600/escudo_vasco.png';
const QUERY = '"Vasco da Gama"';

/**
 * Cria um elemento DOM com classes e atributos opcionais.
 */
function createElement(tag, options = {}) {
    const el = document.createElement(tag);
    if (options.classList) el.classList.add(...options.classList);
    if (options.attributes) {
        for (const [attr, value] of Object.entries(options.attributes)) {
            el.setAttribute(attr, value);
        }
    }
    if (options.textContent) el.textContent = options.textContent;
    return el;
}

/**
 * Cria um card de notícia.
 */
function createNewsCard(article) {
    const {
        title = '',
        description = '',
        url,
        urlToImage,
        publishedAt,
        source = {}
    } = article;

    const card = createElement('article', {
        classList: ['news-card'],
        attributes: { tabindex: '0' }
    });

    const link = createElement('a', {
        attributes: {
            href: url,
            target: '_blank',
            rel: 'noopener noreferrer',
            'aria-label': `Abrir notícia: ${title}`
        }
    });

    const img = new Image();
    img.src = urlToImage || FALLBACK_IMAGE;
    img.alt = title || 'Notícia do Vasco';
    img.loading = 'lazy';
    img.onerror = () => (img.src = FALLBACK_IMAGE);

    const content = createElement('div', { classList: ['news-content'] });

    const heading = createElement('h2', { textContent: title });
    const desc = createElement('p', { textContent: description });

    const footer = createElement('div', {
        attributes: { style: 'display:flex;justify-content:space-between;align-items:center;' }
    });

    const date = createElement('span', { classList: ['news-date'] });
    if (publishedAt) {
        date.textContent = new Date(publishedAt).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    }

    const sourceName = source.name ? createElement('span', {
        classList: ['news-source'],
        textContent: source.name
    }) : null;

    footer.append(date);
    if (sourceName) footer.append(sourceName);
    content.append(heading, desc, footer);
    link.append(img, content);
    card.appendChild(link);

    return card;
}

/**
 * Carrega notícias da API e atualiza o DOM.
 */
async function fetchNews(container) {
    const url = `${API_ENDPOINT}?q=${encodeURIComponent(QUERY)}&language=pt&sortBy=publishedAt&pageSize=8`;

    try {
        const res = await fetch(url, {
            headers: { 'X-Api-Key': NEWS_API_KEY }
        });

        if (!res.ok) throw new Error('Erro na requisição');

        const { articles = [] } = await res.json();

        container.innerHTML = ''; // limpa "carregando"

        if (!articles.length) {
            container.appendChild(createElement('p', { textContent: 'Nenhuma notícia encontrada.' }));
            return;
        }

        articles.forEach(article => {
            const card = createNewsCard(article);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        container.innerHTML = '';
        container.appendChild(createElement('p', {
            textContent: 'Erro ao carregar notícias. Verifique sua conexão ou tente novamente mais tarde.'
        }));
    }
}

/**
 * Componente principal: seção de notícias do Vasco.
 */
export default function NewsSection() {
    const section = createElement('section', {
        classList: ['news-section'],
        attributes: { 'aria-label': 'Notícias do Vasco' }
    });

    const title = createElement('h1', { textContent: 'Notícias do Vasco' });

    const newsList = createElement('div', {
        classList: ['news-list'],
        attributes: {
            id: 'news-list',
            'aria-live': 'polite'
        }
    });

    const loading = createElement('div', {
        classList: ['loading'],
        attributes: { 'aria-busy': 'true' },
        textContent: 'Carregando notícias...'
    });

    newsList.appendChild(loading);
    section.append(title, newsList);

    fetchNews(newsList);

    return section;
}
