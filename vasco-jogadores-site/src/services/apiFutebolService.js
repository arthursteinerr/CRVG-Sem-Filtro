// API-Futebol
const API_KEY = import.meta.env?.VITE_API_FUTEBOL_KEY || 'SUA_CHAVE_API_FUTEBOL';
const BASE_URL = 'https://api.api-futebol.com.br/v1';

// Função genérica para fazer chamadas à API
async function fetchAPI(url) {
    try {
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${API_KEY}` }
        });
        if (!res.ok) throw new Error(`Erro na resposta da API: ${res.statusText}`);
        return await res.json();
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        return { error: error.message };
    }
}

// Funções específicas para obter dados da API-Futebol
export async function fetchNextMatches() {
    const url = `${BASE_URL}/times/23/partidas/proximas`;
    return await fetchAPI(url);
}

export async function fetchLastMatches() {
    const url = `${BASE_URL}/times/23/partidas/anteriores`;
    return await fetchAPI(url);
}

export async function fetchStandings() {
    const url = `${BASE_URL}/campeonatos/10/tabela`;
    return await fetchAPI(url);
}

// SportMonks
const SPORTMONKS_API_KEY = import.meta.env?.VITE_SPORTMONKS_API_KEY || 'SUA_CHAVE_SPORTMONKS';
const SPORTMONKS_BASE_URL = 'https://api.sportmonks.com/v3/football';

// Função genérica para fazer chamadas à API SportMonks
async function fetchSportMonksAPI(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erro na resposta da API SportMonks: ${res.statusText}`);
        return await res.json();
    } catch (error) {
        console.error('Erro ao buscar dados da SportMonks:', error);
        return { error: error.message };
    }
}

// Função para obter a programação de jogos da SportMonks
export async function fetchSportmonksSchedules(teamId = 696) {
    const url = `${SPORTMONKS_BASE_URL}/schedules/teams/${teamId}?api_token=${SPORTMONKS_API_KEY}`;
    const data = await fetchSportMonksAPI(url);
    return data ? parseFixtures(data) : [];
}

// Função auxiliar para parsear fixtures da SportMonks
function parseFixtures(data) {
    let fixtures = [];
    for (const stage of data) {
        if (stage.rounds && Array.isArray(stage.rounds)) {
            for (const round of stage.rounds) {
                if (round.fixtures) fixtures.push(...round.fixtures);
            }
        }
        if (stage.fixtures) fixtures.push(...stage.fixtures);
        if (stage.aggregates) {
            for (const agg of stage.aggregates) {
                if (agg.fixtures) fixtures.push(...agg.fixtures);
            }
        }
    }
    // Garantir que não haja duplicados nos fixtures
    const unique = {};
    fixtures.forEach(f => { unique[f.id] = f; });
    return Object.values(unique);
}

// Funções específicas para obter partidas futuras e passadas da SportMonks
export async function fetchSportmonksNextMatches(teamId = 696, limit = 5) {
    const allMatches = await fetchSportmonksSchedules(teamId);
    if (allMatches.error) return allMatches;

    const now = Date.now() / 1000;
    const upcomingMatches = allMatches
        .filter(f => f.starting_at_timestamp > now)
        .sort((a, b) => a.starting_at_timestamp - b.starting_at_timestamp)
        .slice(0, limit);
    return upcomingMatches;
}

export async function fetchSportmonksLastMatches(teamId = 696, limit = 5) {
    const allMatches = await fetchSportmonksSchedules(teamId);
    if (allMatches.error) return allMatches;

    const now = Date.now() / 1000;
    const pastMatches = allMatches
        .filter(f => f.starting_at_timestamp <= now)
        .sort((a, b) => b.starting_at_timestamp - a.starting_at_timestamp)
        .slice(0, limit);
    return pastMatches;
}

// Função para formatar o placar da SportMonks
export function formatSportmonksScore(fixture, teamId = 696) {
    const home = fixture.participants?.find(p => p.meta?.location === 'home');
    const away = fixture.participants?.find(p => p.meta?.location === 'away');
    
    // Tentando pegar a pontuação atual
    let homeScore = fixture.scores?.find(s => s.description === 'CURRENT' && s.participant_id === home?.id)?.score.goals ?? '';
    let awayScore = fixture.scores?.find(s => s.description === 'CURRENT' && s.participant_id === away?.id)?.score.goals ?? '';

    // Caso o placar não esteja disponível, tentamos pegar os placares passados
    if (homeScore === '' || awayScore === '') {
        const scores = fixture.scores ?? [];
        homeScore = scores.filter(s => s.participant_id === home?.id).pop()?.score.goals ?? '';
        awayScore = scores.filter(s => s.participant_id === away?.id).pop()?.score.goals ?? '';
    }

    return `${home?.name ?? '-'} ${homeScore} x ${awayScore} ${away?.name ?? '-'}`;
}
