import {
    signUpAuth,
    loginAuth,
    logoutAuth,
    resetPasswordAuth,
    deleteAuthUser,
  } from "@/lib/auth";
  
  import { createUser, deleteUserDoc } from "@/lib/firestore";
  
  export const signUp = async ({ name, email, password }) => {
    try {
      const userCredential = await signUpAuth(email, password);
      const user = userCredential.user;
  
      await createUser({
        userId: user.uid,
        name,
        email,
        role: "user",
      });
  
      return { user };
  
    } catch (error) {
      return { error: error.message };
    }
  };
  
  export const login = async ({ email, password }) => {
    try {
      const userCredential = await loginAuth(email, password);
      return { user: userCredential.user };
  
    } catch (error) {
      return { error: error.message };
    }
  };
  
  export const logout = async () => {
    try {
      await logoutAuth();
      return { success: true };
  
    } catch (error) {
      return { error: error.message };
    }
  };
  
  export const resetPassword = async (email) => {
    try {
      await resetPasswordAuth(email);
      return { success: true };
  
    } catch (error) {
      return { error: error.message };
    }
  };
  
  export const deleteAccount = async (user) => {
    try {
      const userId = user.uid;
  
      await deleteUserDoc(userId);
      await deleteAuthUser(user);
  
      return { success: true };
  
    } catch (error) {
      return { error: error.message };
    }
  };

  export const mapError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "Email already in use";
      case "auth/invalid-credentials":
        return "Invalid email or password";
      default:
        return "Something went wrong";
    }
  };