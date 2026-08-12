const API_URL = import.meta.env.VITE_API_URL || 'https://cadastro-clientes-spring-m81bl0-cb8c34-144-126-149-173.sslip.io'

export async function login(email, senha) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha }),
  })

  if (!response.ok) {
    throw new Error('Email ou senha invalidos.')
  }

  return response.json()
}
