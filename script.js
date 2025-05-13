const botao = document.getElementById("add-button");
const input = document.getElementById("input");
const resultado = document.getElementById("listaTarefas");

// Função para adicionar um novo item
function adicionarItem(objeto) {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'space-between';
  container.style.padding = '10px';
  container.style.margin = '10px 0';
  container.style.border = '1px solid #ccc';
  container.style.borderRadius = '5px';
  container.style.backgroundColor = objeto.favorito ? '#ffff99' : '#1f1f35';
  container.style.color = objeto.favorito ? 'black' : 'white'; // Cor do texto altera para preto quando favorito
  container.style.fontSize = '20px';

  // Texto da tarefa
  const textoSpan = document.createElement('span');
  textoSpan.textContent = objeto.texto;
  textoSpan.style.flex = '1';
  textoSpan.style.textAlign = 'left';

  // Botão estrela
  const botaoEstrela = document.createElement('button');
  botaoEstrela.textContent = objeto.favorito ? '⭐' : '☆';
  botaoEstrela.style.backgroundColor = 'transparent';
  botaoEstrela.style.border = 'none';
  botaoEstrela.style.color = objeto.favorito ? '#ffcc00' : 'white';
  botaoEstrela.style.fontSize = '22px';
  botaoEstrela.style.cursor = 'pointer';

  botaoEstrela.addEventListener('click', () => {
    // Atualiza o objeto
    objeto.favorito = !objeto.favorito;

    // Atualiza no localStorage
    const lista = JSON.parse(localStorage.getItem('itens')) || [];
    const novaLista = lista.map(item => {
      if (item.texto === objeto.texto) {
        return { ...item, favorito: objeto.favorito };
      }
      return item;
    });
    localStorage.setItem('itens', JSON.stringify(novaLista));

    // Atualiza a tela
    atualizarTarefas();
  });

  // Botão excluir
  const botaoExcluir = document.createElement('button');
  botaoExcluir.textContent = '🗑️';
  botaoExcluir.style.backgroundColor = 'transparent';
  botaoExcluir.style.color = 'white';
  botaoExcluir.style.border = 'none';
  botaoExcluir.style.padding = '5px 10px';
  botaoExcluir.style.borderRadius = '5px';
  botaoExcluir.style.cursor = 'pointer';
  botaoExcluir.style.fontSize = '20px';

  botaoExcluir.addEventListener('click', () => {
    const lista = JSON.parse(localStorage.getItem('itens')) || [];
    const novaLista = lista.filter(item => item.texto !== objeto.texto);
    localStorage.setItem('itens', JSON.stringify(novaLista));
    atualizarTarefas();
  });

  container.appendChild(textoSpan);
  container.appendChild(botaoEstrela);
  container.appendChild(botaoExcluir);
  resultado.appendChild(container);
}

// Atualiza a lista de tarefas na tela
function atualizarTarefas() {
  resultado.innerHTML = '';
  const dadosSalvos = localStorage.getItem('itens');
  if (dadosSalvos) {
    const lista = JSON.parse(dadosSalvos);
    lista.forEach(item => adicionarItem(item));
  }
}

// Carrega os dados salvos ao carregar a página
window.onload = () => {
  atualizarTarefas();
};

// Evento de clique no botão "Adicionar"
botao.addEventListener('click', () => {
  const texto = input.value.trim();
  if (texto !== '') {
    const novoItem = { texto, favorito: false };
    const dadosSalvos = localStorage.getItem('itens');
    const lista = dadosSalvos ? JSON.parse(dadosSalvos) : [];
    lista.push(novoItem);
    localStorage.setItem('itens', JSON.stringify(lista));
    atualizarTarefas();
    input.value = '';
  }
});
