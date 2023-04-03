import styles from "../../styles/Dashboard.module.css";
import Image from "next/image";
export default function MerchandiseBox({merchandiseId, fullname, phone, college, dept, tshirtName, tshirtSize, paymentMethod, verified, status}){

    return (
        <div className={styles.merchandiseBox}>
            {verified===false && <div className={styles.merchandisePendingAnimation}/>}
            <div>
                <h2 className={styles.eventRegisteredName}>{merchandiseId}</h2>
                {/* <Image height={200} width={400} src={`/assets/tshirts/black_front.png`} draggable={false} className={styles.eventRegisteredImage} alt="merchandiseImage"/> */}
                <p>Name: <span>{fullname}</span></p>
                <p>Mobile: <span>{phone}</span></p>
                <p>College: <span>{college}</span></p>
                <p>Dept: <span>{dept}</span></p>
                <p>Name on Tshirt: <span>{tshirtName}</span></p>
                <p>Size of Tshirt: <span>{tshirtSize}</span></p>
                <p>Payment Method: <span>{paymentMethod}</span></p>
                <p>Verification: <span>{verified?"Verified":"Not Verified"}</span></p>
                <p>Status: <span>{status==="accepted"?"Accepted": status==="rejected"?"Rejected":""}</span></p>
            </div>
        </div>
    );
}