import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <>
      <h2 className="main__title">Welcome to T-STORE</h2>
      <p className="main__lead">
        Discover and share your favorite products with a community of
        enthusiasts. Join today to start exploring.
      </p>
      <div className="main__actions">
        <Link to="/products" className="btn btn--primary btn--lg btn--lift">
          Get Started
        </Link>
        <Link to="/login" className="btn btn--muted btn--lg btn--lift">
          Log In
        </Link>
      </div>
    </>
  );
}
