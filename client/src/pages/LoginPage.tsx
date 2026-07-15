import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { StatusMessage } from "../components/StatusMessage";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const googleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  async function finishLogin() {
    await refresh();
    navigate("/inventory");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      await finishLogin();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Login failed");
    }
  }

  return (
    <section className="narrow">
      <h1>Log in</h1>
      <form onSubmit={submit} className="form card">
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <StatusMessage error={error} />
        <button>Log in</button>
        {googleConfigured && (
          <GoogleLogin
            onSuccess={async ({ credential }) => {
              if (!credential) return;
              try {
                await api("/auth/google", {
                  method: "POST",
                  body: JSON.stringify({ credential })
                });
                await finishLogin();
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : "Google login failed");
              }
            }}
            onError={() => setError("Google login failed")}
          />
        )}
        <p><Link to="/forgot-password">Forgot password?</Link></p>
        <p>Need an account? <Link to="/register">Register</Link></p>
      </form>
    </section>
  );
}
