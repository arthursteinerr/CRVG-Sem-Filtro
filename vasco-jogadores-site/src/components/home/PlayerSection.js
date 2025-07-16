// Componente principal da seção de elenco do Vasco

import PlayerCard from './PlayerCard.js';
import { jogadores as jogadoresLocal } from '../../data/jogadores.js';

export default function PlayerSection() {
    const section = document.createElement('section');
    section.className = 'elenco-section';
    section.innerHTML = `
        <div class="elenco-header">
            <h1>Elenco 2025</h1>
            <input type="text" id="busca-jogador" placeholder="Buscar jogador..." aria-label="Buscar jogador" autocomplete="off">
        </div>
        <div id="jogadores-lista" class="jogadores-lista" aria-live="polite"></div>
        <div id="loading" class="loading" style="display:none;" aria-busy="false">Carregando informações...</div>
        <div id="widget-jogador" tabindex="-1" aria-live="polite"></div>
    `;

    const input = section.querySelector('#busca-jogador');
    const lista = section.querySelector('#jogadores-lista');
    let jogadores = [];
    let filtro = '';
    let selecionado = null;
    let jogadorAtualWidget = null;

    // Remove acentos e normaliza para busca
    function normalizar(str) {
        return str.normalize('NFD').replace(/[\u0000-\u001f\u007f-\uFFFF]/g, '').toLowerCase();
    }

    // Busca jogadores da API ou local
    async function carregarJogadores() {
        const loading = section.querySelector('#loading');
        loading.style.display = 'flex';
        loading.setAttribute('aria-busy', 'true');
        try {
            const res = await fetch('http://localhost:3000/api/jogadores');
            if (!res.ok) throw new Error();
            jogadores = await res.json();
        } catch {
            jogadores = jogadoresLocal;
        }
        render();
        loading.style.display = 'none';
        loading.setAttribute('aria-busy', 'false');
    }

    // Renderiza cards filtrados
    function render() {
        lista.innerHTML = '';
        let encontrados = 0;
        jogadores.forEach(jogador => {
            if (normalizar(jogador.nome).includes(normalizar(filtro))) {
                const card = PlayerCard(jogador, () => handleCardClick(jogador, card));
                card.onkeydown = handleCardKeydown;
                lista.appendChild(card);
                encontrados++;
            }
        });
        if (!encontrados) {
            lista.innerHTML = '<div style="padding:30px;color:#888;">Nenhum jogador encontrado.</div>';
        }
        if (selecionado) selecionado.classList.remove('selecionado');
        selecionado = null;
        jogadorAtualWidget = null;
        section.querySelector('#widget-jogador').innerHTML = '<div style="color:#aaa;padding:18px;">Selecione um jogador para ver estatísticas.</div>';
    }

    // Seleção de jogador
    function handleCardClick(jogador, card) {
        if (jogadorAtualWidget === jogador.id) return;
        mostrarWidgetJogador(jogador);
        if (selecionado) selecionado.classList.remove('selecionado');
        card.classList.add('selecionado');
        selecionado = card;
    }

    // Teclado acessível
    function handleCardKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.target.click();
        }
    }

    // Mostra widget do jogador
    function mostrarWidgetJogador(jogador) {
        const loading = section.querySelector('#loading');
        loading.style.display = 'flex';
        loading.setAttribute('aria-busy', 'true');
        jogadorAtualWidget = jogador.id;
        setTimeout(() => {
            const container = section.querySelector('#widget-jogador');
            container.innerHTML = `
                <h3 id="h3-jogador" tabindex="-1">${jogador.nome} - ${jogador.posicao}</h3>
                <iframe
                    src="https://widgets.sofascore.com/pt-BR/embed/player/${jogador.id}?widgetTheme=light"
                    width="100%"
                    height="600"
                    frameborder="0"
                    scrolling="no"
                    loading="lazy"
                    aria-label="Estatísticas de ${jogador.nome}">
                </iframe>
            `;
            container.style.animation = 'fadeInWidget 0.7s';
            loading.style.display = 'none';
            loading.setAttribute('aria-busy', 'false');
            const h3 = container.querySelector('#h3-jogador');
            if (h3) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const h3Rect = h3.getBoundingClientRect();
                const absoluteY = window.scrollY + h3Rect.top;
                window.scrollTo({
                    top: absoluteY - headerHeight - 16,
                    behavior: 'smooth'
                });
                setTimeout(() => container.focus(), 100);
            }
        }, 350);
    }

    // Debounce para busca
    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // Busca com debounce
    input.addEventListener('input', debounce(e => {
        filtro = e.target.value;
        render();
    }, 180));

    // Foco inicial
    setTimeout(() => input.focus(), 80);

    // Inicializa
    carregarJogadores();

    return section;
}
