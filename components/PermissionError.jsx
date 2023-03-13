import styles from "../styles/Dashboard.module.css";
import { Canvas } from "@react-three/fiber"
import {OrbitControls, Stars} from "@react-three/drei";


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
            <div className={styles.dashboardContainer}>
                <h2>No Access</h2>
            </div>
        </>
    )
}