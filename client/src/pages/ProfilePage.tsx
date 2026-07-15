import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { StatusMessage } from "../components/StatusMessage";
import type { User } from "../types";

export function ProfilePage() {
  const { refresh } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    communityName: "",
    emailVisible: true,
    phone: "",
    phoneVisible: false,
    preferredContact: "email" as "email" | "phone"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api<{ user: User }>("/profile").then(({ user }) => setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      communityName: user.communityName,
      emailVisible: user.contact.emailVisible,
      phone: user.contact.phone,
      phoneVisible: user.contact.phoneVisible,
      preferredContact: user.contact.preferredContact
    })).catch((caught: Error) => setError(caught.message));
  }, []);

  function update(name: string, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api("/profile", {
        method: "PUT",
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          communityName: form.communityName,
          contact: {
            emailVisible: form.emailVisible,
            phone: form.phone,
            phoneVisible: form.phoneVisible,
            preferredContact: form.preferredContact
          }
        })
      });
      await refresh();
      setSuccess("Profile saved.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Save failed");
    }
  }

  return (
    <section className="narrow">
      <h1>Profile and contact privacy</h1>
      <form onSubmit={submit} className="form card">
        <div className="two-column">
          <label>First name<input value={form.firstName} onChange={(event) => update("firstName", event.target.value)} /></label>
          <label>Last name<input value={form.lastName} onChange={(event) => update("lastName", event.target.value)} /></label>
        </div>
        <label>Community name<input value={form.communityName} onChange={(event) => update("communityName", event.target.value)} /></label>
        <label>Phone<input value={form.phone} onChange={(event) => update("phone", event.target.value)} /></label>
        <label className="checkbox"><input type="checkbox" checked={form.emailVisible} onChange={(event) => update("emailVisible", event.target.checked)} /> Show email to viewers of visible items</label>
        <label className="checkbox"><input type="checkbox" checked={form.phoneVisible} onChange={(event) => update("phoneVisible", event.target.checked)} /> Show phone to viewers of visible items</label>
        <label>Preferred contact<select value={form.preferredContact} onChange={(event) => update("preferredContact", event.target.value)}><option value="email">Email</option><option value="phone">Phone</option></select></label>
        <StatusMessage error={error} success={success} />
        <button>Save profile</button>
      </form>
    </section>
  );
}
