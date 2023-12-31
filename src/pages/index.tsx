import styles from "./index.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Nav from "~/components/Nav";

export default function Home() {

  return (
    <>
      <Head>
        <title>Authentication App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav></Nav>
      <main className={styles.main}>
        <div className={styles.container}>
            <AuthShowcase />
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
    const router = useRouter()
  const { data: sessionData } = useSession({required: true,
    onUnauthenticated() {
      router
      .push('/signin')
      .catch((error) => console.error('Error navigating to sign in page: ' + String(error)))
    }
});

  // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined }
  // );

  return (
    <>
      <h1 className={styles.titleFont}>Personal Info</h1>
      <p className={styles.underTitle}>Basic info, like your name and photo</p>

      <div className={styles.profileContainer}>
        <div className={styles.top}>
          <div>
            <p className={styles.bigFont}>Profile</p>
            <p className={styles.semiLightFont}>Some info may be visible to other people</p>
          </div>
          <Link href="/edit">Edit</Link>
        </div>
        <div>
          <p className={styles.lightFont}>Photo</p>
          <img src={sessionData?.user.image} alt="" />
        </div>
        <div>
          <p className={styles.lightFont}>Name</p>
          <p>{sessionData?.user.name}</p>
        </div>
        <div>
          <p className={styles.lightFont}>Bio</p>
          <p>{sessionData?.user.bio}</p>
        </div>
        <div>
          <p className={styles.lightFont}>Phone</p>
          <p>{sessionData?.user.phone}</p>
        </div>
        <div>
          <p className={styles.lightFont}>Email</p>
          <p>{sessionData?.user.email}</p>
        </div>
        <div>
          <p className={styles.lightFont}>Password</p>
          <p>{sessionData?.user.password}</p>
        </div>
      </div>
</>
  );
}
