import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">ReuseHub</Link>
        <nav aria-label="Main navigation">
          {user ? (
            <>
              <NavLink to="/inventory">My Inventory</NavLink>
              <NavLink to="/community">Community</NavLink>
              <NavLink to="/items/new">Add Item</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <button className="link-button" onClick={() => void handleLogout()}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="container"><Outlet /></main>
      <footer>ReuseHub prototype — reuse before replacement.</footer>
    </>
  );
}
