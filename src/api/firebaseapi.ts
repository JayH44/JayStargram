import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { deleteDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { auth, googleProvider, storageFirebase } from '../firebase';

export const signUpFirebase = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredential);
    await updateProfile(userCredential.user, {
      displayName: name,
    });
    return userCredential.user.displayName;
  } catch (error: any) {
    alert(
      `회원가입중 오류가 발생했습니다.
오류유형: ${error.code} 
오류메세지: ${error.message}`
    );
    throw new Error(`${error.code}, ${error.message}`);
  }
};

export const loginFirebase = async (email: string, password: string) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error: any) {
    alert(
      `로그인에 실패했습니다.
    오류유형: ${error.code} 
    오류메세지: ${error.message}`
    );
    throw new Error(`${error.code}, ${error.message}`);
  }
};

export const logoutFirebase = () => {
  signOut(auth)
    .then(() => {
      alert('로그아웃 되었습니다.');
    })
    .catch((error) => {
      alert(
        `로그아웃에 실패했습니다.
          오류유형: ${error.code} 
          오류메세지: ${error.message}`
      );
      throw new Error(`${error.code}, ${error.message}`);
    });
};

export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      const token = credential.accessToken;
      const user = result.user;
    }
    return result;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(error);
  }
};

export const uploadFirebase = async (file: File, location: string) => {
  const { name, type } = file;
  const fileRef = ref(storageFirebase, 'images/' + location + '/' + name);

  const metadata = {
    contentType: type,
  };

  await uploadBytes(fileRef, file, metadata);

  const url = await getDownloadURL(fileRef);
  return url;
};

export const deleteFirestore = async (location: string) => {
  const desertRef = ref(storageFirebase, location);

  deleteObject(desertRef)
    .then(() => {
      alert('사진이 삭제되었습니다.');
    })
    .catch((error) => {
      console.log(error);
    });
};
