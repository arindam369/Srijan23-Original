import styles from "../styles/Dashboard.module.css";
import { Canvas } from "@react-three/fiber"
import {OrbitControls, Stars} from "@react-three/drei";
import Image from "next/image";


export default function PermissionDeniedPage(){
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
            <div className={styles.dashboardPageContainer}>
                <div className={styles.permissionDeniedBox}>
                    <Image height={100} width={200} alt="error403" src={"/assets/block_error.jpg"} className={styles.noPermissionImage} draggable={false}/>
                    <h2 className={styles.noAccess}>Permission Denied: You have no permission to access this page</h2>
                </div>
            </div>
        </>
    )
}