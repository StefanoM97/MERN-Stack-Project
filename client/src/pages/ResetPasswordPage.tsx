import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { StatusMessage } from "../components/StatusMessage";
import {
  readSensitiveLinkToken,
  removeSensitiveLinkTokenFromAddressBar
} from "../utils/linkToken";

export function ResetPasswordPage() {
  const [token] = useState<string | null>(
    () => readSensitiveLinkToken()
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refresh } = useAuth();

  useEffect(() => {
    removeSensitiveLinkTokenFromAddressBar();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Reset token is missing");
      return;
    }

    try {
      await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password })
      });
      await refresh();
      navigate("/inventory");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Reset failed"
      );
    }
  }

  return (
    <section className="narrow">
      <h1>Choose a new password</h1>
      <form onSubmit={submit} className="form card">
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            required
          />
        </label>
        <StatusMessage error={error} />
        <button>Reset password</button>
      </form>
    </section>
  );
}
