import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useUnit } from "effector-react";
import { $user, updateProfileFx } from "../entities/auth/model";
import { InputField } from "../shared/ui/InputField";
import { forgotPasswordFx } from "../entities/passwordReset/model";
import "./Account.css";
import fileToBase64 from "../shared/utils/fileToBase64";

export default function Account() {
  const [user, updateProfile, pending] = useUnit([
    $user,
    updateProfileFx,
    updateProfileFx.pending,
  ]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  const [photoBase64, setPhotoBase64] = useState<string | undefined>();
  const [photoMime, setPhotoMime] = useState<string | undefined>();
  const [removePhoto, setRemovePhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
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
    }
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("The file must be an image");
        return;
      }
      const MAX_MB = 5;
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`The file is too large (>${MAX_MB}MB)`);
        return;
      }

      const { base64, mime } = await fileToBase64(file);
      setPhotoBase64(base64);
      setPhotoMime(mime);
      setRemovePhoto(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to read file");
    }
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
      setError(err.message || "Failed to update profile");
    }
  }

  const [sendResetLink, sending] = useUnit([
    forgotPasswordFx,
    forgotPasswordFx.pending,
  ]);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  if (!user) return null;
  return (
    <div className="card" style={{ maxWidth: "48rem" }}>
      <h1>Edit Profile</h1>
      <p>Update your personal information and profile picture.</p>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <InputField
            label="First Name"
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange}
            style={{
              width: "79%",
            }}
          />

          <InputField
            label="Last Name"
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange}
            style={{
              width: "79%",
            }}
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            className="input"
            id="password"
            name="password"
            type="password"
            value="........"
            readOnly
          />
          <div className="forgot">
            <a
              href="#"
              onClick={async (e) => {
                e.preventDefault();
                setPwdMsg(null);
                try {
                  if (!user?.email) throw new Error("No email in profile");
                  await sendResetLink(user.email);
                  setPwdMsg(
                    "If that email exists, a reset link has been sent."
                  );
                } catch (err: any) {
                  setPwdMsg(err.message || "Failed to send reset link");
                }
              }}
            >
              {sending ? "Sending..." : "Change Password"}
            </a>
          </div>
          {pwdMsg && <p className="muted">{pwdMsg}</p>}
        </div>

        <InputField
          label="Date of Birth"
          id="birthDate"
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
        />

        <div className="field">
          <label className="label">Profile Photo</label>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="avatar-preview">
              {photoBase64 && photoMime ? (
                <img
                  src={`data:${photoMime};base64,${photoBase64}`}
                  alt="avatar"
                />
              ) : (
                <div className="avatar-empty" />
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <label className="btn btn--muted" style={{ cursor: "pointer" }}>
                Change
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  style={{ display: "none" }}
                />
              </label>

              <button
                type="button"
                className="btn btn--muted"
                onClick={handleRemovePhoto}
                disabled={!photoBase64}
              >
                Remove
              </button>
            </div>
          </div>
        </div>

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
