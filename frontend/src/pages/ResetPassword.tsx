import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useUnit } from "effector-react";
import {
  verifyResetTokenFx,
  changePasswordFx,
  $verifyPending,
  $changePending,
} from "../entities/passwordReset/model";
import { InputField } from "../shared/ui/InputField";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get("token") || "";

  const [verify, change, verifyPending, changePending] = useUnit([
    verifyResetTokenFx,
    changePasswordFx,
    $verifyPending,
    $changePending,
  ]);

  const [stepVerified, setStepVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setError(null);
      try {
        if (!token) throw new Error("Missing token");
        await verify(token);
        if (!mounted) return;
        setStepVerified(true);
        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        window.history.replaceState(null, "", url.toString());
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Invalid or expired token");
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [token, verify]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (pwd1.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    if (pwd1 !== pwd2) {
      setLocalError("Passwords do not match");
      return;
    }
    try {
      await change(pwd1);
      setDone(true);
      setTimeout(() => navigate("/login"), 1000);
    } catch (err: any) {
      setLocalError(err.message || "Failed to change password");
    }
  }

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <h2 className="card__title">Reset password</h2>

      {!stepVerified ? (
        error ? (
          <p className="error">{error}</p>
        ) : (
          <p className="muted">
            Verifying your reset link...
            {verifyPending ? "" : ""}
          </p>
        )
      ) : done ? (
        <p className="muted">
          Password changed successfully. You can now log in.
        </p>
      ) : (
        <form onSubmit={onSubmit}>
          <InputField
            label="New password"
            id="newPwd"
            name="newPwd"
            type="password"
            placeholder="••••••••"
            value={pwd1}
            onChange={(e) => setPwd1(e.target.value)}
          />
          <InputField
            label="Confirm new password"
            id="newPwd2"
            name="newPwd2"
            type="password"
            placeholder="••••••••"
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
          />
          {(localError || error) && (
            <p className="error">{localError || error}</p>
          )}
          <button
            className="btn btn--primary submit"
            type="submit"
            disabled={changePending}
          >
            {changePending ? "Saving..." : "Reset password"}
          </button>
        </form>
      )}
    </div>
  );
}
