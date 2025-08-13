// public/js/modules/modals.js

import { db, auth } from './firebase.js';

// Variáveis para controle de edição
window.livroSendoEditadoId = null;
window.registroSendoEditadoId = null;
window.metaSendoEditadaId = null;

// --- FUNÇÃO ÚTIL ---
function generateUniqueId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const l1 = letters.charAt(Math.floor(Math.random() * letters.length));
    const l2 = letters.charAt(Math.floor(Math.random() * letters.length));
    const l3 = letters.charAt(Math.floor(Math.random() * letters.length));
    const n = Math.floor(Math.random() * 10);
    return `${l1}${l2}${l3}-${n}`;
}


// --- LÓGICA DO MODAL DE ADICIONAR/EDITAR LIVRO ---
const modalAdicionarLivro = document.getElementById('modal-adicionar-livro');
const modalTitle = document.getElementById('modal-title');
const btnFecharModal = document.getElementById('btn-fechar-modal');
const btnSalvarLivro = document.getElementById('btn-salvar-livro');
const btnDeletarLivro = document.getElementById('btn-deletar-livro');
const tipoObraSelect = document.getElementById('tipo-obra');
const camposParteLivroDiv = document.getElementById('campos-parte-livro');
const livroTituloInput = document.getElementById('livro-titulo');
const livroAutorInput = document.getElementById('livro-autor');
const livroGeneroInput = document.getElementById('livro-genero');
const livroEditoraInput = document.getElementById('livro-editora');
const livroEdicaoInput = document.getElementById('livro-edicao');
const livroAnoInput = document.getElementById('livro-ano');
const livroPaginasInput = document.getElementById('livro-paginas');
const livroOrigemInput = document.getElementById('livro-origem');
const livroLocalInput = document.getElementById('livro-local');
const livroColetaneaSelect = document.getElementById('livro-coletanea');

export const abrirModalAdicionar = () => {
    window.livroSendoEditadoId = null;
    modalTitle.textContent = 'Adicionar Novo Item';
    btnDeletarLivro.classList.add('hidden');
    modalAdicionarLivro.classList.remove('hidden');
    livroTituloInput.value = '';
    livroAutorInput.value = '';
    livroGeneroInput.value = '';
    livroEditoraInput.value = '';
    livroEdicaoInput.value = '';
    livroAnoInput.value = '';
    livroPaginasInput.value = '';
    livroOrigemInput.value = '';
    livroLocalInput.value = '';
    tipoObraSelect.value = 'proprio';
    camposParteLivroDiv.classList.add('hidden');
};

export const editarLivro = (id) => {
    window.livroSendoEditadoId = id;
    const livroParaEditar = window.todosLivros.find(livro => livro.id === id);

    if (livroParaEditar) {
        modalTitle.textContent = 'Editar Item';
        btnDeletarLivro.classList.remove('hidden');
        modalAdicionarLivro.classList.remove('hidden');
        livroTituloInput.value = livroParaEditar.titulo || '';
        livroAutorInput.value = livroParaEditar.autor || '';
        livroGeneroInput.value = livroParaEditar.genero || '';
        livroEditoraInput.value = livroParaEditar.editora || '';
        livroEdicaoInput.value = livroParaEditar.edicao || '';
        livroAnoInput.value = livroParaEditar.ano || '';
        livroPaginasInput.value = livroParaEditar.paginas || '';
        livroOrigemInput.value = livroParaEditar.origem || '';
        livroLocalInput.value = livroParaEditar.local || '';
        tipoObraSelect.value = livroParaEditar.tipoObra || 'proprio';

        if (livroParaEditar.tipoObra === 'parte-de-um-livro') {
            camposParteLivroDiv.classList.remove('hidden');
            livroColetaneaSelect.value = livroParaEditar.coletaneaId || '';
        } else {
            camposParteLivroDiv.classList.add('hidden');
        }
    }
};

