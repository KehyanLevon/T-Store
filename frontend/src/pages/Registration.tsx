import type { FormEvent } from "react";
import { useState } from "react";
import { useUnit } from "effector-react";
import { useNavigate } from "react-router-dom";
import { registerFx } from "../entities/auth/model";
import { InputField } from "../shared/ui/InputField";
import "./Registration.css";
import fileToBase64 from "../shared/utils/fileToBase64";

export default function Registration() {
  const [register, registerPending] = useUnit([registerFx, registerFx.pending]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
  });
  const [photoBase64, setPhotoBase64] = useState<string | undefined>();
  const [photoMime, setPhotoMime] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to read file");
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        birthDate: form.birthDate || undefined,
        photoBase64,
        photoMime,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  }

  return (
    <div className="card">
      <h1>Create your account</h1>
      <p>Join our community of creators and discover amazing products.</p>

      <form onSubmit={handleSubmit}>
        <InputField
          label="First name"
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Liam"
          value={form.firstName}
          onChange={handleChange}
        />

        <InputField
          label="Last name"
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Harper"
          value={form.lastName}
          onChange={handleChange}
        />

        <InputField
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="liam.harper@email.com"
          value={form.email}
          onChange={handleChange}
        />

        <InputField
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
        />

        <InputField
          label="Date of birth (Optional)"
          id="birthDate"
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
        />

        <div className="field">
          <label className="label" htmlFor="photo">
            Profile photo (Optional)
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={handleFile}
          />
          {photoBase64 && (
            <img
              src={`data:${photoMime};base64,${photoBase64}`}
              alt="preview"
              style={{ maxWidth: 120 }}
            />
          )}
        </div>
        {/* TODO: How about making validation more interactive? See example in dealer desk reset password form*/}
        {error && <p className="error">{error}</p>}

        <button
          className="btn btn--primary submit"
          type="submit"
          disabled={registerPending}
        >
          {registerPending ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <p className="legal">
        By continuing, you agree to our
        <a href="#"> Terms of Service</a> and acknowledge our
        <a href="#"> Privacy Policy</a>.
      </p>
    </div>
  );
}
