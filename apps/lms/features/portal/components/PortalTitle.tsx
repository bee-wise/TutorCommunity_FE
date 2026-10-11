import styles from "../styles/portal.module.css";

type PortalTitleProps = {
  primary: string;
  accent: string;
  id?: string;
  className?: string;
  as?: "h2" | "h3";
};

export function PortalTitle({ primary, accent, id, className = "", as: Tag = "h2" }: PortalTitleProps) {
  return (
    <Tag id={id} className={`font-semibold leading-[1.22] tracking-[-0.035em] text-primary ${className}`}>
      {primary}<span className={styles.accentTitle}>{accent}</span>
    </Tag>
  );
}
