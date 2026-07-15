import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function HomePage() {
  const { user } = useAuth();
  return (
    <section className="hero">
      <p className="eyebrow">Community inventory</p>
      <h1>Reuse useful belongings before replacing or discarding them.</h1>
      <p>
        Catalog your items, find reusable goods in your school or public community,
        and check marketplace and public-interest signals.
      </p>
      <div className="actions">
        <Link className="button" to={user ? "/inventory" : "/register"}>
          {user ? "Open inventory" : "Create account"}
        </Link>
        <Link className="button secondary" to={user ? "/community" : "/login"}>
          Browse community
        </Link>
      </div>
    </section>
  );
}
