import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Caring Heart & Hand</h3>
            <p className="text-gray-400 mb-4">
              Professional and compassionate home care services for your loved
              ones.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services#personal-care"
                  className="text-gray-400 hover:text-white"
                >
                  Personal Care
                </Link>
              </li>
              <li>
                <Link
                  to="/services#companion-care"
                  className="text-gray-400 hover:text-white"
                >
                  Companion Care
                </Link>
              </li>
              <li>
                <Link
                  to="/services#respite-care"
                  className="text-gray-400 hover:text-white"
                >
                  Respite Care
                </Link>
              </li>
              <li>
                <Link
                  to="/services#post-hospital-care"
                  className="text-gray-400 hover:text-white"
                >
                  Post-Hospital Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <a
                  href="tel:4237483508"
                  className="text-gray-400 hover:text-white"
                >
                  423 748 3508
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <a
                  href="mailto:admin@caringheartandhand.com"
                  className="text-gray-400 hover:text-white"
                >
                  admin@caringheartandhand.com
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-gray-400">125 Business Address</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Caring Heart & Hand. All rights
              reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
