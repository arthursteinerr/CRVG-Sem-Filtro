import Header from './components/Others/Header.js';
import Footer from './components/Others/Footer.js';
import Sidebar from './components/Home/Sidebar.js';
import PlayerSection from './components/Home/PlayerSection.js';
import NewsSection from './components/news/NewsSection.js';
import CuriositiesSection from './components/curiosities/CuriositiesSection.js';

// Função utilitária para rolar suavemente ao topo
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Função para aplicar o foco em um elemento
function setFocus(selector, delay = 100) {
    setTimeout(() => {
        const element = document.querySelector(selector);
        if (element) element.focus();
    }, delay);
}

// Função principal do App
export default function App() {
    const container = document.createElement('div');
    container.className = 'app-container';

    let currentSection = 'elenco';
    const main = document.createElement('main');
    main.className = 'main-content';

    // Função para renderizar cada seção
    function renderSection(section) {
        main.innerHTML = ''; // Limpa o conteúdo anterior
        switch (section) {
            case 'elenco':
                main.appendChild(PlayerSection());
                main.appendChild(Sidebar());
                setFocus('#busca-jogador');
                break;
            case 'noticias':
                main.appendChild(NewsSection());
                setFocus('.news-card', 200);
                break;
            case 'curiosidades':
                main.appendChild(CuriositiesSection());
                setFocus('.curiosities-section', 200);
                break;
            default:
                main.textContent = 'Seção não encontrada.';
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Header com navegação SPA
    const header = Header({
        onNavigate: (section) => {
            if (section !== currentSection) {
                currentSection = section;
                renderSection(section);
                history.pushState({ section }, section, `#${section}`); // Alterando a URL sem recarregar
            }
        }
    });

    container.appendChild(header);
    renderSection(currentSection);
    container.appendChild(main);
    container.appendChild(Footer());

    // Botão flutuante para voltar ao topo
    const btnTopo = document.createElement('button');
    btnTopo.id = 'btn-topo';
    btnTopo.title = 'Voltar ao topo';
    btnTopo.setAttribute('aria-label', 'Voltar ao topo');
    btnTopo.innerHTML = '↑';
    btnTopo.tabIndex = 0;
    btnTopo.onclick = scrollToTop;
    btnTopo.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
        }
    };

    // Mostra o botão de voltar ao topo quando a rolagem for maior que 200px
    window.addEventListener('scroll', () => {
        btnTopo.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    
    container.appendChild(btnTopo);

    // Acessibilidade: Foco inicial no header
    setTimeout(() => {
        const nav = container.querySelector('header nav');
        if (nav) nav.setAttribute('tabindex', '-1');
    }, 200);

    // Manipulando a navegação via histórico (back / forward no browser)
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.section !== currentSection) {
            currentSection = event.state.section;
            renderSection(currentSection);
        }
    });

    return container;
}
