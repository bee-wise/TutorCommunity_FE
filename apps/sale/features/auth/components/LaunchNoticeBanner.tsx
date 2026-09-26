import styles from "./LaunchNoticeBanner.module.css";

interface LaunchNoticeBannerProps {
  notice: string;
  placement?: "auth" | "home";
}

export function LaunchNoticeBanner({
  notice,
  placement = "auth",
}: LaunchNoticeBannerProps) {
  return (
    <section
      className={`${styles.banner} ${placement === "home" ? styles.homeBanner : ""}`}
      role="status"
      aria-label="Thông báo từ BeeWise"
    >
      <div className={styles.heading}>
        <span className={styles.dot} aria-hidden="true" />
        <span>BeeWise sắp ra mắt</span>
      </div>
      <div className={styles.window} aria-hidden="true">
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <span className={styles.copy} key={copy}>
              {notice}
              <span className={styles.separator}>✦</span>
            </span>
          ))}
        </div>
      </div>
      <p className={styles.description}>{notice}</p>
    </section>
  );
}
