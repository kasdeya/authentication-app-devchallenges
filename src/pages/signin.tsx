import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getServerSession } from "next-auth";
import { getProviders, getSession, getCsrfToken, signIn } from "next-auth/react"
import { useEffect, useState } from "react"
import { authOptions } from "~/server/auth";
import styles from "../styles/Signin.module.css"
import Image from "next/image";
import githubPic from "../../public/Gihub.svg"
import devChallengesLogo from "../../public/devchallenges.svg"
import Link from "next/link";

export default function signin({ providers, csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <Image src="/devchallenges.svg" width={130} height={18} alt="logo" />
                <p>Login</p>
          <form className={styles.form} method="post" action="/api/auth/callback/credentials">
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                    <input placeholder="Email" name="email" type="text" />
                    <input placeholder="Password" name="password" type="password" />
                <button className={styles.loginButton} type="submit">Login</button>
            </form>

                <p>or continue with these social profile</p>
                <div className={styles.socialContainer} >
            {Object.values(providers).map((provider) => {
                if (provider.name != "Credentials") return (
                    <div  key={provider.name}>
                        <button onClick={() => void signIn(provider.id)}>
                            <Image src='/Gihub.svg' alt="github" width="45" height="45" />
                        </button>
                    </div>
                )
            })}
                </div>
                <p>Don&apos;t have an account yet? <Link href='/signup'>Register</Link></p>
            </div>
            <p>created by Jesus Venegas</p>
            <p>devChallenges.io</p>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (session) {
        return { redirect: { destination: "/" } }
    }

    const providers = await getProviders();
    const csrfToken = await getCsrfToken(context)

    return {
        props: {
            providers: providers ?? [],
            csrfToken: await getCsrfToken(context)
        },
    }
}