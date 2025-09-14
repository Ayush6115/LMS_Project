import "../components/styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} LMS. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
