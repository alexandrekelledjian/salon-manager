import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiFetch, getToken, removeToken } from '../../lib/api';

export default function SalonsList() {
    const router = useRouter();
    const [salons, setSalons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

  useEffect(() => {
        const token = getToken();
        if (!token) {
                router.replace('/login');
                return;
        }

                const fetchSalons = async () => {
                        try {
                                  const data = await apiFetch('/api/admin/salons');
                                  setSalons(data.salons);
                        } catch (err) {
                                  if (err.status === 401) {
                                              removeToken();
                                              router.replace('/login');
                                  } else {
                                              setError(err.message || 'Erreur lors du chargement');
                                  }
                        } finally {
                                  setLoading(false);
                        }
                };

                fetchSalons();
  }, [router]);

  const handleLogout = () => {
        removeToken();
        router.push('/login');
  };

  if (loading) {
        return (
                <div className="container">
                  <p>Chargement...</p>
          </div>
        );
  }

  return (
        <div className="container">
          <div className="header">
            <h1>Gestion des salons</h1>
          <div className="nav">
              <Link href="/salons/new">
                <button className="btn-primary">Nouveau salon</button>
    </Link>
            <button className="btn-secondary" onClick={handleLogout}>
                Déconnexion
    </button>
    </div>
    </div>

  {error && <p className="error">{error}</p>}

        <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Code URL</th>
                 <th>Nom</th>
                 <th>Actif</th>
                 <th>Actions</th>
    </tr>
    </thead>
             <tbody>
  {salons.map((salon) => (
                  <tr key={salon.id}>
                    <td>{salon.code_url}</td>
                              <td>{salon.nom}</td>
                              <td>
                      <span className={`badge ${salon.actif ? 'badge-success' : 'badge-danger'}`}>
              {salon.actif ? 'Actif' : 'Inactif'}
  </span>
    </td>
                  <td className="actions">
                      <Link href={`/salons/${salon.id}`}>
                    <button className="btn-secondary">Éditer</button>
  </Link>
  </td>
  </tr>
            ))}
              </tbody>
              </table>
              </div>
              </div>
  );
}
