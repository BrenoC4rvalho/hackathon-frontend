import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      await AuthService.login(form);
      navigate('/home');
    } catch {
      alert('Credenciais inválidas');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full border rounded-lg p-3"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full bg-black text-white rounded-lg p-3 font-semibold"
          >
            Entrar
          </button>
        </form>

        <p className="text-center mt-6">
          Não possui conta?{' '}
          <Link to="/register" className="underline font-semibold">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}