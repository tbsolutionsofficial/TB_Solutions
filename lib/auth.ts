import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword as firebaseUpdatePassword,
  updateEmail as firebaseUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export async function changePassword(user: User, currentPassword: string, newPassword: string) {
  const cred = EmailAuthProvider.credential(user.email!, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await firebaseUpdatePassword(user, newPassword);
}

export async function changeEmail(user: User, currentPassword: string, newEmail: string) {
  const cred = EmailAuthProvider.credential(user.email!, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await firebaseUpdateEmail(user, newEmail);
}

export { auth };
