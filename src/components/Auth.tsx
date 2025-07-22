import { useState } from 'react'
import supabase from '../lib/supabase'

interface AuthProps {
  setUser: (user: any) => void
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
    <div className="p-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 mb-2 border"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 mb-2 border"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleSignUp} className="p-2 bg-blue-500 text-white">
        Sign Up
      </button>
      <button onClick={handleSignIn} className="p-2 bg-green-500 text-white ml-2">
        Sign In
      </button>
    </div>
  )
} 