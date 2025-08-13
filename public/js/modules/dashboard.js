// public/js/modules/dashboard.js

import { db } from './firebase.js';

// --- VARIÁVEIS DO DOM: DASHBOARD ---
const totalLivrosSpan = document.getElementById('total-livros');
const totalLeiturasSpan = document.getElementById('total-leituras');
const sequenciaLeituraSpan = document.getElementById('sequencia-leitura');
const metasAlcancadasSpan = document.getElementById('metas-alcancadas');
const livrosDetalhesDiv = document.getElementById('livros-detalhes');
const autoresUnicosSpan = document.getElementById('autores-unicos');
const generosDiferentesSpan = document.getElementById('generos-diferentes');
const totalPaginasSpan = document.getElementById('total-paginas');

// --- LÓGICA DO DASHBOARD ---
export const carregarDashboard = (uid) => {
    Promise.all([
        db.collection('livros').where('uid', '==', uid).get(),
        db.collection('registros_leitura').where('uid', '==', uid).get()
    ]).then(([livrosSnapshot, registrosSnapshot]) => {
        window.todosLivros = livrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        window.todosRegistros = registrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const totalLivros = window.todosLivros.length;
        const totalLeituras = window.todosRegistros.length;

        // Calculo para Livros Catalogados
        totalLivrosSpan.textContent = totalLivros;
        const autoresUnicos = new Set(window.todosLivros.map(l => l.autor).filter(Boolean));
        const generosDiferentes = new Set(window.todosLivros.map(l => l.genero).filter(Boolean));
        const totalPaginas = window.todosLivros.reduce((sum, livro) => sum + (parseInt(livro.paginas) || 0), 0);
        autoresUnicosSpan.textContent = autoresUnicos.size;
        generosDiferentesSpan.textContent = generosDiferentes.size;
        totalPaginasSpan.textContent = totalPaginas;

        // Calculo para Leituras Registradas
        totalLeiturasSpan.textContent = totalLeituras;

        // Placeholder para Sequência de Leitura e Metas
        sequenciaLeituraSpan.textContent = 'Em breve';
        metasAlcancadasSpan.textContent = 'Em breve';

    }).catch(error => {
        console.error("Erro ao carregar dados do dashboard:", error);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.dashboard-card.clickable-card').addEventListener('click', () => {
        livrosDetalhesDiv.classList.toggle('hidden');
    });
});