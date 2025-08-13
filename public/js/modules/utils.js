// public/js/modules/utils.js

const livrosGrid = document.getElementById('livros-grid');
const registrosGrid = document.getElementById('registros-grid');

// Importa a função de edição de modals
import { editarLivro, editarRegistro, abrirModalAdicionarMeta } from './modals.js';


export const renderLivros = (livros) => {
    livrosGrid.innerHTML = '';
    if (livros.length === 0) {
        livrosGrid.innerHTML = `<p>Nenhum livro encontrado.</p>`;
        return;
    }

    livros.forEach(livro => {
        const livroCard = `
            <div class="livro-card" data-book-id="${livro.id}">
                <div class="livro-card-header">
                    <h3>${livro.titulo}</h3>
                    <div class="card-actions">
                        <button class="edit-btn" data-book-id="${livro.id}"><i class="fas fa-edit"></i></button>
                        <button class="expand-btn"><i class="fas fa-chevron-down"></i></button>
                    </div>
                </div>
                <div class="livro-card-content hidden">
                    <p><strong>Autor:</strong> ${livro.autor}</p>
                    ${livro.genero ? `<p><strong>Gênero:</strong> ${livro.genero}</p>` : ''}
                    ${livro.editora ? `<p><strong>Editora:</strong> ${livro.editora}</p>` : ''}
                    ${livro.edicao ? `<p><strong>Edição:</strong> ${livro.edicao}</p>` : ''}
                    ${livro.ano ? `<p><strong>Ano:</strong> ${livro.ano}</p>` : ''}
                    ${livro.paginas ? `<p><strong>Páginas:</strong> ${livro.paginas}</p>` : ''}
                    ${livro.origem ? `<p><strong>Origem:</strong> ${livro.origem}</p>` : ''}
                    ${livro.local ? `<p><strong>Local:</strong> ${livro.local}</p>` : ''}
                </div>
            </div>
        `;
        livrosGrid.innerHTML += livroCard;
    });

    // Adiciona os eventos depois de renderizar
    document.querySelectorAll('.livro-card-header').forEach(header => {
        header.addEventListener('click', (e) => {
            if (e.target.closest('.card-actions')) return;
            toggleCardContent(header);
        });
    });
    
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const header = e.currentTarget.closest('.livro-card-header');
            toggleCardContent(header);
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.bookId;
            editarLivro(id);
        });
    });
};

export const handleSearchAndSort = (todosLivros, searchInput, sortBtn, sortOptions, currentSortIndex, renderFunction) => {
    let livrosFiltrados = [...todosLivros];

    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        livrosFiltrados = livrosFiltrados.filter(livro =>
            (livro.titulo && livro.titulo.toLowerCase().includes(searchTerm)) ||
            (livro.autor && livro.autor.toLowerCase().includes(searchTerm))
        );
    }

    const sortBy = sortOptions[currentSortIndex];
    livrosFiltrados.sort((a, b) => {
        const valA = a[sortBy] || '';
        const valB = b[sortBy] || '';
        if (typeof valA === 'string') {
            return valA.localeCompare(valB);
        }
        return valA - valB;
    });
    
    sortBtn.innerHTML = `Ordenar por ${sortOptions[currentSortIndex].charAt(0).toUpperCase() + sortOptions[currentSortIndex].slice(1)} <i class="fas fa-sort-alpha-down"></i>`;

    renderFunction(livrosFiltrados);
};


export const renderRegistros = (registros) => {
    registrosGrid.innerHTML = '';
    if (registros.length === 0) {
        registrosGrid.innerHTML = `<p>Nenhum registro de leitura encontrado.</p>`;
        return;
    }

    registros.forEach(registro => {
        const tituloPrincipal = registro.origem === 'acervo' ?
            (window.todosLivros.find(l => l.id === registro.livroId)?.titulo || 'Livro do Acervo (removido)') :
            registro.titulo;
        const autorPrincipal = registro.origem === 'acervo' ?
            (window.todosLivros.find(l => l.id === a.livroId)?.autor || '') :
            registro.autor;

        const registroCardHTML = `
            <div class="livro-card" data-registro-id="${registro.id}">
                <div class="livro-card-header">
                    <h3>${tituloPrincipal}</h3>
                    <div class="card-actions">
                        <span>${registro.dataFim}</span>
                        <button class="edit-registro-btn" data-registro-id="${registro.id}"><i class="fas fa-edit"></i></button>
                        <button class="expand-btn"><i class="fas fa-chevron-down"></i></button>
                    </div>
                </div>
                <div class="livro-card-content hidden">
                    <p><strong>Autor:</strong> ${autorPrincipal || 'Não informado'}</p>
                    <p><strong>Data de Início:</strong> ${registro.dataInicio || 'Não informado'}</p>
                    <p><strong>Comentários:</strong> ${registro.comentarios || 'Nenhum'}</p>
                </div>
            </div>
        `;
        registrosGrid.innerHTML += registroCardHTML;
    });

    document.querySelectorAll('#registros-grid .livro-card-header').forEach(header => {
        header.addEventListener('click', (e) => {
            if (e.target.closest('.card-actions')) return;
            toggleCardContent(header);
        });
    });

    document.querySelectorAll('#registros-grid .expand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const header = e.currentTarget.closest('.livro-card-header');
            toggleCardContent(header);
        });
    });
};

export const handleSortRegistros = (todosRegistros, todosLivros, sortBtn, sortOptions, currentSortIndex, renderFunction) => {
    let registrosOrdenados = [...todosRegistros];

    const sortBy = sortOptions[currentSortIndex];
    registrosOrdenados.sort((a, b) => {
        let valA, valB;

        if (sortBy === 'dataFim') {
            valA = a.dataFim || '';
            valB = b.dataFim || '';
        } else if (sortBy === 'titulo') {
            valA = a.origem === 'acervo' ? (todosLivros.find(l => l.id === a.livroId)?.titulo || '') : a.titulo || '';
            valB = b.origem === 'acervo' ? (todosLivros.find(l => l.id === b.livroId)?.titulo || '') : b.titulo || '';
        } else if (sortBy === 'autor') {
            valA = a.origem === 'acervo' ? (todosLivros.find(l => l.id === a.livroId)?.autor || '') : a.autor || '';
            valB = b.origem === 'acervo' ? (todosLivros.find(l => l.id === b.livroId)?.autor || '') : b.autor || '';
        }
        
        if (typeof valA === 'string' && typeof valB === 'string') {
            return valA.localeCompare(valB);
        }
        return 0;
    });

    const sortText = sortBy === 'dataFim' ? 'Data de Fim' : sortBy.charAt(0).toUpperCase() + sortBy.slice(1);
    sortBtn.innerHTML = `Ordenar por ${sortText} <i class="fas fa-sort-alpha-down"></i>`;
    renderFunction(registrosOrdenados);
};

const toggleCardContent = (header) => {
    const content = header.nextElementSibling;
    const parentCard = header.parentElement;
    const expanded = parentCard.classList.toggle('expanded');
    content.classList.toggle('hidden', !expanded);
    const expandIcon = header.querySelector('.expand-btn i');
    if (expandIcon) {
        expandIcon.classList.toggle('fa-chevron-down', !expanded);
        expandIcon.classList.toggle('fa-chevron-up', expanded);
    }
};