import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import toast from "react-hot-toast";

export function useGoogleAuth() {
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        toast.error("Error al iniciar sesión. Intenta de nuevo.");
      }
      return null;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      toast.error("Error al cerrar sesión.");
    }
  };

  return { loginWithGoogle, logout };
}
