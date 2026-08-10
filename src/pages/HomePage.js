import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { Skeleton } from "../components/ui/LoadingStates/Skeleton";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Heart,
  Users,
  Clock,
  Shield,
  ArrowRight,
  Phone,
  MapPin,
  Star,
  Trophy,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  const trustStats = [
    { icon: <Trophy className="w-8 h-8 text-primary" />, stat: "1000+", label: "Clients Served" },
    { icon: <Users className="w-8 h-8 text-primary" />, stat: "50+", label: "Care Professionals" },
    { icon: <Star className="w-8 h-8 text-primary" />, stat: "98%", label: "Client Satisfaction" },
    { icon: <Shield className="w-8 h-8 text-primary" />, stat: "Licensed", label: "& Insured" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <img
          src="/assets/images/hero-bg.jpg"
          alt="Caregiver providing compassionate home care"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Caring Heart & Hand
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Professional and compassionate home care services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/request-care")}
                className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90"
              >
                Request Care
              </button>
              <button
                onClick={() => navigate("/services")}
                className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/10"
              >
                Our Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustStats.map((item, index) => (
              <div key={index} className="flex items-center justify-center gap-3">
                {item.icon}
                <div>
                  <div className="text-xl font-bold text-primary leading-tight">
                    {item.stat}
                  </div>
                  <div className="text-sm text-gray-600 leading-tight">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Compassionate Care</h3>
              <p>Dedicated to your comfort and well-being</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Professional Staff</h3>
              <p>Experienced and certified caregivers</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Availability</h3>
              <p>Round-the-clock care when you need it</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Licensed & Insured</h3>
              <p>Your safety is our priority</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-lg max-w-2xl mx-auto">
            Reach out today for a free consultation and let us design a care
            plan that fits your family's needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/request-care")}
              className="bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100"
            >
              Request Care
            </button>
            <a
              href="tel:4237483508"
              className="flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/10"
            >
              <Phone className="w-5 h-5" />
              (423) 748-3508
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
