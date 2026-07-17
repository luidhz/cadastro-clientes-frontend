export const SECTIONS = {
  clientes: {
    title: 'Clientes',
    subtitle: 'Total de clientes',
    endpoint: '/clientes',
    accent: 'blue',
  },
  produtos: {
    title: 'Produtos',
    subtitle: 'Produtos cadastrados',
    endpoint: '/produtos',
    accent: 'green',
  },
  compras: {
    title: 'Compras',
    subtitle: 'Historico de compras',
    endpoint: '/compras',
    accent: 'orange',
  },
}

export const INITIAL_FORMS = {
  clientes: {
    nome: '',
    email: '',
    idade: '',
    senha: '',
  },
  produtos: {
    codigoDeBarras: '',
    nome: '',
    preco: '',
    qtdeEmEstoque: '',
  },
  compras: {
    clienteId: '',
    valorTotal: '',
  },
}
