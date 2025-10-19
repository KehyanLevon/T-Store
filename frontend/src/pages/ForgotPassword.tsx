import { useState, type FormEvent } from "react";
import { useUnit } from "effector-react";
import {
  forgotPasswordFx,
  $forgotPending,
} from "../entities/passwordReset/model";
import { InputField } from "../shared/ui/InputField";

export default function ForgotPassword() {
  const [send, pending] = useUnit([forgotPasswordFx, $forgotPending]);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await send(email);
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <h2 className="card__title">Forgot password</h2>

      {done ? (
        <p className="muted">
          If that email exists, a reset link has been sent. Please check your
          inbox.
        </p>
      ) : (
        <form onSubmit={onSubmit}>
          <InputField
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button
            className="btn btn--primary submit"
            type="submit"
            disabled={pending}
          >
            {pending ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </div>
  );
}
