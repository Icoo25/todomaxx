import { useState } from 'react'
import supabase from '../lib/supabase'
import { User } from '@supabase/supabase-js';

interface AuthProps {
  setUser: (user: User | null) => void
}

export default function Auth({ setUser }: AuthProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
  }

  const handleSignIn = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else setUser(data.user)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 transition-all duration-700">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 tracking-wide">Добре дошли</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 mb-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
        />
        <input
          type="password"
          placeholder="Парола"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 mb-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
        />
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={handleSignUp}
            className="flex-1 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all shadow-md"
          >
            Регистрация
          </button>
          <button
            type="button"
            onClick={handleSignIn}
            className="flex-1 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all shadow-md"
          >
            Вход
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease;
        }
      `}</style>
    </div>
  )
} 