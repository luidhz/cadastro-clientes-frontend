export function UsuarioForm({ form, onChange }) {
  return (
    <>
      <label>
        Nome
        <input
          onChange={(event) => onChange('nome', event.target.value)}
          placeholder="Nome do usuário"
          required
          value={form.nome}
        />
      </label>
      <label>
        Email
        <input
          onChange={(event) => onChange('email', event.target.value)}
          placeholder="email@exemplo.com"
          required
          type="email"
          value={form.email}
        />
      </label>
      <label>
        Idade
        <input
          min="1"
          onChange={(event) => onChange('idade', event.target.value)}
          placeholder="0"
          required
          type="number"
          value={form.idade}
        />
      </label>
      <label>
        Senha
        <input
          onChange={(event) => onChange('senha', event.target.value)}
          placeholder="Senha"
          required
          type="password"
          value={form.senha}
        />
      </label>
      <label>
        Perfil
        <select value={form.role} onChange={(event) => onChange('role', event.target.value)}>
          <option value="USUARIO">Usuário</option>
          <option value="ADMIN">Admin</option>
        </select>
      </label>
    </>
  )
}
