import styles from "../../styles/Home.module.css";
import Image from "next/image";
export default function AboutPage() {
  return (
    <>
      <div className={styles.homeSectionPage}>
        <div className={styles.homeSectionHeading}>What is Srijan?</div>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutBox}>
            <div className={styles.aboutLeftPart}>
              <Image
                src={"/assets/events/electroniche.png"}
                height={500}
                width={500}
                alt="Srijan_image"
                className={styles.aboutSectionImage}
              />
            </div>
            <div className={styles.aboutRightPart}>
              &emsp;Jadavpur University has always been an epitome of excellence and
              the perfect example of a place meant for holistic development of
              an individual. Ever since 1955, JU has been leading the front, be
              it for technical expertise or cultural prowess. However, some time
              back in 2007, few individuals of the Faculty of Engineering and
              Technology at Jadavpur University grew restless thinking of how JU
              despite being an ocean of scientific mastery, was not contributing
              towards a platform for technical recreation. Every body could do
              classes, attend labs, have an 'adda' at the field, crack complex
              research problems, or make merry dancing to songs at a fest. But
              as a leading technical institution, how was JU enabling others to
              explore their technical selves through recreation? Thus, SRIJAN
              was conceived. :) SRIJAN has always dedicated itself to the idea
              of promoting, showcasing, and encouraging concepts and research
              beyond the known periphery. Oddities are cheered, out-of-the-box
              thinking is lauded, and most importantly a platform is given to
              translate technical knowledge into realistic applications. SRIJAN
              has in its objectives to reflect the respect Jadavpur University
              commands in form of the talent supportive acts it anchors. Today,
              SRIJAN stands proudly as the biggest and most prestigious
              techno-management fest in the City of Joy. Being a part of SRIJAN
              is like working at a startup: there are no fixed methods of
              working, you do not know whether your experiments will succeed,
              everyone has to do all kinds of work, you have to be bonded
              strongly to your teammates, and the learning and exposure is
              immense! :) 1955 to 2007 might have been a long time for SRIJAN to
              come into being, but 2007 to 2018 have been years of putting
              together blood and sweat to establish our beloved
              techno-management fest. Our track record is not a license to rest,
              but a challenge from our predecessors which we gladly accept. A
              shout-out to all our lovely seniors who worked day in and day out
              to make SRIJAN the favorite destination for all the dreamers and
              believers ! A month away from SRIJAN 2018, today we retrospect
              contact what has gone and introspect contact what is to come. With
              arms wide open, we invite everyone to come join us for 3 days of
              innovation, fun, recreation, brainstorming, productivity, and
              merry! We invite you to F.E.T.S.U. presents SRIJAN 2018.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
