// public/js/modules/acervo.js

import { db, auth } from './firebase.js';
import { renderLivros, handleSearchAndSort } from './utils.js';
import { abrirModalAdicionar } from './modals.js';

// --- VARIÁVEIS DO DOM: ACERVO ---
const btnAdicionarLivro = document.getElementById('btn-adicionar-livro');
const searchInput = document.getElementById('search-input');
const sortBtn = document.getElementById('sort-btn');

// Variáveis de controle
const sortOptions = ['titulo', 'autor', 'editora', 'ano'];
let currentSortIndex = 0;


// --- LÓGICA DO ACERVO ---
export const carregarLivros = (uid) => {
    db.collection('livros').where('uid', '==', uid).get()
        .then(querySnapshot => {
            window.todosLivros = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            handleSearchAndSort(window.todosLivros, searchInput, sortBtn, sortOptions, currentSortIndex, renderLivros);
        })
        .catch(error => console.error("Erro ao carregar acervo: ", error));
};

// --- EVENTOS DO ACERVO ---
document.addEventListener('DOMContentLoaded', () => {
    btnAdicionarLivro.addEventListener('click', () => {
        abrirModalAdicionar();
    });

    searchInput.addEventListener('input', () => {
        handleSearchAndSort(window.todosLivros, searchInput, sortBtn, sortOptions, currentSortIndex, renderLivros);
    });

    sortBtn.addEventListener('click', () => {
        currentSortIndex = (currentSortIndex + 1) % sortOptions.length;
        handleSearchAndSort(window.todosLivros, searchInput, sortBtn, sortOptions, currentSortIndex, renderLivros);
    });
});