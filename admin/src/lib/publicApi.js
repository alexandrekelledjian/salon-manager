const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function publicApiFetch(url) {
      let response;
      try {
              response = await fetch(`${API_URL}${url}`);
      } catch (err) {
              const error = new Error('Impossible de contacter le serveur');
              error.type = 'network';
              throw error;
      }

  if (!response.ok) {
          if (response.status === 404) {
                    const error = new Error('Salon non trouvé');
                    error.type = 'not_found';
                    throw error;
          }
          const error = new Error('Une erreur est survenue');
          error.type = 'error';
          throw error;
  }

  return response.json();
}

export async function fetchSalonProducts(codeUrl) {
      let response;
      try {
              response = await fetch(`${API_URL}/api/public/salons/${encodeURIComponent(codeUrl)}/products`);
      } catch (err) {
              const error = new Error('Impossible de contacter le serveur');
              error.type = 'network';
              throw error;
      }

  if (!response.ok) {
          if (response.status === 404) {
                    const error = new Error('Salon non trouvé');
                    error.type = 'not_found';
                    throw error;
          }
          const error = new Error('Une erreur est survenue');
          error.type = 'error';
          throw error;
  }

  return response.json();
}
