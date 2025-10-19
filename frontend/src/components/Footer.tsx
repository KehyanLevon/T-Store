import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer__inner container">
        <div className="footer__links">
          <a className="footer__link" href="#">
            Terms of Service
          </a>
          <a className="footer__link" href="#">
            Privacy Policy
          </a>
        </div>
        <p className="footer__copy">© 2025 T-STORE. All rights reserved.</p>
      </div>
    </footer>
  );
}
