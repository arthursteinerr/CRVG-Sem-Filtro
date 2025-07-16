import App from './App.js';

// Garantir que o DOM esteja completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o elemento #root existe na página
    const root = document.getElementById('root');
    if (!root) {
        console.error('Elemento #root não encontrado!');
        return;
    }

    // Limpar o conteúdo do root (se necessário)
    root.innerHTML = '';

    // Adicionar o componente App ao root
    try {
        const appElement = App(); // Certifique-se de que App() retorna um nó DOM
        root.appendChild(appElement);
    } catch (error) {
        console.error('Erro ao renderizar o componente App:', error);
    }
});
