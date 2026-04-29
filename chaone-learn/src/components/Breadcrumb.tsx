import styles from "./Breadcrumb.module.css";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <ol className={styles.list}>
        {crumbs.map((crumb, i) => (
          <li key={i} className={styles.item}>
            {crumb.href ? (
              <a href={crumb.href} className={styles.link}>
                {crumb.label}
              </a>
            ) : (
              <span className={styles.current}>{crumb.label}</span>
            )}
            {i < crumbs.length - 1 && (
              <span className={styles.separator} aria-hidden="true">
                ›
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
