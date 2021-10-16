import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";



export function handleRegistration(email: string, password: string) {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = { ...user };
      console.log(userData.email);
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`${errorCode} - ${errorMessage}`);
      throw new Error(`${errorCode} - ${errorMessage}`);
    });
}

export const handleLogin = (email: string, password: string) => {
  const auth = getAuth();
  const data = signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user.uid;
    })
    .catch((error: Error) => {
      const errorMessage = error.message;
      alert(errorMessage)
    });
  return data;
}
