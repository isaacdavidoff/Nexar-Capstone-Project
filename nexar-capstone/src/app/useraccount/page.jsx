"use client";

import useAuthUser from "@/hooks/useAuth";
import { auth, storage, db } from "@/lib/firebase";
import {
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  const isLoading = user === undefined;


  useEffect(() => {
    if (user?.photoURL) setPreview(user.photoURL);
  }, [user?.photoURL]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    const currentUser = auth.currentUser;
    let messages = [];
    let reauthed = false;

    const needsReauth = emailField || passwordField;

    if (needsReauth) {
      if (!currentPassword) {
        messages.push("Current password required for email/password update.");
      } else {
        try {
          const credential = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
          );
          await reauthenticateWithCredential(currentUser, credential);
          reauthed = true;
        } catch (err) {
          messages.push("Reauthentication failed.");
        }
      }
    }


    if (nameField) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { name: nameField });
        messages.push("Name updated.");
        onUpdateInfo?.({ ...user, name: nameField });
      } catch (err) {
        messages.push("Name update failed.");
      }
    }


    if (imageFile) {
    try {
        const imageRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await uploadBytes(imageRef, imageFile);
        const photoURL = await getDownloadURL(imageRef);


        await updateProfile(currentUser, {
        photoURL: photoURL,
        });

        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { photoURL });

        messages.push("Profile picture updated.");

        setPreview(photoURL);
        onUpdateInfo?.({ ...user, photoURL });

    } catch (err) {
        console.error(err);
        messages.push("Image upload failed.");
    }
    }

    if (emailField) {
      try {
        if (!reauthed) throw new Error();
        await updateEmail(currentUser, emailField);
        messages.push("Email updated.");
        onUpdateInfo?.({ ...user, email: emailField });
      } catch (err) {
        messages.push("Email update failed.");
      }
    }

    if (passwordField) {
      try {
        if (!reauthed) throw new Error();
        await updatePassword(currentUser, passwordField);
        messages.push("Password updated.");
        setPassword("");
        setCurrentPassword("");
      } catch (err) {
        messages.push("Password update failed.");
      }
    }

    setMessage(messages.join(" | "));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 flex items-center gap-4">
        <div className="relative">
          <img
            src={preview || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded cursor-pointer">
            Edit
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            {isLoading ? "..." : user?.name || "User"}
          </h2>
          <p className="text-gray-500 text-sm">{isLoading ? "..." : user?.email}</p>
        </div>
      </div>


      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Update Account</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="New Name"
            value={nameField}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            placeholder="New Email"
            value={emailField}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwordField}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Current Password (required for email/password)"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
          >
            Update Profile
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}

      </div>
        <button
            onClick={() => router.back()}
            className="mt-4 mb-6 inline-flex items-center gap-3 px-6 py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-violet-700 hover:shadow-lg transition"
            >
            <span className="text-lg">←</span>
            Back
        </button>
    </div>
  );
}