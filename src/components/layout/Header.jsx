import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const portalRef = useRef(null);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Close portal dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (portalRef.current && !portalRef.current.contains(event.target)) {
        setIsPortalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
    setIsPortalOpen(false);
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">          
            <span className="text-xl sm:text-2xl font-bold text-primary">
              Caring Heart & Hand
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Main Navigation */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Auth/Portal Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/request-care"
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Request Care
              </Link>
              {isAuthenticated ? (
                <div className="relative" ref={portalRef}>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => setIsPortalOpen(!isPortalOpen)}
                  >
                    <User className="w-4 h-4" />
                    Portal
                  </Button>
                  {isPortalOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      {user?.role === "admin" ? (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsPortalOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/staff/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsPortalOpen(false)}
                        >
                          Staff Dashboard
                        </Link>
                      )}
                      <Link
                        to="/staff/time-clock"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsPortalOpen(false)}
                      >
                        Time Clock
                      </Link>
                      <Link
                        to="/staff/shift-history"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsPortalOpen(false)}
                      >
                        Shift History
                      </Link>
                      <Link
                        to="/staff/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsPortalOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-primary"
                >
                  <User className="w-4 h-4 mr-2" />
                  Staff Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-2 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-2 text-base font-medium text-gray-600 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 space-y-2">
              <Link
                to="/request-care"
                className="block w-full text-center bg-primary text-white px-4 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Request Care
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to={
                      user?.role === "admin"
                        ? "/admin/dashboard"
                        : "/staff/dashboard"
                    }
                    className="block py-2 text-base font-medium text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/staff/time-clock"
                    className="block py-2 text-base font-medium text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Time Clock
                  </Link>
                  <Link
                    to="/staff/profile"
                    className="block py-2 text-base font-medium text-gray-600 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-base font-medium text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block py-2 text-base font-medium text-gray-600 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Staff Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;