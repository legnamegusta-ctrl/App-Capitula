// public/js/modules/auth.js

import { auth, db } from './firebase.js';

// --- VARIÁVEIS DO NOVO MODAL DE REGISTRO ---
let modalRegistrarUsuario;
let btnFinalizarRegistro;
let btnFecharRegistroUsuario;
let registroNomeInput;
let registroSobrenomeInput;
let registroEmailInput;
let registroSenhaInput;

// Importa as funções que precisam ser chamadas depois do login
const showPage = (pageId, updateUrl) => {
    const allPages = document.querySelectorAll('#app-container > .catalogo-container');
    allPages.forEach(page => page.classList.add('hidden'));

    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    } else {
        document.getElementById('page-dashboard').classList.remove('hidden');
        pageId = 'dashboard';
    }

    const allLinks = document.querySelectorAll('.nav-link');
    allLinks.forEach(link => link.classList.remove('active'));
    const currentLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }

    if (updateUrl) {
        history.pushState(null, '', `#${pageId}`);
    }

    // Chama a função de carregamento da página correspondente
    if (auth.currentUser) {
        if (pageId === 'dashboard') {
            window.carregarDashboard(auth.currentUser.uid);
        } else if (pageId === 'acervo') {
            window.carregarLivros(auth.currentUser.uid);
        } else if (pageId === 'registros') {
            window.carregarRegistros(auth.currentUser.uid);
        } else if (pageId === 'metas') {
            window.carregarMetas(auth.currentUser.uid);
        }
    }
};

window.showPage = showPage;

// --- FUNÇÕES DE AUTENTICAÇÃO ---
export const handleAuthStateChanged = (user) => {
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const userEmailSpan = document.getElementById('user-email');

    if (!modalRegistrarUsuario) {
        modalRegistrarUsuario = document.getElementById('modal-registrar-usuario');
    }

    if (modalRegistrarUsuario) {
        modalRegistrarUsuario.classList.add('hidden');
    }

    if (!authContainer || !appContainer || !userEmailSpan) {
        console.error("Erro: Elementos principais da interface não encontrados.");
        return;
    }

    if (user) {
        console.log("Usuário logado:", user.email);
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        userEmailSpan.textContent = user.email;
    } else {
        console.log("Nenhum usuário logado.");
        authContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');
    }
};

const loginUser = (email, senha) => {
    auth.signInWithEmailAndPassword(email, senha)
        .catch(error => alert("Erro ao entrar: " + error.message));
};

const abrirModalRegistrar = () => {
    if (modalRegistrarUsuario) {
        modalRegistrarUsuario.classList.remove('hidden');
        registroNomeInput.value = '';
        registroSobrenomeInput.value = '';
        registroEmailInput.value = '';
        registroSenhaInput.value = '';
    }
};

const registrarNovoUsuario = (nome, sobrenome, email, senha) => {
    auth.createUserWithEmailAndPassword(email, senha)
        .then(userCredential => {
            const user = userCredential.user;
            user.updateProfile({
                displayName: `${nome} ${sobrenome}`
            }).then(() => {
                db.collection('usuarios').doc(user.uid).set({
                    nome,
                    sobrenome,
                    email
                }).then(() => {
                    alert("Usuário registrado com sucesso!");
                    if (modalRegistrarUsuario) {
                        modalRegistrarUsuario.classList.add('hidden');
                    }
                });
            });
        })
        .catch(error => alert("Erro ao registrar: " + error.message));
};

const logoutUser = () => {
    auth.signOut();
};

export const setupAuthListeners = () => {
    // Captura elementos após o carregamento do DOM
    modalRegistrarUsuario = document.getElementById('modal-registrar-usuario');
    btnFinalizarRegistro = document.getElementById('btn-finalizar-registro');
    btnFecharRegistroUsuario = document.getElementById('btn-fechar-registro-usuario');
    registroNomeInput = document.getElementById('registro-nome');
    registroSobrenomeInput = document.getElementById('registro-sobrenome');
    registroEmailInput = document.getElementById('registro-email');
    registroSenhaInput = document.getElementById('registro-senha');

    const btnLogin = document.getElementById('btn-login');
    const btnRegistrar = document.getElementById('btn-registrar');
    const btnSair = document.getElementById('btn-sair');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');

    if (btnLogin && emailInput && senhaInput) {
        btnLogin.addEventListener('click', () => {
            loginUser(emailInput.value, senhaInput.value);
        });
    }

    if (btnRegistrar) {
        btnRegistrar.addEventListener('click', abrirModalRegistrar);
    }

    if (btnFinalizarRegistro && registroNomeInput && registroSobrenomeInput && registroEmailInput && registroSenhaInput) {
        btnFinalizarRegistro.addEventListener('click', () => {
            const nome = registroNomeInput.value;
            const sobrenome = registroSobrenomeInput.value;
            const email = registroEmailInput.value;
            const senha = registroSenhaInput.value;

            if (!nome || !sobrenome || !email || !senha) {
                alert("Todos os campos são obrigatórios!");
                return;
            }

            registrarNovoUsuario(nome, sobrenome, email, senha);
        });
    }

    if (btnFecharRegistroUsuario) {
        btnFecharRegistroUsuario.addEventListener('click', () => {
            if (modalRegistrarUsuario) {
                 modalRegistrarUsuario.classList.add('hidden');
            }
        });
    }

    if (btnSair) {
        btnSair.addEventListener('click', logoutUser);
    }
};
