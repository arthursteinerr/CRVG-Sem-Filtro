/**
 * Utilitário para criar elementos DOM com classes e atributos.
 */
function createElement(tag, { classList = [], attributes = {}, textContent = '' } = {}) {
    const el = document.createElement(tag);
    if (classList.length) el.classList.add(...classList);
    Object.entries(attributes).forEach(([attr, value]) => el.setAttribute(attr, value));
    if (textContent) el.textContent = textContent;
    return el;
}

/**
 * Componente de cabeçalho e navegação do Vasco.
 */
export default function Header({ onNavigate }) {
    const header = createElement('header');
    const nav = createElement('nav');

    // Logo
    const logoLink = createElement('a', {
        classList: ['logo-link'],
        attributes: {
            href: '#',
            'aria-label': 'Página inicial do Vasco'
        }
    });

    const logoImg = createElement('img', {
        classList: ['logo'],
        attributes: {
            src: 'https://2.bp.blogspot.com/-V2wctvIJPPM/VuWlKz6IGDI/AAAAAAAAG88/mwNGulXIbswla5v9RuMDtnRP9coHUYaWA/s1600/escudo_vasco.png',
            alt: 'Vasco'
        }
    });

    const logoText = createElement('span', { textContent: 'CRVG Sem Filtro' });
    logoLink.append(logoImg, logoText);

    // Menu de navegação
    const menu = createElement('ul', { classList: ['nav-menu'] });

    const sections = [
        { section: 'elenco', label: 'Elenco' },
        { section: 'noticias', label: 'Notícias' },
        { section: 'curiosidades', label: 'Curiosidades' },
    ];

    const links = [];

    sections.forEach((item, index) => {
        const li = document.createElement('li');
        const a = createElement('a', {
            attributes: {
                href: `#${item.section}`,
                'data-section': item.section,
                tabindex: '0'
            },
            textContent: item.label
        });

        if (index === 0) a.classList.add('active');
        li.appendChild(a);
        menu.appendChild(li);
        links.push(a);
    });

    // Navegação SPA e acessibilidade
    links.forEach(link => {
        const sectionName = link.dataset.section;

        link.addEventListener('click', e => {
            e.preventDefault();
            setActive(link);
            onNavigate(sectionName);
        });

        link.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });

        link.addEventListener('focus', () => link.classList.add('focus-visible'));
        link.addEventListener('blur', () => link.classList.remove('focus-visible'));
    });

    // Logo = voltar ao topo e ativar menu inicial
    logoLink.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const firstLink = links[0];
        setActive(firstLink);
        onNavigate(firstLink.dataset.section);
        firstLink.focus();
    });

    function setActive(selectedLink) {
        links.forEach(l => l.classList.remove('active'));
        selectedLink.classList.add('active');
    }

    nav.append(logoLink, menu);
    header.appendChild(nav);
    return header;
}
