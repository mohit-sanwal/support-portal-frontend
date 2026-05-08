import styles from './OverlayLoader.module.css'

type Props = {
  show: boolean;
};


export default function OverlayLoader({ show }: Props) {

  if (!show) return null;

  return (
    <div className={styles.overlayLoader}>
      <div className={styles.dotLoader}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}