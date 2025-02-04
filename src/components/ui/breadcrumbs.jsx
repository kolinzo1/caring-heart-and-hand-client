import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const routes = {
  "/": "Home",
  "/about": "About",
  "/services": "Services",
  "/blog": "Blog",
  "/contact": "Contact",
  "/request-care": "Request Care",
  "/admin/dashboard": "Admin Dashboard",
  "/staff/dashboard": "Staff Dashboard",
};

export function Breadcrumbs({ className = "" }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumbs on home page
  if (location.pathname === "/") {
    return null;
  }

  // Build breadcrumb items
  const breadcrumbs = pathnames.map((path, index) => {
    const routePath = "/" + pathnames.slice(0, index + 1).join("/");
    const isLast = index === pathnames.length - 1;
    const name =
      routes[routePath] || path.charAt(0).toUpperCase() + path.slice(1);

    return {
      name,
      path: routePath,
      isLast,
    };
  });

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            {breadcrumb.isLast ? (
              <span className="text-gray-900 font-medium">
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="text-gray-500 hover:text-gray-700"
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
