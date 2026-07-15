import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("Verifying…");
  const { refresh } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setMessage("Verification token is missing.");
      return;
    }

    api("/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) })
      .then(async () => {
        await refresh();
        setMessage("Email verified. Your account is ready.");
      })
      .catch((error: Error) => setMessage(error.message));
  }, [params, refresh]);

  return (
    <section className="narrow">
      <h1>Email verification</h1>
      <p>{message}</p>
      <Link to="/inventory">Continue</Link>
    </section>
  );
}
