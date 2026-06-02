import { Link, useNavigate } from "react-router-dom";
import { clearUserProfile, getStoredRole } from "../services/authService";
import "../styles/Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const role = getStoredRole();
  const isAgent = role === "AGENT" || role === "ADMIN";

  const logout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    clearUserProfile();

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="logo">
        <Link to="/">
          RealEstate
        </Link>
      </div>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        {token && isAgent && (
          <Link to="/create-property">
            Create Property
          </Link>
        )}

        {token && !isAgent && (
          <Link to="/wishlist">
            Wishlist ❤️
          </Link>
        )}

        {token && (
          <Link to="/contacts">
            {isAgent ? "Buyer Inquiries" : "My Contacts"}
          </Link>
        )}

        {!token ? (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        ) : (
          <>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;