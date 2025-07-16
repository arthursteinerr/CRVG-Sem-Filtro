const NewsAPI = require('newsapi');
const fs = require('fs');
const newsapi = new NewsAPI('6a19118961724132a0b9a333ee20f684');

// Utilitário para formatar datas de forma elegante
function formatarData(dataISO) {
    const data = new Date(dataISO);
    const opcoesData = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const opcoesHora = { hour: '2-digit', minute: '2-digit' };
    
    const dataFormatada = data.toLocaleDateString('pt-BR', opcoesData);
    const horaFormatada = data.toLocaleTimeString('pt-BR', opcoesHora);
    
    return `${dataFormatada}, às ${horaFormatada}`;
}

// Exibe uma notícia formatada no console
function exibirNoticia(noticia, idx) {
    console.log(`\n${idx + 1}. ${noticia.title}`);
    if (noticia.urlToImage) {
        console.log(`Imagem: ${noticia.urlToImage}`);
    }
    console.log(`Fonte: ${noticia.source?.name || 'Desconhecida'}`);
    console.log(`Publicado em: ${formatarData(noticia.publishedAt)}`);
    if (noticia.description) {
        console.log(`Resumo: ${noticia.description}`);
    }
    console.log(`Link: ${noticia.url}\n`);
}

// Salva as notícias em um arquivo JSON local
function salvarNoticiasEmArquivo(noticias, caminho = 'noticias_vasco.json') {
    try {
        fs.writeFileSync(caminho, JSON.stringify(noticias, null, 2), 'utf-8');
        console.log(`\nAs notícias foram salvas em: ${caminho}\n`);
    } catch (erro) {
        console.error('Erro ao salvar as notícias:', erro.message);
    }
}

// Função principal para buscar e exibir notícias do Vasco da Gama
async function buscarNoticiasVasco({ salvarEmArquivo = false, maxNoticias = 10 } = {}) {
    try {
        console.log('Buscando notícias do Vasco da Gama... Aguarde.');
        const response = await newsapi.v2.everything({
            q: '"Vasco da Gama"',
            language: 'pt',
            sortBy: 'publishedAt',
            pageSize: maxNoticias
        });

        const noticias = response.articles;
        if (!noticias || noticias.length === 0) {
            console.log('Nenhuma notícia encontrada sobre o Vasco.');
            return;
        }

        console.log(`\nNotícias Atualizadas do Vasco da Gama (total: ${noticias.length}):\n`);
        noticias.forEach(exibirNoticia);

        // Se for para salvar as notícias em arquivo, faz isso
        if (salvarEmArquivo) {
            salvarNoticiasEmArquivo(noticias);
        }
    } catch (erro) {
        // Tratamento de erros com mais detalhes
        if (erro.response && erro.response.status === 429) {
            console.error('Limite de requisições atingido. Tente novamente mais tarde.');
        } else if (erro.code === 'ENOTFOUND') {
            console.error('Sem conexão com a internet. Verifique sua rede.');
        } else {
            console.error('Erro ao buscar notícias do Vasco:', erro.message);
        }
    }
}

// Chamada principal: busca e salva as notícias em arquivo local
buscarNoticiasVasco({ salvarEmArquivo: true, maxNoticias: 10 });
