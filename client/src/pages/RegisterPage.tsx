import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { StatusMessage } from "../components/StatusMessage";

export function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    communityName: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [developmentLink, setDevelopmentLink] = useState("");

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setDevelopmentLink("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const result = await api<{ message: string; developmentVerificationUrl?: string }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            communityName: form.communityName
          })
        }
      );
      setMessage(result.message);
      setDevelopmentLink(result.developmentVerificationUrl || "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Registration failed");
    }
  }

  return (
    <section className="narrow">
      <h1>Create account</h1>
      <form onSubmit={submit} className="form card">
        <div className="two-column">
          <label>First name<input value={form.firstName} onChange={(event) => update("firstName", event.target.value)} required /></label>
          <label>Last name<input value={form.lastName} onChange={(event) => update("lastName", event.target.value)} required /></label>
        </div>
        <label>Email<input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} required /></label>
        <label>Community name<input value={form.communityName} onChange={(event) => update("communityName", event.target.value)} placeholder="Example: UCF" /></label>
        <label>Password<input type="password" value={form.password} onChange={(event) => update("password", event.target.value)} required /></label>
        <label>Confirm password<input type="password" value={form.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} required /></label>
        <small>Use at least 10 characters with uppercase, lowercase, and a number.</small>
        <StatusMessage error={error} success={message} />
        {developmentLink && <p><a href={developmentLink}>Development-only verification link</a></p>}
        <button>Create account</button>
        <p><Link to="/login">Back to login</Link></p>
      </form>
    </section>
  );
}
