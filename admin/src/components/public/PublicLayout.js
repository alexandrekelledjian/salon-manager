import styles from '../../styles/PublicLayout.module.css'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Mon Salon'

export default function PublicLayout({ children }) {
    return (
          <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.brand}>{SITE_NAME}</span>
      </header>
        <main className={styles.main}>
    {children}
      </main>
        <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} {SITE_NAME}</p>
      </footer>
      </div>
    )
}
