import React from "react";
import { Phone } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
      <a
        href="tel:4237483508"
        aria-label="Call Caring Heart & Hand"
        className="md:hidden fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-full shadow-lg font-semibold"
      >
        <Phone className="w-5 h-5" />
        Call Now
      </a>
    </div>
  );
};

export default Layout;
