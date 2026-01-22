const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function publicApiFetch(endpoint) {
    const url = `${API_URL}${endpoint}`

  let response
    try {
          response = await fetch(url)
    } catch (err) {
          const error = new Error('Impossible de contacter le serveur')
          error.type = 'network'
          throw error
    }

  if (!response.ok) {
        if (response.status === 404) {
                const error = new Error('Salon non trouvé')
                error.type = 'not_found'
                throw error
        }
        const error = new Error('Une erreur est survenue')
        error.type = 'error'
        throw error
  }

  return response.json()
}
