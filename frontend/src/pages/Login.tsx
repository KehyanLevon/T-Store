import { useState, type FormEvent } from "react";
import { useUnit } from "effector-react";
import { Link, useNavigate } from "react-router-dom";
import { loginFx } from "../entities/auth/model";
import { InputField } from "../shared/ui/InputField";
import "./Login.css";

export default function Login() {
  const [login, loginPending] = useUnit([loginFx, loginFx.pending]);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      navigate("/products");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="card">
      <h2 className="card__title">Log in to your account</h2>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Username or Email"
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "-0.5rem",
          }}
        >
          <Link
            to="/forgot-password"
            className="btn btn--muted"
            style={{ padding: "0.25rem 0.5rem", marginBottom: "0.95rem" }}
          >
            Forgot password?
          </Link>
        </div>
        {error && <p className="error">{error}</p>}

        <button
          className="btn btn--primary submit"
          type="submit"
          disabled={loginPending}
        >
          {loginPending ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="card__divider">
        <p className="muted">Don't have an account yet?</p>
        <Link to="/registration" className="btn btn--muted">
          Create an account
        </Link>
      </div>
    </div>
  );
}
