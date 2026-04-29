import styles from "./ActivityLauncher.module.css";

interface ActivityItem {
  name: string;
  description: string;
  status: string;
  order: number;
  href: string;
}

interface ActivityLauncherProps {
  activities: ActivityItem[];
}

export default function ActivityLauncher({ activities }: ActivityLauncherProps) {
  return (
    <div className={styles.wrapper} role="list">
      {activities.map((activity) => (
        <a
          key={activity.name}
          href={activity.href}
          className={styles.row}
          role="listitem"
        >
          <span className={styles.order} aria-hidden="true">
            {activity.order}
          </span>
          <div className={styles.content}>
            <span className={styles.name}>{activity.name}</span>
            <span className={styles.description}>{activity.description}</span>
          </div>
          <span className={styles.status}>{activity.status}</span>
        </a>
      ))}
    </div>
  );
}
