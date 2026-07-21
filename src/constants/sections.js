export const SECTIONS = {
  clientes: {
    title: 'Usuários',
    subtitle: 'Total de usuários',
    endpoint: '/usuarios',
  },
  produtos: {
    title: 'Produtos',
    subtitle: 'Produtos cadastrados',
    endpoint: '/produtos',
  },
  compras: {
    title: 'Compras',
    subtitle: 'Historico de compras',
    endpoint: '/compras',
  },
  itensCompra: {
    title: 'Itens da compra',
    subtitle: 'Produtos vinculados as compras',
    endpoint: '/itens-compra',
  },
}

export const INITIAL_FORMS = {
  clientes: {
    nome: '',
    email: '',
    idade: '',
    senha: '',
    role: 'USUARIO',
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
  itensCompra: {
    compraId: '',
    produtoId: '',
    quantidade: '',
    precoUnitario: '',
  },
}
