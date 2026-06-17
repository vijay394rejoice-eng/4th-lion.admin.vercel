import styles from './pagination.module.scss';
import ChevronLeftIcon from '@/svg/chevronLeftIcon';
import ChevronRightIcon from '@/svg/chevronRightIcon';

export default function Pagination() {
    return (
        <div className={styles.pagination}>
            <div className={styles.leftSection}>
                <button className={styles.arrowBtn}>
                    <ChevronLeftIcon />
                </button>
                <button className={`${styles.pageNumber} ${styles.active}`}>1</button>
                <button className={styles.pageNumber}>2</button>
                <button className={styles.pageNumber}>3</button>
                <span className={styles.dots}>...</span>
                <button className={styles.pageNumber}>8</button>
                <button className={styles.pageNumber}>9</button>
                <button className={styles.pageNumber}>10</button>
                <button className={styles.arrowBtn}>
                    <ChevronRightIcon />
                </button>
            </div>
            <div className={styles.rightSection}>
                <span>Go To</span>
                <input type="text" className={styles.gotoInput} defaultValue="1" />
            </div>
        </div>
    )
}
