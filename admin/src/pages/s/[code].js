import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import PublicLayout from '../../../components/public/PublicLayout'
import { publicApiFetch, fetchSalonProducts } from '../../../lib/publicApi'
import styles from '../../../styles/SalonPublic.module.css'

function formatPrice(priceCents) {
      return (priceCents / 100).toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
      })
}

export default function SalonPublicPage() {
      const router = useRouter()
      const { code } = router.query

  const [salon, setSalon] = useState(null)
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState(null)
      const [errorType, setErrorType] = useState(null)

  const [products, setProducts] = useState([])
      const [productsLoading, setProductsLoading] = useState(false)
      const [productsError, setProductsError] = useState(null)

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

  useEffect(() => {
          if (!salon || !code) return

                const loadProducts = async () => {
                          setProductsLoading(true)
                          setProductsError(null)

                          try {
                                      const data = await fetchSalonProducts(code)
                                      setProducts(data.products || [])
                          } catch (err) {
                                      setProductsError('Impossible de charger les produits')
                                      setProducts([])
                          } finally {
                                      setProductsLoading(false)
                          }
                }

                loadProducts()
  }, [salon, code])

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
              <img src={salon.logo_url} alt={`Logo ${salon.nom}`} className={styles.logo} />
      </div>
          )}
          <h1 className={styles.name}>{salon.nom}</h1>
{salon.adresse && <p className={styles.address}>{salon.adresse}</p>}
 {salon.telephone && (
                 <p className={styles.info}>
                   <span className={styles.label}>Tel :</span> {salon.telephone}
     </p>
            )}
 {salon.email && (
                 <p className={styles.info}>
                   <span className={styles.label}>Email :</span> {salon.email}
     </p>
            )}
 </div>

        <section className={styles.productsSection}>
          <h2 className={styles.productsTitle}>Nos produits</h2>

 {productsLoading && (
                 <p className={styles.productsLoading}>Chargement des produits...</p>
            )}

 {!productsLoading && productsError && (
                 <p className={styles.productsError}>{productsError}</p>
            )}

 {!productsLoading && !productsError && products.length === 0 && (
                 <p className={styles.productsEmpty}>Aucun produit disponible pour le moment.</p>
            )}

 {!productsLoading && !productsError && products.length > 0 && (
                 <div className={styles.productsGrid}>
 {products.map((product) => (
                     <div key={product.id} className={styles.productCard}>
 {product.image_url && (
                         <div className={styles.productImageWrapper}>
                      <img
                         src={product.image_url}
                        alt={product.name}
                        className={styles.productImage}
                      />
                          </div>
                  )}
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
{product.description && (
                          <p className={styles.productDescription}>{product.description}</p>
                     )}
                    <p className={styles.productPrice}>{formatPrice(product.price_cents)}</p>
                        </div>
                        </div>
              ))}
                  </div>
          )}
</section>
              </div>
              </PublicLayout>
  )
}
