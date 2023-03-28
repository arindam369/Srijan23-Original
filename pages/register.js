import AboutPage from "@/components/Home/About";
import Timeline from "@/components/Home/Timeline";
import Loader from "@/components/Loader";
import Login from "@/components/Register/Login";
import RegisterPage2 from "@/components/Register/Register2";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function RegisterPage(){
    return(
        <>
            <Head>
                <link rel="manifest" href="manifest.json" />
            </Head>
            <div className={styles.homeRegisterPage}>
                <RegisterPage2/>
                {/* <AboutPage/> */}
                {/* <Timeline/> */}
            </div>
        </>
    )
}