// public/js/app.js

// Importa todos os módulos
import { auth } from './modules/firebase.js';
import { handleAuthStateChanged, setupAuthListeners } from './modules/auth.js';
import { setupNavigationListeners } from './modules/navigation.js';
import { carregarColetaneas, carregarLivrosAcervoParaRegistro } from './modules/modals.js';
import { carregarDashboard } from './modules/dashboard.js';
import { carregarLivros } from './modules/acervo.js';
import { carregarRegistros } from './modules/registros.js';
import { carregarMetas } from './modules/metas.js';
import { setupCalculadoraListeners } from './modules/calculadora.js';


// Variáveis globais (se necessário, mas vamos tentar evitar)
window.todosLivros = [];
window.todosRegistros = [];


// Adiciona os event listeners globais
document.addEventListener('DOMContentLoaded', () => {
    setupAuthListeners();
    setupNavigationListeners();
    setupCalculadoraListeners();
});

// Ações a serem executadas quando o estado de autenticação muda
auth.onAuthStateChanged(user => {
    handleAuthStateChanged(user);
    if (user) {
        carregarColetaneas(user.uid);
        carregarLivrosAcervoParaRegistro(user.uid);
        
        // Carrega a página inicial após o login
        const pageId = window.location.hash.substring(1) || 'dashboard';
        window.showPage(pageId, false);
        
    }
});

// Expondo funções globais que precisam ser acessadas de outros módulos ou do HTML
window.carregarLivros = carregarLivros;
window.carregarRegistros = carregarRegistros;
window.carregarDashboard = carregarDashboard;
window.carregarMetas = carregarMetas;