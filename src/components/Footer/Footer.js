import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import "./Footer.css"

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h4>Contact Us</h4>
                        <p>51,52, Road 7 E.P.I.P. Zone, opp. Genysis,</p>
                        <p> KIADB Export Promotion Industrial Area,</p>
                        <p> Whitefield, Bengaluru, Karnataka 560066</p>
                        <p style={{fontWeight : "bolder"}}>Email: enquiry@chesadentalcare.com</p>
                        <p style={{fontWeight : "bolder"}}>Phone: +91 73381 86333</p>
                    </div>
                    <div className="col-md-5">
                        <h4>Follow Us</h4>
                        <ul className="social-icons">
                            <li><a href="#"><FaFacebookF /></a></li>
                            <li><a href="#"><FaTwitter /></a></li>
                            <li><a href="#"><FaInstagram /></a></li>
                            <li><a href="#"><FaLinkedinIn /></a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h4>Quick Links</h4>
                        <ul className="quick-links">
                            <li><a href="https://www.chesadentalcare.com/index.php">Home</a></li>
                            <li><a href="https://www.chesadentalcare.com/products.php">Services</a></li>
                            <li><a href="https://www.chesadentalcare.com/team.php">About Us</a></li>
                            <li><a href="https://www.chesadentalcare.com/contact-us.php">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
