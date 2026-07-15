import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { StatusMessage } from "../components/StatusMessage";

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refresh } = useAuth();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password !== confirm) return setError("Passwords do not match");
    const token = params.get("token");
    if (!token) return setError("Reset token is missing");

    try {
      await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password })
      });
      await refresh();
      navigate("/inventory");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Reset failed");
    }
  }

  return (
    <section className="narrow">
      <h1>Choose a new password</h1>
      <form onSubmit={submit} className="form card">
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <label>Confirm password<input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required /></label>
        <StatusMessage error={error} />
        <button>Reset password</button>
      </form>
    </section>
  );
}
