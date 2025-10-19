import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useUnit } from "effector-react";
import { $user, updateProfileFx } from "../entities/auth/model";
import { forgotPasswordFx } from "../entities/passwordReset/model";
import {
  ProfileFields,
  type ProfileFormState,
} from "../components/Account/ProfileFields";
import { PasswordReset } from "../components/Account/PasswordReset";
import { PhotoUploader } from "../components/Account/PhotoUploader";
import "./Account.css";

export default function Account() {
  const [user, updateProfile, pending] = useUnit([
    $user,
    updateProfileFx,
    updateProfileFx.pending,
  ]);

  const [sendResetLink, sending] = useUnit([
    forgotPasswordFx,
    forgotPasswordFx.pending,
  ]);

  const [form, setForm] = useState<ProfileFormState>({
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  const [photoBase64, setPhotoBase64] = useState<string | undefined>();
  const [photoMime, setPhotoMime] = useState<string | undefined>();
  const [removePhoto, setRemovePhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      birthDate: (user.birthDate as string) || "",
    });

    if (user.photo && user.photoMime) {
      setPhotoBase64(user.photo);
      setPhotoMime(user.photoMime);
      setRemovePhoto(false);
    } else {
      setPhotoBase64(undefined);
      setPhotoMime(undefined);
    }
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePhotoChange({
    base64,
    mime,
  }: {
    base64?: string;
    mime?: string;
  }) {
    setPhotoBase64(base64);
    setPhotoMime(mime);
    setRemovePhoto(false);
  }

  function handleRemovePhoto() {
    setPhotoBase64(undefined);
    setPhotoMime(undefined);
    setRemovePhoto(true);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        birthDate: form.birthDate || undefined,
        photoBase64,
        photoMime,
        removePhoto,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    }
  }

  if (!user) return null;

  return (
    <div className="card" style={{ maxWidth: "48rem" }}>
      <h1>Edit Profile</h1>
      <p>Update your personal information and profile picture.</p>

      <form onSubmit={handleSubmit}>
        <ProfileFields form={form} onChange={handleChange} />

        <PasswordReset
          email={user.email}
          onSendReset={sendResetLink}
          pending={sending}
        />

        <PhotoUploader
          photoBase64={photoBase64}
          photoMime={photoMime}
          onChange={handlePhotoChange}
          onRemove={handleRemovePhoto}
          onError={setError}
        />

        {error && <p className="error">{error}</p>}

        <button
          className="btn btn--primary submit"
          type="submit"
          disabled={pending}
        >
          {pending ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
