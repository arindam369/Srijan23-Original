import { Canvas } from "@react-three/fiber"
import {OrbitControls, Stars} from "@react-three/drei";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function ErrorPage(){
    const router = useRouter();
    const goToHomepage = ()=>{
        router.push("/register");
    }
    return (
        <>
            <div className={styles.canvasContainer}>
                <Canvas>
                    <Stars/>
                    {/* <Plane/> */}
                    <OrbitControls
                        enableZoom={false}
                        rotateSpeed={0.4}
                        autoRotate={true}
                        autoRotateSpeed={0.5}
                    />
                    <ambientLight intensity={1.5}/>
                    <spotLight position={[10, 15, 10]} angle={0.3} />
                </Canvas>
            </div>
            <div className={styles.errorPage}>

                <div className={styles.errorContainer}>
                    <h1>Oops!</h1>
                    <h4>We're sorry but it looks like the page you are looking for no longer exists</h4>
                    <button onClick={goToHomepage}>GO TO HOMEPAGE</button>
                </div>
            </div>
        </>
    );
}