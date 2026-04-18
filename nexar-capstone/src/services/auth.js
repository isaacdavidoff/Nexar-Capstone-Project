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
  
      return { data: user, error: null };
  
    } catch (error) {
      return { data: null, error: mapError(error.code || "") };
    }
  };
  
  export const login = async ({ email, password }) => {
    try {
      const userCredential = await loginAuth(email, password);
      return { data: userCredential.user, error: null };
  
    } catch (error) {
      return { data: null, error: mapError(error.code || "") };
    }
  };
  
  export const logout = async () => {
    try {
      await logoutAuth();
      return { data: true, error: null };
  
    } catch (error) {
      return { data: null, error: mapError(error.code || "") };
    }
  };
  
  export const resetPassword = async (email) => {
    try {
      await resetPasswordAuth(email);
      return { data: true, error: null };
  
    } catch (error) {
      return { data: null, error: mapError(error.code || "") };
    }
  };

export const deleteAccount = async (user) => {
  try {
    const userId = user.uid;

    await deleteUserDoc(userId);
    await deleteAuthUser(user);

    return { data: true, error: null };

  } catch (error) {
    return { data: null, error: mapError(error.code || "") };
  }
};

  export const mapError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered.";
      case "auth/invalid-credentials":
      case "auth/wrong-password":
        return "Invalid email or password.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
        case "auth/requires-recent-login":
  return "Please log in again before deleting your account.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  // TODO: delete all user-related data (tasks, courses, sessions)