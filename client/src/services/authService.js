import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
const auth = getAuth();

export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
