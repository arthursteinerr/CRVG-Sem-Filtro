export default function CuriositiesSection() {
    /**
     * Função utilitária para criar elementos HTML.
     */
    const createElement = (tag, props = {}, ...children) => {
        const element = document.createElement(tag);
        Object.entries(props).forEach(([key, value]) => {
            if (key === "className") element.className = value;
            else if (key === "style") Object.assign(element.style, value);
            else element.setAttribute(key, value);
        });
        children.forEach(child => {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else if (child) {
                element.appendChild(child);
            }
        });
        return element;
    };

    /**
     * Função para criar a lista de curiosidades e fatos importantes.
     */
    const createCuriosityList = () => {
        const curiositiesAndFacts = [
            "O Vasco da Gama foi o primeiro clube brasileiro a lutar contra o racismo no futebol.",
            "São Januário, inaugurado em 1927, é o estádio mais tradicional do Rio de Janeiro e um dos maiores símbolos do clube.",
            "Em 1998, o Vasco conquistou sua primeira e única Copa Libertadores, vencendo o Barcelona de Guayaquil na final.",
            "O clube é famoso por revelar grandes craques como Romário, Edmundo, Juninho Pernambucano e Roberto Dinamite.",
            "O Vasco é um dos poucos clubes brasileiros a ter conquistado a Taça Rio, Taça Guanabara e Campeonato Carioca de forma invicta.",
            "A torcida vascaína, uma das maiores do Brasil, é reconhecida pela paixão incondicional e apoio constante em todos os momentos do clube.",
            "Com uma história de inclusão, o Vasco foi pioneiro ao permitir jogadores negros e de classes populares, muito antes de outros clubes brasileiros.",
            "O clube também tem uma rica história no futebol feminino, conquistando títulos importantes, como o Campeonato Brasileiro de Futebol Feminino de 2016."
        ];

        const list = createElement("ul", { className: "curiosities-list" });
        curiositiesAndFacts.forEach(text => {
            const li = createElement("li", {}, text);
            list.appendChild(li);
        });
        return list;
    };

    /**
     * Função para criar o bloco de curiosidades da Wikipedia.
     */
    const createWikipediaBlock = () => {
        return createElement(
            "div",
            {
                id: "wiki-curiosities",
                className: "wiki-curiosities loading",
                "aria-busy": "true",
                "aria-live": "polite"
            },
            "Carregando curiosidades da Wikipedia..."
        );
    };

    /**
     * Função para buscar o resumo da Wikipedia e atualizar o conteúdo.
     */
    const fetchWikipediaSummary = async (container) => {
        const wikiDiv = container.querySelector("#wiki-curiosities");

        try {
            const response = await fetch(
                "https://pt.wikipedia.org/api/rest_v1/page/summary/Club_de_Regatas_Vasco_da_Gama"
            );

            if (!response.ok) throw new Error("Erro ao buscar dados");

            const data = await response.json();

            // Remover o "loading" e adicionar conteúdo
            wikiDiv.classList.remove("loading");
            wikiDiv.setAttribute("aria-busy", "false");
            wikiDiv.innerHTML = "";  // Limpar o conteúdo de carregamento

            const paragraph = createElement("p", {}, data.extract);
            const link = createElement(
                "a",
                {
                    href: "https://pt.wikipedia.org/wiki/Club_de_Regatas_Vasco_da_Gama",
                    target: "_blank",
                    rel: "noopener noreferrer"
                },
                "Leia mais na Wikipedia"
            );

            wikiDiv.appendChild(paragraph);
            wikiDiv.appendChild(link);
        } catch (error) {
            console.error("Erro ao carregar conteúdo da Wikipedia:", error);
            wikiDiv.classList.remove("loading");
            wikiDiv.setAttribute("aria-busy", "false");
            wikiDiv.innerHTML = "<p>Não foi possível carregar curiosidades extras no momento.</p>";
        }
    };

    /**
     * Função para construir a seção de curiosidades.
     */
    const buildSection = () => {
        const section = createElement(
            "section",
            {
                className: "curiosities-section",
                "aria-label": "Curiosidades e Fatos Históricos sobre o Vasco da Gama"
            }
        );

        const title = createElement("h1", {}, "Curiosidades e Fatos Históricos do Vasco");
        const introText = createElement(
            "p",
            { className: "curiosities-intro" },
            "Descubra alguns dos momentos mais marcantes da história do nosso querido Vasco da Gama!"
        );

        const staticList = createCuriosityList();
        const wikiBlock = createWikipediaBlock();

        section.append(title, introText, staticList, wikiBlock);
        return section;
    };

    // Monta a seção e busca as curiosidades da Wikipedia
    const sectionElement = buildSection();
    fetchWikipediaSummary(sectionElement);

    return sectionElement;
}
