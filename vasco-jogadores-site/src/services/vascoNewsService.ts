const NEWS_API_KEY = '6a19118961724132a0b9a333ee20f684';

// Tipo para os artigos retornados pela API
interface NewsArticle {
    title: string;
    url: string;
    publishedAt: string;
    source: string;
    urlToImage: string;
}

export async function getVascoNews(): Promise<NewsArticle[]> {
    try {
        const url = `https://newsapi.org/v2/everything?q=Vasco%20da%20Gama&language=pt&sortBy=publishedAt&pageSize=8`;

        // Fazendo a requisição para a NewsAPI
        const res = await fetch(url, {
            headers: { 'X-Api-Key': NEWS_API_KEY }
        });

        // Verificando se a resposta foi bem sucedida
        if (!res.ok) {
            throw new Error(`Erro ao buscar notícias: ${res.statusText}`);
        }

        // Parseando o JSON da resposta
        const data = await res.json();

        // Verificando se a API retornou artigos
        if (!data.articles || !Array.isArray(data.articles)) {
            throw new Error('Formato de dados inválido: artigos não encontrados');
        }

        // Mapeando os artigos e retornando as informações necessárias
        return data.articles.map((article: any) => ({
            title: article.title,
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source?.name || 'Fonte desconhecida',
            urlToImage: article.urlToImage || 'https://via.placeholder.com/150'
        }));
    } catch (error) {
        // Logando o erro no console
        console.error('Erro ao buscar notícias do Vasco:', error);
        return [];
    }
}
