import Loader from "@/components/Loader";
import RegisterPage2 from "@/components/Register/Register2";
import Head from "next/head";

export default function RegisterPage(){
    return(
        <>
            <Head>
                <link rel="manifest" href="manifest.json" />
            </Head>
            <RegisterPage2/>
            {/* <Loader/> */}
        </>
    )
}