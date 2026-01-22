import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch, setToken } from '../lib/api';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
                const data = await apiFetch('/api/admin/auth/login', {
                          method: 'POST',
                          body: JSON.stringify({ email, password }),
                });

          setToken(data.token);
                router.push('/salons');
        } catch (err) {
                setError(err.message || 'Erreur de connexion');
        } finally {
                setLoading(false);
        }
  };

  return (
        <div className="container">
          <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h1>Connexion Admin</h1>
{error && <p className="error">{error}</p>}
         <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
             <input
               type="email"
               id="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
             />
                 </div>
           <div className="form-group">
                             <label htmlFor="password">Mot de passe</label>
             <input
               type="password"
               id="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             />
                 </div>
           <button type="submit" className="btn-primary" disabled={loading}>
               {loading ? 'Connexion...' : 'Se connecter'}
</button>
  </form>
  </div>
  </div>
  );
}
