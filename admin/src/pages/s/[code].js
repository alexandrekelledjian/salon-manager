import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import PublicLayout from '../../components/public/PublicLayout'
import { publicApiFetch } from '../../lib/publicApi'
import styles from '../../styles/SalonPublic.module.css'

export default function SalonPublicPage() {
    const router = useRouter()
    const { code } = router.query

  const [salon, setSalon] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [errorType, setErrorType] = useState(null)

  useEffect(() => {
        if (!code) return

                const fetchSalon = async () => {
                        setLoading(true)
                        setError(null)
                        setErrorType(null)

                        try {
                                  const data = await publicApiFetch(`/api/public/salons/by-code/${encodeURIComponent(code)}`)
                                  setSalon(data)
                        } catch (err) {
                                  setError(err.message || 'Une erreur est survenue')
                                  setErrorType(err.type || 'error')
                                  setSalon(null)
                        } finally {
                                  setLoading(false)
                        }
                }

                fetchSalon()
  }, [code])

  if (loading || (!salon && !error)) {
        return (
                <PublicLayout>
                  <div className={styles.container}>
                    <p className={styles.loading}>Chargement...</p>
          </div>
          </PublicLayout>
        )
  }

  if (error) {
        const isNotFound = errorType === 'not_found'
        return (
                <PublicLayout>
                  <Head>
                    <title>{isNotFound ? 'Salon non trouvé' : 'Erreur'}</title>
    </Head>
          <div className={styles.container}>
          <div className={styles.errorCard}>
            <h1 className={styles.errorTitle}>{isNotFound ? '404' : 'Erreur'}</h1>
            <p className={styles.errorMessage}>{error}</p>
  </div>
  </div>
  </PublicLayout>
    )
}

  return (
        <PublicLayout>
          <Head>
            <title>{salon.nom}</title>
    </Head>
      <div className={styles.container}>
        <div className={styles.card}>
  {salon.logo_url && (
                <div className={styles.logoWrapper}>
              <img
                src={salon.logo_url}
                alt={`Logo ${salon.nom}`}
                className={styles.logo}
              />
                </div>
          )}
          <h1 className={styles.name}>{salon.nom}</h1>
{salon.adresse && (
              <p className={styles.address}>{salon.adresse}</p>
           )}
{salon.telephone && (
              <p className={styles.info}>
              <span className={styles.label}>Tél :</span> {salon.telephone}
  </p>
           )}
{salon.email && (
              <p className={styles.info}>
              <span className={styles.label}>Email :</span> {salon.email}
  </p>
           )}
</div>
  </div>
  </PublicLayout>
  )
}
