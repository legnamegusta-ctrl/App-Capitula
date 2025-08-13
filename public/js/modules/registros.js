// public/js/modules/registros.js

import { db, auth } from './firebase.js';
import { handleSortRegistros, renderRegistros } from './utils.js';
import { abrirModalAdicionarRegistro } from './modals.js';

// --- VARIÁVEIS DO DOM: REGISTROS ---
const btnAdicionarRegistro = document.getElementById('btn-adicionar-registro');
const sortBtnRegistros = document.getElementById('sort-btn-registros');

// Variáveis de controle
const sortOptionsRegistros = ['titulo', 'autor', 'dataFim'];
let currentSortIndexRegistros = 0;


// --- LÓGICA DO REGISTROS ---
export const carregarRegistros = (uid) => {
    db.collection('registros_leitura').where('uid', '==', uid).get()
        .then(querySnapshot => {
            window.todosRegistros = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            handleSortRegistros(window.todosRegistros, window.todosLivros, sortBtnRegistros, sortOptionsRegistros, currentSortIndexRegistros, renderRegistros);
        })
        .catch(error => console.error("Erro ao carregar registros: ", error));
};

// --- EVENTOS DOS REGISTROS ---
document.addEventListener('DOMContentLoaded', () => {
    btnAdicionarRegistro.addEventListener('click', abrirModalAdicionarRegistro);
    
    sortBtnRegistros.addEventListener('click', () => {
        currentSortIndexRegistros = (currentSortIndexRegistros + 1) % sortOptionsRegistros.length;
        handleSortRegistros(window.todosRegistros, window.todosLivros, sortBtnRegistros, sortOptionsRegistros, currentSortIndexRegistros, renderRegistros);
    });
});