"use client";

import useAuthUser from "@/hooks/useAuth";
import { auth, storage, db } from "@/lib/firebase";
import {
  updateEmail,
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserAccount({ onUpdateInfo }) {
  const user = useAuthUser();
  const router = useRouter();
  
  const [nameField, setName] = useState("");
  const [emailField, setEmail] = useState("");
  const [passwordField, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isUserLoading = user === undefined;

  useEffect(() => {
    return () => {
      // Only revoke if it's a temporary blob URL
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Clean up the OLD preview URL to free up memory
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    // 2. Set the new file and create a new preview URL
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    setLoading(true);
    const currentUser = auth.currentUser;
    let messages = [];
    let reauthed = false;

    // 1. Reauthentication Logic
    const needsReauth = emailField || passwordField;
    if (needsReauth) {
      if (!currentPassword) {
        messages.push("Current password required for secure updates.");
        setMessage(messages.join(" | "));
        setLoading(false);
        return;
      }
      try {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        reauthed = true;
      } catch (err) {
        messages.push("Current password incorrect.");
        setMessage(messages.join(" | "));
        setLoading(false);
        return;
      }
    }

    // 2. Name Update (Firestore)
    if (nameField) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { name: nameField });
        messages.push("Name updated");
        onUpdateInfo?.({ ...user, name: nameField });
      } catch (err) {
        messages.push("Name update failed");
      }
    }

    // 3. Profile Picture Update (Storage + Auth + Firestore)
    if (imageFile) {
      try {
        const imageRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await uploadBytes(imageRef, imageFile);
        const photoURL = await getDownloadURL(imageRef);

        await updateProfile(currentUser, { photoURL });
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { photoURL });

        messages.push("Photo updated");
        setPreview(photoURL);
        onUpdateInfo?.({ ...user, photoURL });
      } catch (err) {
        messages.push("Image upload failed");
      }
    }

    // 4. Sensitive Updates (Email/Password)
    if (emailField && reauthed) {
      try {
        await updateEmail(currentUser, emailField);
        messages.push("Email updated");
        onUpdateInfo?.({ ...user, email: emailField });
      } catch (err) {
        messages.push("Email change failed");
      }
    }

    if (passwordField && reauthed) {
      try {
        await updatePassword(currentUser, passwordField);
        messages.push("Password updated");
        setPassword("");
      } catch (err) {
        messages.push("Password change failed");
      }
    }

    setMessage(messages.length > 0 ? messages.join(" • ") : "No changes made.");
    setCurrentPassword(""); // Clear sensitive field
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      {/* Header / Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white shadow-sm rounded-full border border-neutral-100 hover:bg-neutral-50 transition"
        >
          <span className="text-xl leading-none">←</span>
        </button>
        <h1 className="text-xl font-black text-neutral-900">Account Settings</h1>
      </div>

      {/* Profile Info Preview */}
      <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-8 mb-6 flex items-center gap-6">
        <div className="relative group">
          <Image
            src={preview || "/default-avatar.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-50 transition-all group-hover:ring-indigo-100"
            width={80}
            height={80}
          />
          <label className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <div>
          <h2 className="text-2xl font-black text-neutral-900 leading-tight">
            {isUserLoading ? "..." : user?.name || "Member"}
          </h2>
          <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest mt-1">
            {isUserLoading ? "..." : user?.email}
          </p>
        </div>
      </div>

      {/* Update Form */}
      <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-8">
        <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-6">Security & Identity</h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">Full Name</label>
            <input
              type="text"
              placeholder="Update your name"
              value={nameField}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl p-4 text-sm font-medium focus:border-indigo-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">New Email</label>
              <input
                type="email"
                placeholder="new@email.com"
                value={emailField}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl p-4 text-sm font-medium focus:border-indigo-500 focus:bg-white outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordField}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl p-4 text-sm font-medium focus:border-indigo-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-50">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-indigo-500 ml-1">Verification Required</label>
              <input
                type="password"
                placeholder="Enter current password to authorize"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-indigo-50/30 border-2 border-indigo-100 rounded-2xl p-4 text-sm font-medium focus:border-indigo-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Syncing..." : "Update Account"}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-tighter">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}