import styles from "../../styles/Dashboard.module.css";
import PolarChart from "../PolarChart";
import Workshop from "./Workshop";

export default function Dashboard(){

    return (
        <>
            <div className={styles.dashboardProfileContainer}>
                <div className={styles.dashboardDoughnutChart}>
                    <h2 className={styles.chartHeading}>Srijan'23 Events</h2>
                    <PolarChart/>
                </div>
                <div className={styles.dashboardWorkshopContainer}>
                    <Workshop/>
                </div>
            </div>
        </>
    );
}