import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/footer.css';

// Component for showing the footer
const Footer = () => {
    return (
        <center>
            <div className="footer-center">
                <div className="footer-ul">
                    <Link key="Home" to="/" className="footer-link">Home</Link>
                    <Link key="Support" to="/support" className="footer-link">Support</Link>
                    <Link key="Privacy" to="/privacy" className="footer-link">Privacy</Link>
                    <Link key="About" to="/about" className="footer-link">About</Link>
                    <div className="blogger-copyright">Blogger v3 ©2020</div>
                </div>
                <br /><br /><br />
            </div>
        </center>
    );
};

export default Footer;