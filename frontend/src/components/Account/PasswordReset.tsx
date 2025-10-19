import { useState } from "react";

interface PasswordResetProps {
  email?: string | null;
  onSendReset: (email: string) => Promise<void>;
  pending: boolean;
}

export function PasswordReset({
  email,
  onSendReset,
  pending,
}: PasswordResetProps) {
  const [msg, setMsg] = useState<string | null>(null);

  return (
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
            setMsg(null);
            try {
              if (!email) throw new Error("No email in profile");
              await onSendReset(email);
              setMsg("If that email exists, a reset link has been sent.");
            } catch (err: any) {
              setMsg(err?.message || "Failed to send reset link");
            }
          }}
        >
          {pending ? "Sending..." : "Change Password"}
        </a>
      </div>

      {msg && <p className="muted">{msg}</p>}
    </div>
  );
}
