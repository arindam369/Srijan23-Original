import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import styles from "../../styles/Home.module.css";
import Teams from "@/components/Home/Team";



export default function TeamPage(){
    return (
        <>
            <div className={styles.canvasContainer}>
                <Canvas>
                    <Stars />
                    <OrbitControls
                        enableZoom={false}
                        enableRotate={false}
                        enableDamping={false}
                        enablePan={false}
                        rotateSpeed={0.4}
                        autoRotate={true}
                        autoRotateSpeed={0.5}
                    />
                    <ambientLight intensity={1.5} />
                    <spotLight position={[10, 15, 10]} angle={0.3} />
                </Canvas>
            </div>
            {/* <div className={styles.teamContainer}>
                <div className={styles.teamBox}>
                    
                </div>
            </div> */}
            <div className={styles.merchandiseContainer}>
                <div className={styles.merchandiseHeading}>
                Srijan'23 Team
                </div>

                <div className={styles.merchandiseBody}>
                    <Teams/>
                </div>
            </div>
        </>
    )
}