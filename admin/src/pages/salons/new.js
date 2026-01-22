import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiFetch, getToken } from '../../lib/api';

export default function NewSalon() {
    const router = useRouter();
    const [salon, setSalon] = useState({
          code_url: '',
          nom: '',
          email: '',
          telephone: '',
          adresse: '',
          actif: true,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

  useEffect(() => {
        const token = getToken();
        if (!token) {
                router.replace('/login');
        }
  }, [router]);

  const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSalon((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
        }));
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
                await apiFetch('/api/admin/salons', {
                          method: 'POST',
                          body: JSON.stringify(salon),
                });
                router.push('/salons');
        } catch (err) {
                setError(err.message || 'Erreur lors de la création');
        } finally {
                setSaving(false);
        }
  };

  return (
        <div className="container">
          <div className="header">
            <h1>Nouveau salon</h1>
          <Link href="/salons">
              <button className="btn-secondary">Retour</button>
    </Link>
    </div>

  {error && <p className="error">{error}</p>}

        <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="code_url">Code URL</label>
               <input
                 type="text"
                 id="code_url"
                 name="code_url"
                 value={salon.code_url}
                onChange={handleChange}
                placeholder="Ex: SALON75001"
                required
              />
                  </div>
            <div className="form-group">
                              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={salon.nom}
              onChange={handleChange}
              required
            />
                </div>
          <div className="form-group">
                            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={salon.email}
              onChange={handleChange}
            />
                </div>
          <div className="form-group">
                            <label htmlFor="telephone">Téléphone</label>
            <input
              type="text"
              id="telephone"
              name="telephone"
              value={salon.telephone}
              onChange={handleChange}
            />
                </div>
          <div className="form-group">
                            <label htmlFor="adresse">Adresse</label>
            <textarea
              id="adresse"
              name="adresse"
              value={salon.adresse}
              onChange={handleChange}
              rows={3}
            />
                </div>
          <div className="form-group toggle-switch">
                            <input
              type="checkbox"
              id="actif"
              name="actif"
              checked={salon.actif}
              onChange={handleChange}
            />
                            <label htmlFor="actif">Actif</label>
                </div>
          <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Création...' : 'Créer'}
</button>
  </form>
  </div>
  </div>
  );
}
