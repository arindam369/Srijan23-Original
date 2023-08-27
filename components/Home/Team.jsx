import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import styles from "../../styles/Home.module.css";
import styles2 from "../../styles/Dashboard.module.css";

export default function Teams(){



    return (
        <>
            <div className={styles2.sponsorsContainer}>
                <h3 className={styles.teamHeadline}>Executive Members</h3>

                <div className={styles.teamSection}>
                    <div className={styles.memberCard}>
                        <Image
                            src={"/assets/team/chirag_jaiswal.jpeg"}
                            height={500}
                            width={500}
                            alt="member_image"
                            className={styles.memberImage}
                        />
                        <div className={styles.memberDesc}>
                            <a href="https://www.linkedin.com/in/chirag-jaiswal-76330b19a" target="_blank" rel="noopener noreferrer">
                                <div className={styles.memberTitle}>Chirag Jaiswal</div>
                            </a>
                            <div className={styles.memberCotitle}>Co-President</div>
                            <div className={styles.memberCotitle}>CodeClub | JUSL</div>
                        </div>
                    </div>
                    <div className={styles.memberCard}>
                        <Image
                            src={"/assets/team/priyam_raj.jpeg"}
                            height={500}
                            width={500}
                            alt="member_image"
                            className={styles.memberImage}
                        />
                        <div className={styles.memberDesc}>
                            <a href="https://www.linkedin.com/in/priyam-raj-ju" target="_blank" rel="noopener noreferrer">
                                <div className={styles.memberTitle}>Priyam Raj</div>
                            </a>
                            <div className={styles.memberCotitle}>Co-President</div>
                            <div className={styles.memberCotitle}>CodeClub | JUSL</div>
                        </div>
                    </div>
                    <div className={styles.memberCard}>
                        <Image
                            src={"/assets/team/shatadru_barua.jpeg"}
                            height={500}
                            width={500}
                            alt="member_image"
                            className={styles.memberImage}
                        />
                        <div className={styles.memberDesc}>
                            <a href="https://www.linkedin.com/in/shatadru22" target="_blank" rel="noopener noreferrer">
                                <div className={styles.memberTitle}>Shatadru Barua</div>
                            </a>
                            <div className={styles.memberCotitle}>Secretary</div>
                            <div className={styles.memberCotitle}>CodeClub | JUSL</div>
                        </div>
                    </div>
                    <div className={styles.memberCard}>
                        <Image
                            src={"/assets/team/vineet_kothari.jpeg"}
                            height={500}
                            width={500}
                            alt="member_image"
                            className={styles.memberImage}
                        />
                        <div className={styles.memberDesc}>
                            <a href="https://www.linkedin.com/in/vineet-kothari-070a5b195" target="_blank" rel="noopener noreferrer">
                                <div className={styles.memberTitle}>Vineet Kothari</div>
                            </a>
                            <div className={styles.memberCotitle}>Technical Lead</div>
                            <div className={styles.memberCotitle}>CodeClub | JUSL</div>
                        </div>
                    </div>
                    <div className={styles.memberCard}>
                        <Image
                            src={"/assets/team/ishita_mundhra.jpeg"}
                            height={500}
                            width={500}
                            alt="member_image"
                            className={styles.memberImage}
                        />
                        <div className={styles.memberDesc}>
                            <a href="https://www.linkedin.com/in/ishita-mundhra-b0a11b1a1" target="_blank" rel="noopener noreferrer">
                                <div className={styles.memberTitle}>Ishita Mundhra</div>
                            </a>
                            <div className={styles.memberCotitle}>Vice President</div>
                            <div className={styles.memberCotitle}>CodeClub | JUSL</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}