// public/js/modules/metas.js

import { db, auth } from './firebase.js';

// --- VARIÁVEIS DO DOM: MODAL DE METAS ---
const btnAdicionarMeta = document.getElementById('btn-adicionar-meta');
const modalAdicionarMeta = document.getElementById('modal-adicionar-meta');
const btnFecharMetaModal = document.getElementById('btn-fechar-meta-modal');
const btnSalvarMeta = document.getElementById('btn-salvar-meta');
const metaTituloInput = document.getElementById('meta-titulo');
const metaTipoSelect = document.getElementById('meta-tipo');
const metaLivrosCamposDiv = document.getElementById('meta-livros-campos');
const metaLivrosQuantidadeInput = document.getElementById('meta-livros-quantidade');
const metaPaginasCamposDiv = document.getElementById('meta-paginas-campos');
const metaPaginasQuantidadeInput = document.getElementById('meta-paginas-quantidade');
const metaPrazoInput = document.getElementById('meta-prazo');
const metasGrid = document.getElementById('metas-grid');


// --- LÓGICA DO MODAL DE ADICIONAR META ---
const abrirModalAdicionarMeta = () => {
    modalAdicionarMeta.classList.remove('hidden');
    metaTituloInput.value = '';
    metaTipoSelect.value = 'livros';
    metaLivrosQuantidadeInput.value = '';
    metaPaginasQuantidadeInput.value = '';
    metaPrazoInput.value = '';
    metaLivrosCamposDiv.classList.remove('hidden');
    metaPaginasCamposDiv.classList.add('hidden');
};

const fecharModalAdicionarMeta = () => {
    modalAdicionarMeta.classList.add('hidden');
};

const salvarMeta = () => {
    const user = auth.currentUser;
    const tipo = metaTipoSelect.value;
    const titulo = metaTituloInput.value.trim();
    const quantidade = tipo === 'livros' ? metaLivrosQuantidadeInput.value : metaPaginasQuantidadeInput.value;

    if (!titulo || !quantidade) {
        alert("Título e quantidade da meta são obrigatórios.");
        return;
    }

    if (user) {
        const novaMeta = {
            uid: user.uid,
            titulo: titulo,
            tipo: tipo,
            quantidade: parseInt(quantidade),
            prazo: metaPrazoInput.value || null
        };

        db.collection('metas').add(novaMeta)
            .then(() => {
                alert("Meta salva com sucesso!");
                fecharModalAdicionarMeta();
                carregarMetas(user.uid);
            })
            .catch(error => {
                alert("Erro ao salvar meta: " + error.message);
                console.error("Erro ao adicionar documento: ", error);
            });
    } else {
        alert("Nenhum usuário logado. Por favor, faça login.");
    }
};

// --- LÓGICA DAS METAS ---
export const carregarMetas = (uid) => {
    db.collection('metas').where('uid', '==', uid).get()
        .then(querySnapshot => {
            metasGrid.innerHTML = '';
            if (querySnapshot.empty) {
                metasGrid.innerHTML = `<p>Nenhuma meta de leitura encontrada. Adicione uma nova!</p>`;
                return;
            }
            querySnapshot.forEach(doc => {
                const meta = doc.data();
                const metaCardHTML = `
                    <div class="livro-card">
                        <h3>${meta.titulo}</h3>
                        <p><strong>Tipo:</strong> ${meta.tipo === 'livros' ? 'Por Livros' : 'Por Páginas'}</p>
                        <p><strong>Quantidade:</strong> ${meta.quantidade}</p>
                        ${meta.prazo ? `<p><strong>Prazo:</strong> ${meta.prazo}</p>` : ''}
                        <p>Progresso: (Em breve)</p>
                    </div>
                `;
                metasGrid.innerHTML += metaCardHTML;
            });
        })
        .catch(error => console.error("Erro ao carregar metas: ", error));
};

// --- EVENTOS DO MODAL DE METAS ---
document.addEventListener('DOMContentLoaded', () => {
    btnAdicionarMeta.addEventListener('click', abrirModalAdicionarMeta);
    btnFecharMetaModal.addEventListener('click', fecharModalAdicionarMeta);
    btnSalvarMeta.addEventListener('click', salvarMeta);
    
    metaTipoSelect.addEventListener('change', () => {
        if (metaTipoSelect.value === 'livros') {
            metaLivrosCamposDiv.classList.remove('hidden');
            metaPaginasCamposDiv.classList.add('hidden');
        } else {
            metaLivrosCamposDiv.classList.add('hidden');
            metaPaginasCamposDiv.classList.remove('hidden');
        }
    });
});