// Componente visual para exibir informações resumidas de um jogador do Vasco.
export default function PlayerCard(jogador, onSelect) {
    // Validação de dados essenciais
    if (!jogador.id || !jogador.nome) {
        console.error('ID ou nome do jogador estão ausentes.');
        return;
    }

    // Criação do card principal 
    const card = document.createElement('div');
    card.className = 'jogador-card'; 
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver estatísticas de ${jogador.nome}`);

    // Foto do jogador
    const foto = document.createElement('img');
    foto.className = 'jogador-foto';
    let imagemSrc = '';
    if (jogador.imagem && typeof jogador.imagem === 'string') {
        if (jogador.imagem.startsWith('http')) {
            imagemSrc = jogador.imagem;
        } else if (jogador.imagem.endsWith('.png')) {
            imagemSrc = '../../img/jogadores/' + jogador.imagem;
        } else {
            imagemSrc = '../../img/jogadores/' + jogador.id + '.png';
        }
    } else {
        imagemSrc = '../../img/jogadores/' + jogador.id + '.png';
    }
    foto.src = imagemSrc;
    foto.alt = `Foto de ${jogador.nome}`;
    foto.onerror = () => { foto.src = '../../img/jogadores/default.png'; };

    // Informações principais
    const nome = document.createElement('div');
    nome.className = 'jogador-nome';
    nome.textContent = jogador.nome;

    const idade = document.createElement('div');
    idade.className = 'jogador-idade';
    idade.textContent = jogador.idade ? `Idade: ${jogador.idade}` : 'Idade desconhecida';

    const posicao = document.createElement('div');
    posicao.className = 'jogador-posicao';
    posicao.textContent = jogador.posicao || 'Posição desconhecida';

    const nacionalidade = document.createElement('div');
    nacionalidade.className = 'jogador-nacionalidade';
    nacionalidade.textContent = jogador.nacionalidade || '';

    const id = document.createElement('div');
    id.className = 'jogador-id';
    id.textContent = `ID SofaScore: ${jogador.id}`;

    // Botão de estatísticas
    const btn = document.createElement('button');
    btn.className = 'jogador-btn moderno-btn';
    btn.textContent = 'Ver estatísticas';
    btn.onclick = (e) => {
        e.stopPropagation();
        // Mostra loading global se existir
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'flex';
            loading.setAttribute('aria-busy', 'true');
        }
        onSelect();
    };
    btn.tabIndex = 0;
    btn.style.width = '100%';
    btn.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.onclick(e);
        }
    };

    // Montagem do card
    card.appendChild(foto);
    card.appendChild(nome);
    card.appendChild(idade);
    card.appendChild(posicao);
    card.appendChild(nacionalidade);
    card.appendChild(id);
    card.appendChild(btn);

    // UX
    card.onmouseover = () => card.classList.add('hover');
    card.onmouseleave = () => card.classList.remove('hover');
    card.onfocus = () => card.classList.add('focus-visible');
    card.onblur = () => card.classList.remove('focus-visible');
    // Clique no card aciona o botão
    card.onclick = (e) => {
        if (e.target === btn) return;
        btn.focus();
        btn.click();
    };

    return card;
}
