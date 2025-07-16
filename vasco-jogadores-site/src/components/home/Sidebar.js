// src/components/Sidebar.js

import {
    fetchSportmonksLastMatches,
    fetchStandings, // Se for necessário usar no futuro
    formatSportmonksScore
} from '../../services/apiFutebolService.js';

// --- Constantes Globais para Manutenção ---
const VASCO_ID = 696; // ID do Vasco da Gama na API Sportmonks
const SOFASCORE_BASE_WIDGET_URL = 'https://widgets.sofascore.com/pt-BR/embed/';

/**
 * Função para criar um elemento HTML de forma reutilizável.
 * @param {string} tag - Nome da tag HTML
 * @param {Object} options - Atributos e conteúdo do elemento
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
 * Função para criar uma seção do Sidebar com título e conteúdo.
 * @param {string} id - Id da seção
 * @param {string} title - Título da seção
 * @param {string} liveText - Texto exibido enquanto carrega
 */
function createSection(id, title, liveText = 'Carregando...', live = true) {
    const section = createElement('section', { attributes: { id } });
    const heading = createElement('h2', { textContent: title });
    const content = createElement('div', {
        classList: ['estatisticas-box'],
        attributes: live ? { 'aria-live': 'polite', 'aria-busy': 'true' } : {},
        html: `<div class="loading">${liveText}</div>`
    });

    section.append(heading, content);
    return { section, content };
}

/**
 * Função para criar um card exibindo informações de uma partida (último jogo).
 * @param {Object} fixture - Detalhes da partida
 * @param {boolean} isNext - Indica se a partida é a próxima ou não
 */
function createMatchCard(fixture, isNext = true) {
    const opponent = fixture.participants?.find(p => p.id !== VASCO_ID);
    const opponentImg = opponent?.image_path || '';
    const opponentName = opponent?.name || 'Adversário Desconhecido';

    const container = createElement('div', {
        attributes: {
            style: 'display: flex; align-items: center; gap: 12px; margin-bottom: 6px;'
        }
    });

    if (opponentImg) {
        const img = createElement('img', {
            attributes: {
                src: opponentImg,
                alt: `Escudo do ${opponentName}`,
                style: 'width: 34px; height: 34px; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.1);'
            }
        });
        container.appendChild(img);
    }

    const nameSpan = createElement('span', {
        classList: ['estat-label'],
        attributes: { style: 'font-size: 1.05em;' },
        textContent: opponentName
    });

    const detailsText = isNext
        ? new Date(fixture.starting_at.replace(' ', 'T') + 'Z').toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
        : formatSportmonksScore(fixture);

    const dataSpan = createElement('span', {
        classList: ['estat-value'],
        attributes: { style: 'font-size: 0.95em; margin-left: auto;' },
        textContent: detailsText
    });

    container.append(nameSpan, dataSpan);
    return container;
}

/**
 * Componente Sidebar que será exportado.
 */
export default function Sidebar() {
    const aside = createElement('aside', {
        classList: ['sidebar'],
        attributes: {
            role: 'complementary',
            'aria-label': 'Informações e estatísticas do Vasco da Gama'
        }
    });

    // Seções dinâmicas
    const { section: classifSection, content: tabelaBR } = createSection('classificacao', 'Classificação Brasileirão', 'Carregando tabela do Brasileirão...');
    const { section: ultimosJogosSection, content: ultimasLista } = createSection('ultimas-partidas', 'Últimos Jogos', 'Buscando últimos resultados...');

    aside.append(classifSection, ultimosJogosSection); // A classificação vem antes dos últimos jogos

    // Função para carregar a tabela de classificação
    async function carregarClassificacao() {
        tabelaBR.innerHTML = `<div class="loading">Carregando tabela do Brasileirão...</div>`;
        tabelaBR.setAttribute('aria-busy', 'true');
        try {
            const tournamentId = 83; // ID do Brasileirão Série A
            const seasonId = 72034; // Temporada de 2025

            tabelaBR.innerHTML = '';

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

            tabelaBR.append(iframe, credit);

        } catch (e) {
            console.error('Erro ao carregar classificação:', e);
            tabelaBR.textContent = 'Erro ao carregar a classificação (iframe).';
        } finally {
            tabelaBR.removeAttribute('aria-busy');
        }
    }

    // Função para carregar os últimos jogos
    async function carregarUltimosJogos() {
        ultimasLista.innerHTML = `<div class="loading">Buscando últimos resultados...</div>`;
        ultimasLista.setAttribute('aria-busy', 'true');
        try {
            const fixtures = await fetchSportmonksLastMatches();
            ultimasLista.innerHTML = '';

            if (fixtures && fixtures.length > 0) {
                fixtures.forEach(fix => ultimasLista.appendChild(createMatchCard(fix, false)));
            }

            // Widget Sofascore - Último Jogo
            const sofascoreMatchId = 13955162;
            const iframe = createElement('iframe', {
                attributes: {
                    src: `https://widgets.sofascore.com/pt-BR/embed/attackMomentum?id=${sofascoreMatchId}&widgetTheme=light`,
                    width: '100%',
                    height: '286',
                    frameborder: '0',
                    scrolling: 'no',
                    title: 'Estatísticas de ataque do último jogo (Sofascore)'
                }
            });

            const credit = createElement('div', {
                attributes: { style: 'font-size:12px;font-family:Arial,sans-serif' },
                html: `<a href="https://www.sofascore.com/pt/football/match/independiente-del-valle-vasco-da-gama/zOsyUp#id:${sofascoreMatchId}" target="_blank" rel="noreferrer">
                        Placar ao Vivo Independiente del Valle - Vasco da Gama
                       </a>`
            });

            ultimasLista.append(iframe, credit);

        } catch (e) {
            console.error('Erro ao carregar últimos jogos:', e);
            ultimasLista.textContent = 'Erro ao carregar últimos jogos.';
        } finally {
            ultimasLista.removeAttribute('aria-busy');
        }
    }

    // Carregar as informações no início
    carregarClassificacao();

    return aside;
}
