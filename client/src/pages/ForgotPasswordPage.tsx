import { useState } from "react";
import { api } from "../api/client";
import { StatusMessage } from "../components/StatusMessage";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const data = await api<{ message: string; developmentResetUrl?: string }>(
        "/auth/forgot-password",
        { method: "POST", body: JSON.stringify({ email }) }
      );
      setMessage(data.message);
      setLink(data.developmentResetUrl || "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed");
    }
  }

  return (
    <section className="narrow">
      <h1>Reset password</h1>
      <form onSubmit={submit} className="form card">
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <button>Send reset link</button>
        <StatusMessage error={error} success={message} />
        {link && <p><a href={link}>Development-only reset link</a></p>}
      </form>
    </section>
  );
}
