export const SECTIONS = {
  usuarios: {
    title: 'Usuários',
    subtitle: 'Total de usuários',
    endpoint: '/usuarios',
    searchLabel: 'ID ou email do usuario',
    searchPlaceholder: 'Digite para pesquisar'
  },
  produtos: {
    title: 'Produtos',
    subtitle: 'Produtos cadastrados',
    endpoint: '/produtos',
    searchLabel: 'ID ou código de barras',
    searchPlaceholder: 'Digite para pesquisar'
  },
  compras: {
    title: 'Compras',
    subtitle: 'Historico de compras',
    endpoint: '/compras',
    searchLabel: 'ID da compra',
    searchPlaceholder: 'Digite para pesquisar'
  },
  itensCompra: {
    title: 'Itens da compra',
    subtitle: 'Produtos vinculados as compras',
    endpoint: '/itens-compra',
    searchLabel: 'ID da compra e ID do produto',
    searchPlaceholder: 'Digite para pesquisar'
  },
}

export const INITIAL_FORMS = {
  usuarios: {
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
    usuarioId: '',
    valorTotal: '',
  },
  itensCompra: {
    compraId: '',
    produtoId: '',
    quantidade: '',
    precoUnitario: '',
  },
}
