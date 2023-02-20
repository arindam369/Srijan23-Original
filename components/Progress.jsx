import styles from "../styles/Home.module.css";

export default function Progress({progress}){
    return (
        <>
            <div className={styles.progressContainer}>
                <div className={styles.progressBar} style={{width: `${progress}%`}}></div>
            </div>
        </>
    )
}