const excluirLivro = (id) => {
    if (confirm("Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.")) {
        db.collection('livros').doc(id).delete()
            .then(() => {
                alert("Livro excluído com sucesso!");
                modalAdicionarLivro.classList.add('hidden');
                window.carregarLivros(auth.currentUser.uid);
            })
            .catch(error => {
                alert("Erro ao excluir livro: " + error.message);
                console.error("Erro ao excluir documento: ", error);
            });
    }
};

export const carregarColetaneas = (uid) => {
    db.collection('livros').where('uid', '==', uid).where('tipoObra', '==', 'coletanea').get()
        .then(querySnapshot => {
            livroColetaneaSelect.innerHTML = '<option value="">Selecione...</option>';
            querySnapshot.forEach(doc => {
                const livro = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = livro.titulo;
                livroColetaneaSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Erro ao carregar coletâneas: ", error));
};


// --- LÓGICA DO MODAL DE REGISTRO ---
const btnAdicionarRegistro = document.getElementById('btn-adicionar-registro');
const modalAdicionarRegistro = document.getElementById('modal-adicionar-registro');
const modalRegistroTitle = document.getElementById('modal-registro-title');
const btnFecharRegistroModal = document.getElementById('btn-fechar-registro-modal');
const btnSalvarRegistro = document.getElementById('btn-salvar-registro');
const btnDeletarRegistro = document.getElementById('btn-deletar-registro');
const origemLeituraRadios = document.getElementsByName('origem-leitura');
const formAcervoDiv = document.getElementById('form-acervo');
const formTerceirosDiv = document.getElementById('form-terceiros');
const livroRegistroAcervoSelect = document.getElementById('livro-registro-acervo');
const livroRegistroTerceirosTituloInput = document.getElementById('livro-registro-terceiros-titulo');
const livroRegistroTerceirosAutorInput = document.getElementById('livro-registro-terceiros-autor');
const livroRegistroTerceirosDescricaoInput = document.getElementById('livro-registro-terceiros-descricao');
const dataInicioLeituraInput = document.getElementById('data-inicio-leitura');
const dataFimLeituraInput = document.getElementById('data-fim-leitura');
const comentariosLeituraTextarea = document.getElementById('comentarios-leitura');

export const abrirModalAdicionarRegistro = () => {
    window.registroSendoEditadoId = null;
    modalRegistroTitle.textContent = 'Adicionar Registro de Leitura';
    btnDeletarRegistro.classList.add('hidden');
    modalAdicionarRegistro.classList.remove('hidden');
    dataInicioLeituraInput.value = '';
    dataFimLeituraInput.value = '';
    comentariosLeituraTextarea.value = '';
    origemLeituraRadios[0].checked = true;
    formAcervoDiv.classList.remove('hidden');
    formTerceirosDiv.classList.add('hidden');
};

export const editarRegistro = (id) => {
    window.registroSendoEditadoId = id;
    const registroParaEditar = window.todosRegistros.find(registro => registro.id === id);

    if (registroParaEditar) {
        modalRegistroTitle.textContent = 'Editar Registro de Leitura';
        btnDeletarRegistro.classList.remove('hidden');
        modalAdicionarRegistro.classList.remove('hidden');
        dataInicioLeituraInput.value = registroParaEditar.dataInicio || '';
        dataFimLeituraInput.value = registroParaEditar.dataFim || '';
        comentariosLeituraTextarea.value = registroParaEditar.comentarios || '';

        if (registroParaEditar.origem === 'acervo') {
            origemLeituraRadios[0].checked = true;
            formAcervoDiv.classList.remove('hidden');
            formTerceirosDiv.classList.add('hidden');
            livroRegistroAcervoSelect.value = registroParaEditar.livroId || '';
        } else {
            origemLeituraRadios[1].checked = true;
            formAcervoDiv.classList.add('hidden');
            formTerceirosDiv.classList.remove('hidden');
            livroRegistroTerceirosTituloInput.value = registroParaEditar.titulo || '';
            livroRegistroTerceirosAutorInput.value = registroParaEditar.autor || '';
            livroRegistroTerceirosDescricaoInput.value = registroParaEditar.descricaoTerceiro || '';
        }
    }
};

const excluirRegistro = (id) => {
    if (confirm("Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.")) {
        db.collection('registros_leitura').doc(id).delete()
            .then(() => {
                alert("Registro excluído com sucesso!");
                modalAdicionarRegistro.classList.add('hidden');
                window.carregarRegistros(auth.currentUser.uid);
            })
            .catch(error => {
                alert("Erro ao excluir registro: " + error.message);
                console.error("Erro ao excluir documento: ", error);
            });
    }
};

export const carregarLivrosAcervoParaRegistro = (uid) => {
    db.collection('livros').where('uid', '==', uid).get()
        .then(querySnapshot => {
            livroRegistroAcervoSelect.innerHTML = '<option value="">Selecione...</option>';
            querySnapshot.forEach(doc => {
                const livro = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = livro.titulo;
                livroRegistroAcervoSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Erro ao carregar livros para registro: ", error));
};


// --- LÓGICA DO MODAL DE METAS (Para ser chamada da Calculadora) ---
const modalAdicionarMeta = document.getElementById('modal-adicionar-meta');
const metaTituloInput = document.getElementById('meta-titulo');
const metaTipoSelect = document.getElementById('meta-tipo');
const metaLivrosQuantidadeInput = document.getElementById('meta-livros-quantidade');
const metaPaginasQuantidadeInput = document.getElementById('meta-paginas-quantidade');
const metaPrazoInput = document.getElementById('meta-prazo');
const metaLivrosCamposDiv = document.getElementById('meta-livros-campos');
const metaPaginasCamposDiv = document.getElementById('meta-paginas-campos');

export const abrirModalAdicionarMeta = (titulo, tipo, quantidade, prazo) => {
    modalAdicionarMeta.classList.remove('hidden');
    metaTituloInput.value = titulo || '';
    metaTipoSelect.value = tipo || 'livros';
    if (tipo === 'livros') {
        metaLivrosQuantidadeInput.value = quantidade || '';
        metaPaginasCamposDiv.classList.add('hidden');
        metaLivrosCamposDiv.classList.remove('hidden');
    } else {
        metaPaginasQuantidadeInput.value = quantidade || '';
        metaLivrosCamposDiv.classList.add('hidden');
        metaPaginasCamposDiv.classList.remove('hidden');
    }
    metaPrazoInput.value = prazo || '';
};

// --- EVENT LISTENERS GLOBAIS DOS MODAIS ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.bookId;
            editarLivro(id);
        });
    });

    document.querySelectorAll('.edit-registro-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.registroId;
            editarRegistro(id);
        });
    });

    btnFecharModal.addEventListener('click', () => {
        modalAdicionarLivro.classList.add('hidden');
    });

    btnDeletarLivro.addEventListener('click', () => {
        if (window.livroSendoEditadoId) {
            excluirLivro(window.livroSendoEditadoId);
        }
    });
    
    tipoObraSelect.addEventListener('change', () => {
        const tipo = tipoObraSelect.value;
        if (tipo === 'parte-de-um-livro') {
            camposParteLivroDiv.classList.remove('hidden');
        } else {
            camposParteLivroDiv.classList.add('hidden');
        }
    });

    btnSalvarLivro.addEventListener('click', () => {
        const user = auth.currentUser;
        const titulo = livroTituloInput.value.trim();

        if (!titulo) {
            alert("O campo Título é obrigatório.");
            return;
        }

        if (user) {
            const tipoObra = tipoObraSelect.value;
            const livroData = {
                uid: user.uid,
                tipoObra: tipoObra,
                titulo: titulo,
                autor: livroAutorInput.value,
                genero: livroGeneroInput.value,
                editora: livroEditoraInput.value,
                edicao: livroEdicaoInput.value,
                ano: livroAnoInput.value,
                paginas: livroPaginasInput.value,
                origem: livroOrigemInput.value,
                local: livroLocalInput.value,
                coletaneaId: tipoObra === 'parte-de-um-livro' ? livroColetaneaSelect.value : null
            };

            if (window.livroSendoEditadoId) {
                db.collection('livros').doc(window.livroSendoEditadoId).update(livroData)
                    .then(() => {
                        alert("Livro atualizado com sucesso!");
                        modalAdicionarLivro.classList.add('hidden');
                        window.carregarLivros(user.uid);
                    })
                    .catch(error => {
                        alert("Erro ao atualizar livro: " + error.message);
                        console.error("Erro ao atualizar documento: ", error);
                    });
            } else {
                livroData.id_unico = generateUniqueId();
                db.collection('livros').add(livroData)
                    .then(() => {
                        alert("Livro salvo com sucesso!");
                        modalAdicionarLivro.classList.add('hidden');
                        window.carregarLivros(user.uid);
                        if (tipoObra === 'coletanea') {
                            carregarColetaneas(user.uid);
                        }
                    })
                    .catch(error => {
                        alert("Erro ao salvar livro: " + error.message);
                        console.error("Erro ao adicionar documento: ", error);
                    });
            }
        } else {
            alert("Nenhum usuário logado. Por favor, faça login.");
        }
    });

    btnFecharRegistroModal.addEventListener('click', () => {
        modalAdicionarRegistro.classList.add('hidden');
    });

    btnDeletarRegistro.addEventListener('click', () => {
        if (window.registroSendoEditadoId) {
            excluirRegistro(window.registroSendoEditadoId);
        }
    });

    for (const radio of origemLeituraRadios) {
        radio.addEventListener('change', () => {
            if (radio.value === 'acervo') {
                formAcervoDiv.classList.remove('hidden');
                formTerceirosDiv.classList.add('hidden');
            } else {
                formAcervoDiv.classList.add('hidden');
                formTerceirosDiv.classList.remove('hidden');
            }
        });
    }
    
    btnSalvarRegistro.addEventListener('click', () => {
        const user = auth.currentUser;
        const dataFim = dataFimLeituraInput.value;

        if (!dataFim) {
            alert("A Data de Fim é obrigatória.");
            return;
        }

        if (user) {
            const origem = document.querySelector('input[name="origem-leitura"]:checked').value;
            const registroData = {
                uid: user.uid,
                origem: origem,
                dataInicio: dataInicioLeituraInput.value || null,
                dataFim: dataFim,
                comentarios: comentariosLeituraTextarea.value
            };

            if (origem === 'acervo') {
                registroData.livroId = livroRegistroAcervoSelect.value;
            } else {
                registroData.titulo = livroRegistroTerceirosTituloInput.value;
                registroData.autor = livroRegistroTerceirosAutorInput.value;
                registroData.descricaoTerceiro = livroRegistroTerceirosDescricaoInput.value;
            }

            if (window.registroSendoEditadoId) {
                db.collection('registros_leitura').doc(window.registroSendoEditadoId).update(registroData)
                    .then(() => {
                        alert("Registro atualizado com sucesso!");
                        modalAdicionarRegistro.classList.add('hidden');
                        window.carregarRegistros(user.uid);
                    })
                    .catch(error => {
                        alert("Erro ao atualizar registro: " + error.message);
                        console.error("Erro ao atualizar documento: ", error);
                    });
            } else {
                db.collection('registros_leitura').add(registroData)
                    .then(() => {
                        alert("Registro de leitura salvo com sucesso!");
                        modalAdicionarRegistro.classList.add('hidden');
                        window.carregarRegistros(user.uid);
                    })
                    .catch(error => {
                        alert("Erro ao salvar registro: " + error.message);
                        console.error("Erro ao adicionar documento: ", error);
                    });
            }
        } else {
            alert("Nenhum usuário logado. Por favor, faça login.");
        }
    });
});