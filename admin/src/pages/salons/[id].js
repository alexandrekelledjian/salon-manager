import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiFetch, getToken, removeToken } from '../../lib/api';

export default function EditSalon() {
    const router = useRouter();
    const { id } = router.query;

  const [salon, setSalon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

  useEffect(() => {
        const token = getToken();
        if (!token) {
                router.replace('/login');
                return;
        }

                if (!id) return;

                const fetchSalon = async () => {
                        try {
                                  const data = await apiFetch('/api/admin/salons');
                                  const found = data.salons.find((s) => s.id === id);
                                  if (found) {
                                              setSalon(found);
                                  } else {
                                              setError('Salon non trouvé');
                                  }
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

                fetchSalon();
  }, [id, router]);

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
        setSuccess('');
        setSaving(true);

        try {
                await apiFetch(`/api/admin/salons/${id}`, {
                          method: 'PATCH',
                          body: JSON.stringify({
                                      code_url: salon.code_url,
                                      nom: salon.nom,
                                      email: salon.email,
                                      telephone: salon.telephone,
                                      adresse: salon.adresse,
                                      actif: salon.actif,
                          }),
                });
                setSuccess('Enregistré');
        } catch (err) {
                setError(err.message || 'Erreur lors de la sauvegarde');
        } finally {
                setSaving(false);
        }
  };

  if (loading) {
        return (
                <div className="container">
                  <p>Chargement...</p>
          </div>
        );
  }

  if (!salon) {
        return (
                <div className="container">
                  <p className="error">{error || 'Salon non trouvé'}</p>
          <Link href="/salons">Retour à la liste</Link>
    </div>
      );
}

  return (
        <div className="container">
          <div className="header">
            <h1>Éditer : {salon.nom}</h1>
        <Link href="/salons">
              <button className="btn-secondary">Retour</button>
    </Link>
    </div>

{error && <p className="error">{error}</p>}
 {success && <p className="btn-success" style={{ padding: '10px', marginBottom: '15px' }}>{success}</p>}

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
              value={salon.email || ''}
              onChange={handleChange}
            />
                </div>
          <div className="form-group">
                            <label htmlFor="telephone">Téléphone</label>
            <input
              type="text"
              id="telephone"
              name="telephone"
              value={salon.telephone || ''}
              onChange={handleChange}
            />
                </div>
          <div className="form-group">
                            <label htmlFor="adresse">Adresse</label>
            <textarea
              id="adresse"
              name="adresse"
              value={salon.adresse || ''}
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
              {saving ? 'Enregistrement...' : 'Enregistrer'}
</button>
  </form>
  </div>
  </div>
  );
}
