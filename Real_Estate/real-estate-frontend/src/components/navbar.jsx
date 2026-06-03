import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  AUTH_STATE_EVENT,
  clearUserProfile,
  fetchCurrentUser,
  getStoredRole,
  getStoredUser,
  logout as apiLogout,
} from "../services/authService";
import { notifySuccess } from "../utils/toast";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("access"));
  const [role, setRole] = useState(() => getStoredRole());
  const [user, setUser] = useState(() => getStoredUser());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      const nextToken = localStorage.getItem("access");
      const nextUser = getStoredUser();
      const nextRole = getStoredRole();

      setToken(nextToken);
      setUser(nextUser);
      setRole(nextRole);

      if (nextToken && !nextUser) {
        fetchCurrentUser()
          .then((currentUser) => {
            setRole(currentUser.role);
            setUser(currentUser);
          })
          .catch(() => {});
      }
    };

    syncAuthState();
    window.addEventListener(AUTH_STATE_EVENT, syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener(AUTH_STATE_EVENT, syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isAgent = role === "AGENT" || role === "ADMIN";

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    try {
      await apiLogout();
    } catch {
      /* session may already be invalid */
    }
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    clearUserProfile();
    setToken(null);
    setRole(null);
    setUser(null);
    notifySuccess("Signed out successfully");
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <div>
      <header className="site-header">
        <nav className="navbar" aria-label="Main navigation">
          <div className="navbar-inner">
            <Link to="/properties" className="brand" onClick={closeMenu}>
              <span className="brand-mark" aria-hidden="true">
                EH
              </span>
              <span className="brand-name">EstateHub</span>
            </Link>

            <button
              type="button"
              className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
              aria-expanded={menuOpen}
              aria-controls="main-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>

            <div
              id="main-nav"
              className={`nav-panel ${menuOpen ? "nav-panel-open" : ""}`}
            >
              <div
                className="nav-panel-backdrop"
                onClick={closeMenu}
                aria-hidden="true"
              />
              <div className="nav-panel-content">
                <div className="nav-primary">
                  <NavLink
                    to="/properties"
                    className={navClass}
                    onClick={closeMenu}
                  >
                    Browse
                  </NavLink>

                  {token && isAgent && (
                    <>
                      <NavLink
                        to="/my-listings"
                        className={navClass}
                        onClick={closeMenu}
                      >
                        My listings
                      </NavLink>
                      <NavLink
                        to="/create-property"
                        className={navClass}
                        onClick={closeMenu}
                      >
                        List property
                      </NavLink>
                    </>
                  )}

                  {token && !isAgent && (
                    <NavLink
                      to="/wishlist"
                      className={navClass}
                      onClick={closeMenu}
                    >
                      Wishlist
                    </NavLink>
                  )}

                  {token && (
                    <NavLink
                      to="/contacts"
                      className={navClass}
                      onClick={closeMenu}
                    >
                      {isAgent ? "Inquiries" : "Contacts"}
                    </NavLink>
                  )}
                </div>

                <div className="nav-actions">
                  {token ? (
                    <>
                      <div className="nav-user-chip">
                        <span className="nav-avatar" aria-hidden="true">
                          {(user?.username || "U").charAt(0).toUpperCase()}
                        </span>
                        <div className="nav-user-meta">
                          <NavLink
                            to="/profile"
                            className="nav-username"
                            onClick={closeMenu}
                          >
                            {user?.username || "Account"}
                          </NavLink>
                          {role && <span className="nav-role">{role}</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="nav-btn nav-btn-outline"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="nav-btn nav-btn-ghost"
                        onClick={closeMenu}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="nav-btn nav-btn-solid"
                        onClick={closeMenu}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;
