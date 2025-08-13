// public/js/modules/navigation.js

import { auth } from './firebase.js';

// --- VARIÁVEIS DO DOM: GERAIS E DE NAVEGAÇÃO ---
const btnMenuPerfil = document.getElementById('btn-menu-perfil');
const perfilMenu = document.getElementById('perfil-menu');
const headerTitle = document.getElementById('header-title');
const bottomNavLinks = document.querySelectorAll('.bottom-nav .nav-link');

// --- LÓGICA DE NAVEGAÇÃO ENTRE PÁGINAS ---
export const setupNavigationListeners = () => {
    btnMenuPerfil.addEventListener('click', () => {
        perfilMenu.classList.toggle('hidden');
    });

    headerTitle.addEventListener('click', (e) => {
        e.preventDefault();
        window.showPage('dashboard');
    });

    bottomNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.currentTarget.dataset.page;
            window.showPage(pageId);
        });
    });

    window.addEventListener('popstate', (e) => {
        const pageId = window.location.hash.substring(1) || 'dashboard';
        window.showPage(pageId, false);
    });
};