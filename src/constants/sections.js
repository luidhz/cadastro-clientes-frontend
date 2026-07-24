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
}
