document.addEventListener('DOMContentLoaded', function() {
    const botao = document.getElementById("add-button");
    const input = document.getElementById("input");
    const resultado = document.getElementById("listaTarefas");
    const filtro = document.getElementById("filtroTarefas"); // Corrigido para o ID correto

    // Função para gerar ID único
    function gerarId() {
        return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    // Carrega tarefas ao iniciar
    function carregarTarefas() {
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        resultado.innerHTML = '';
        
        // Ordena: favoritos primeiro
        tarefas.sort((a, b) => (b.favorito ? 1 : 0) - (a.favorito ? 1 : 0));
        
        // Aplica filtro
        const filtroAtivo = filtro.value;
        const tarefasFiltradas = tarefas.filter(tarefa => {
            if (filtroAtivo === 'todas') return true;
            if (filtroAtivo === 'concluidas') return tarefa.concluida;
            if (filtroAtivo === 'nao-concluidas') return !tarefa.concluida;
            return true;
        });
        
        tarefasFiltradas.forEach(tarefa => criarItemTarefa(tarefa));
    }

    // Cria o elemento HTML para uma tarefa
    function criarItemTarefa(tarefa) {
        const item = document.createElement('div');
        item.className = 'tarefa-item';
        item.dataset.id = tarefa.id;
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        item.style.padding = '10px';
        item.style.margin = '10px auto';
        item.style.borderRadius = '8px';
        item.style.width = '80%';
        item.style.backgroundColor = tarefa.favorito ? '#ffff99' : '#1f1f35';
        item.style.color = tarefa.favorito ? 'black' : 'white';
        item.style.border = '2px solid #4444ff';
        item.style.boxShadow = '0 0 5px #00000088';

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarefa.concluida;
        checkbox.style.marginRight = '10px';
        checkbox.style.width = '20px';
        checkbox.style.height = '20px';

        // Texto
        const texto = document.createElement('span');
        texto.textContent = tarefa.texto;
        texto.style.flex = '1';
        texto.style.textAlign = 'left';
        texto.style.fontSize = '22px';
        if (tarefa.concluida) {
            texto.style.textDecoration = 'line-through';
            texto.style.opacity = '0.7';
        }

        // Botão favorito
        const btnFavorito = document.createElement('button');
        btnFavorito.textContent = tarefa.favorito ? '⭐' : '☆';
        btnFavorito.className = 'btn-favorito';
        btnFavorito.style.marginRight = '10px';
        btnFavorito.style.background = 'none';
        btnFavorito.style.border = 'none';
        btnFavorito.style.cursor = 'pointer';
        btnFavorito.style.fontSize = '22px';

        // Botão excluir
        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = '🗑️';
        btnExcluir.className = 'btn-excluir';
        btnExcluir.style.background = 'none';
        btnExcluir.style.border = 'none';
        btnExcluir.style.cursor = 'pointer';
        btnExcluir.style.fontSize = '22px';

        // Adiciona elementos
        item.appendChild(checkbox);
        item.appendChild(texto);
        item.appendChild(btnFavorito);
        item.appendChild(btnExcluir);
        resultado.appendChild(item);

        // Eventos
        checkbox.addEventListener('change', function() {
            tarefa.concluida = this.checked;
            texto.style.textDecoration = tarefa.concluida ? 'line-through' : 'none';
            texto.style.opacity = tarefa.concluida ? '0.7' : '1';
            atualizarLocalStorage();
        });

        btnFavorito.addEventListener('click', function() {
            tarefa.favorito = !tarefa.favorito;
            this.textContent = tarefa.favorito ? '⭐' : '☆';
            item.style.backgroundColor = tarefa.favorito ? '#ffff99' : '#1f1f35';
            item.style.color = tarefa.favorito ? 'black' : 'white';
            atualizarLocalStorage();
            // Força recarregar para reordenar
            setTimeout(carregarTarefas, 100);
        });

        btnExcluir.addEventListener('click', function() {
            if (confirm('Deseja realmente excluir esta tarefa?')) {
                item.remove();
                const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
                const novasTarefas = tarefas.filter(t => t.id !== tarefa.id);
                localStorage.setItem('tarefas', JSON.stringify(novasTarefas));
            }
        });
    }

    // Atualiza o localStorage
    function atualizarLocalStorage() {
        const itens = [];
        document.querySelectorAll('.tarefa-item').forEach(item => {
            itens.push({
                id: item.dataset.id,
                texto: item.querySelector('span').textContent,
                concluida: item.querySelector('input[type="checkbox"]').checked,
                favorito: item.querySelector('.btn-favorito').textContent === '⭐'
            });
        });
        localStorage.setItem('tarefas', JSON.stringify(itens));
    }

    // Adiciona nova tarefa
    function adicionarTarefa() {
        const texto = input.value.trim();
        if (texto) {
            const novaTarefa = {
                id: gerarId(),
                texto: texto,
                concluida: false,
                favorito: false
            };
            
            const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
            tarefas.push(novaTarefa);
            localStorage.setItem('tarefas', JSON.stringify(tarefas));
            input.value = '';
            input.focus();
            carregarTarefas();
        }
    }

    // Event listeners
    botao.addEventListener('click', adicionarTarefa);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') adicionarTarefa();
    });
    filtro.addEventListener('change', carregarTarefas);

    // Inicializa
    carregarTarefas();
});