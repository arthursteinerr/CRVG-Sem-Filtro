// Importando o módulo 'newsapi' para fazer requisições
const NewsAPI = require('newsapi');

// Instanciando o cliente da API com a chave de acesso
const newsapi = new NewsAPI('6a19118961724132a0b9a333ee20f684');

// Constantes para configuração da busca
const QUERY = '"Vasco da Gama"';
const LANGUAGE = 'pt';
const SORT_BY = 'publishedAt';
const PAGE_SIZE = 5;

// Função para formatar a data no padrão pt-BR
function formatarData(date) {
    return new Date(date).toLocaleString('pt-BR');
}

// Função principal para buscar notícias
async function buscarNoticiasVasco() {
    try {
        // Realiza a requisição para buscar as notícias
        const response = await newsapi.v2.everything({
            q: QUERY,
            language: LANGUAGE,
            sortBy: SORT_BY,
            pageSize: PAGE_SIZE
        });

        // Armazena as notícias recebidas
        const noticias = response.articles;

        // Se não houver notícias, exibe uma mensagem
        if (!noticias || noticias.length === 0) {
            console.log('Nenhuma notícia encontrada.');
            return;
        }

        // Exibe as notícias no console
        console.log('Notícias atualizadas do Vasco:\n');
        noticias.forEach((noticia, idx) => {
            console.log(`${idx + 1}. ${noticia.title} (${noticia.source.name})`);
            console.log(`Publicado em: ${formatarData(noticia.publishedAt)}`);
            console.log(`Link: ${noticia.url}\n`);
        });

    } catch (erro) {
        // Exibe erro em caso de falha na requisição
        console.error('Erro ao buscar notícias do Vasco:', erro.message);
    }
}

// Chama a função para buscar as notícias
buscarNoticiasVasco();
