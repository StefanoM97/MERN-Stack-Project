import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import {
  readSensitiveLinkToken,
  removeSensitiveLinkTokenFromAddressBar
} from "../utils/linkToken";

export function VerifyEmailPage() {
  const [token] = useState<string | null>(
    () => readSensitiveLinkToken()
  );
  const [message, setMessage] = useState("Verifying…");
  const submitted = useRef(false);
  const { refresh } = useAuth();

  useEffect(() => {
    removeSensitiveLinkTokenFromAddressBar();
  }, []);

  useEffect(() => {
    if (!token) {
      setMessage("Verification token is missing.");
      return;
    }

    if (submitted.current) return;
    submitted.current = true;

    void api("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token })
    })
      .then(async () => {
        await refresh();
        setMessage("Email verified. Your account is ready.");
      })
      .catch((error: Error) => {
        setMessage(error.message);
      });
  }, [token, refresh]);

  return (
    <section className="narrow">
      <h1>Email verification</h1>
      <p>{message}</p>
      <Link to="/inventory">Continue</Link>
    </section>
  );
}
