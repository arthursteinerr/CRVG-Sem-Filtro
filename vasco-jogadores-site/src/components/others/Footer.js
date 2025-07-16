/**
 * Utilitário para criar elementos DOM com classes e atributos.
 */
function createElement(tag, { classList = [], attributes = {}, textContent = '' } = {}) {
    const el = document.createElement(tag);
    if (classList.length) el.classList.add(...classList);
    Object.entries(attributes).forEach(([attr, val]) => el.setAttribute(attr, val));
    if (textContent) el.textContent = textContent;
    return el;
}

/**
 * Componente de rodapé do site.
 */
export default function Footer() {
    const footer = createElement('footer', {
        classList: ['footer'],
        attributes: { role: 'contentinfo' }
    });

    const creditText = '\u00a9 2025 Vasco da Gama — Dados via SofaScore e API Futebol — Feito por Arthur';

    const paragraph = createElement('p', {
        textContent: creditText
    });

    footer.appendChild(paragraph);
    return footer;
}
