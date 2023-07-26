import axios from "axios";
import styles from "../styles/Edit.module.css"
import { SessionProvider, getSession, signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Nav from "~/components/Nav";
import { getServerAuthSession } from "~/server/auth";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Link from "next/link";

export default function Edit() {
 
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
            <AuthShowcase  />
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData, update } = useSession({
    required: true,
    onUnauthenticated() {
      router
      .push('/signin')
      .catch((error) => console.error('Error navigating to sign in page: ' + String(error)))
    }
  });

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState<File | undefined | null>(undefined)

  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const { mutateAsync: fetchPresignedUrls } = api.s3.getStandardUploadPresignedUrl.useMutation();
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const apiUtils = api.useContext()


  useEffect(() => {
  if (sessionData?.user) {
    setName(sessionData.user.name || '');
    setEmail(sessionData.user.email || '');
    setBio(sessionData.user.bio || '');
    setPhone(sessionData.user.phone || '');
    setPassword(sessionData.user.password || '');
  }
}, [sessionData]);

  const editUser = api.updateUser.updateUser.useMutation();
    const router = useRouter()

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    // Fix submitting form even without image change
    if (!sessionData?.user.userId || !sessionData) return;
    e.preventDefault();
    let imageUrl = sessionData.user.image

    try {

      if (presignedUrl && image) {
        await axios.put(presignedUrl, image.slice(), {
          headers: { "Content-Type": image.type },
        });
        console.log("Successfully uploaded ", image.name);

        imageUrl = `https://auth-app-profile-pics.s3.us-west-1.amazonaws.com/${image.name}`;
        console.log(imageUrl)
      }

        // Update user data after the image is uploaded
        try {
          editUser.mutate({
            id: sessionData.user.userId,
            name: name,
            email: email,
            bio: bio,
            phone: phone,
            password: password,
            image: imageUrl,
          });

          // Update sessionData after the user data is edited
          // sessionData.user.name = name;
          // sessionData.user.email = email;
          // sessionData.user.bio = bio;
          // sessionData.user.phone = phone;
          // sessionData.user.password = password;
          // sessionData.user.image = imageUrl;
          // update({name: name, email: email, bio: bio, phone: phone, password: password, image: imageUrl})
          //  update()
          console.log("User data updated");
        } catch (error) {
          console.log("Error editing user data:", error);
        }
         await signOut()
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  }, [presignedUrl, image, name, email, bio, phone, password, sessionData]);

  // Fetch presigned URL when the image changes
  useEffect(() => {
    if (image) {
      fetchPresignedUrls({ key: image.name })
        .then((url) => {
          setPresignedUrl(url);
        })
        .catch((err) => console.error(err));
    }
  }, [image]);

  return (
    <>

    <div className={styles.backBtnContainer}>
        <Link className={styles.backBtn} href="/"><ArrowBackIosIcon /> Back</Link>
    </div>
      <div className={styles.editProfileContainer}>
        <form onSubmit={() => void handleSubmit}>
        <div className={styles.top}>
          <div className={styles.topDivGap}>
      <h1 className={styles.bigFont}>Change info</h1>
      <p className={styles.semiLightFont}>Changes will be reflected to every services</p>
          </div>
        </div>
        <div className="changePhotoDiv">
          <label htmlFor="photo" className={styles.photoLabel} style={{backgroundImage: `url(${sessionData?.user.image || ""})`}}>
          <PhotoCameraIcon />
          </label>
          <p>CHANGE PHOTO</p>
          {/* <img src={sessionData?.user.image} alt="" /> */}
          <input id="photo" name="photo" type="file" src="" alt="" onChange={(e) => e.target.files ? setImage(e.target.files[0]) : null} />
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <p>{sessionData?.user.name}</p>
          <input placeholder="Enter your name..." id="name" name="name" type="text"  onChange={(e) => setName(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="bio">Bio</label>
          <p>{sessionData?.user.bio}</p>
          <input placeholder="Enter your bio..." id="bio" name="bio" type="text" onChange={(e) => setBio(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <p>{sessionData?.user.phone}</p>
          <input placeholder="Enter your phone..." id="phone" name="phone" type="text" onChange={(e) => setPhone(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <p>{sessionData?.user.email}</p>
          <input placeholder="Enter your email..." id="email" name="email" type="email" onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <p>{sessionData?.user.password}</p>
          <input placeholder="Enter your password..." id="password" name="password" type="text" onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div>
            <button className={styles.submitBtn}>Save</button>
        </div>
        </form>
      </div>
  </>
  );
}
