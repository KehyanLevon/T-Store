import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useUnit } from "effector-react";
import { $user, logoutClicked } from "../entities/auth/model";
import { useState, useRef } from "react";
import { useClickOutside } from "../shared/hooks/useClickOutside";

export default function Header() {
  const [user, logout] = useUnit([$user, logoutClicked]);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  useClickOutside(menuRef, () => setMenuOpen(false));

  return (
    <header className="site-header">
      <nav className="nav container">
        <div className="left-side">
          <Link to="/products">
            <div className="brand">
              <div className="brand__logo" aria-hidden="true">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h1 className="brand__title">T-STORE</h1>
            </div>
          </Link>

          {user ? (
            <Link
              to="/products/new"
              className="btn btn--primary btn--lg btn--lift"
            >
              Create product
            </Link>
          ) : (
            <></>
          )}
        </div>

        <div className="nav-actions">
          {!user ? (
            <div className="btn-row">
              <Link to="/login">
                <button className="btn btn--muted">Log in</button>
              </Link>
              <Link to="/registration">
                <button className="btn btn--primary">Sign up</button>
              </Link>
            </div>
          ) : (
            <div className="user-menu" ref={menuRef}>
              <button
                className="user-avatar"
                onClick={toggleMenu}
                aria-label="User menu"
              >
                {user.photo ? (
                  <img
                    src={`data:${user.photoMime};base64,${user.photo}`}
                    alt="avatar"
                    className="avatar-img"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="avatar-icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2a5 5 0 00-5 5v1a5 5 0 0010 0V7a5 5 0 00-5-5zm-7 18a7 7 0 0114 0v1H5v-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {menuOpen && (
                <div className="dropdown">
                  <Link
                    to="/account"
                    className="dropdown__item"
                    onClick={() => setMenuOpen(false)}
                  >
                    My account
                  </Link>
                  <button className="dropdown__item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
