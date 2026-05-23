import { useNavigate } from 'react-router-dom';

import { AuthService } from '../services/authService';

export default function Home() {

  const navigate = useNavigate();

  async function handleLogout() {

    try {

      await AuthService.logout();

      navigate('/');

    } catch {

      alert('Erro ao realizar logout');

    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6">

        <h1 className="text-5xl font-bold">
          Home protegida
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition text-white px-6 py-3 rounded-xl font-semibold"
        >
          Logout
        </button>

      </div>

    </div>
  );
}