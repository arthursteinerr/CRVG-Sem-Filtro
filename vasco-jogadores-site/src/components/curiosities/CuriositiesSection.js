export default function CuriositiesSection() {
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

    const createCuriosityList = () => {
        const curiosities = [
            "O Vasco foi o primeiro clube a lutar contra o racismo no futebol brasileiro.",
            "O estádio de São Januário foi construído com recursos da própria torcida.",
            "O clube já revelou grandes craques como Romário, Edmundo e Juninho Pernambucano.",
            "O Vasco foi campeão da Libertadores em 1998.",
            "O mascote oficial é o Almirante.",
        ];

        const list = createElement("ul", { className: "curiosities-list" });
        curiosities.forEach(text => {
            const li = createElement("li", {}, text);
            list.appendChild(li);
        });

        return list;
    };

    const createEstatisticasSection = () => {
        const estatItems = [
            { label: "Ano de Fundação", value: "1898" },
            { label: "Estádio", value: "São Januário" },
            { label: "Mascote", value: "Almirante" },
            { label: "Torcida", value: "6ª maior do Brasil" }
        ];

        const grid = createElement("div", { className: "estatisticas-grid" });

        estatItems.forEach(item => {
            const bloco = createElement("div", { className: "estat-bloco" },
                createElement("span", { className: "estat-label" }, item.label),
                createElement("span", { className: "estat-value" }, item.value)
            );
            grid.appendChild(bloco);
        });

        return createElement(
            "section",
            {
                id: "estatisticas",
                className: "estatisticas-section",
                "aria-label": "Informações históricas do Vasco"
            },
            createElement("h2", {}, "Dados Históricos do Vasco"),
            grid
        );
    };

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

    const fetchWikipediaSummary = async (container) => {
        const wikiDiv = container.querySelector("#wiki-curiosities");

        try {
            const response = await fetch(
                "https://pt.wikipedia.org/api/rest_v1/page/summary/Club_de_Regatas_Vasco_da_Gama"
            );

            if (!response.ok) throw new Error("Erro ao buscar dados");

            const data = await response.json();

            wikiDiv.classList.remove("loading");
            wikiDiv.setAttribute("aria-busy", "false");
            wikiDiv.innerHTML = "";

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

    const buildSection = () => {
        const section = createElement(
            "section",
            {
                className: "curiosities-section",
                "aria-label": "Curiosidades sobre o Vasco da Gama"
            }
        );

        const title = createElement("h1", {}, "Curiosidades do Vasco");
        const introText = createElement(
            "p",
            { className: "curiosities-intro" }
        );

        const staticList = createCuriosityList();
        const estatSection = createEstatisticasSection();
        const wikiBlock = createWikipediaBlock();

        section.append(title, introText, staticList, estatSection, wikiBlock);
        return section;
    };

    const sectionElement = buildSection();
    fetchWikipediaSummary(sectionElement);

    return sectionElement;
}
