import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import { auth } from "./firebase";

export const signUpAuth = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginAuth = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutAuth = () => signOut(auth);

export const resetPasswordAuth = (email) =>
  sendPasswordResetEmail(auth, email);

export const deleteAuthUser = (user) => deleteUser(user);