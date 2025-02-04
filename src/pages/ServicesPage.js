import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { Skeleton } from "../components/ui/LoadingStates/Skeleton";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Heart,
  User,
  Clock,
  Hospital,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const ServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // Scroll to section if hash exists in URL
    const hash = location.hash.slice(1);
    if (hash) {
      scrollToSection(hash);
    }
  }, [location.hash, isLoading]);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockServices = [
        {
          id: "personal-care",
          title: "Personal Care",
          icon: <Heart className="w-12 h-12 text-primary" />,
          description: "Comprehensive assistance with daily living activities",
          features: [
            "Bathing and personal hygiene assistance",
            "Dressing and grooming",
            "Mobility assistance",
            "Medication reminders",
            "Toileting and incontinence care",
            "Exercise assistance",
          ],
          benefits: [
            "Maintain dignity and independence",
            "Improve quality of life",
            "Prevent accidents and injuries",
            "Professional and compassionate care",
          ],
        },
        {
          id: "companion-care",
          title: "Companion Care",
          icon: <User className="w-12 h-12 text-green-500" />,
          description: "Friendly companionship and emotional support",
          features: [
            "Friendly conversation",
            "Social engagement",
            "Hobby assistance",
            "Reading assistance",
            "Recreational activities",
            "Light housekeeping",
          ],
          benefits: [
            "Reduce loneliness and isolation",
            "Maintain social connections",
            "Engage in enjoyable activities",
            "Peace of mind for family members",
          ],
        },
        {
          id: "respite-care",
          title: "Respite Care",
          icon: <Clock className="w-12 h-12 text-purple-500" />,
          description: "Relief care for family caregivers",
          features: [
            "Temporary care relief",
            "Flexible scheduling",
            "Personal care assistance",
            "Companionship",
            "Medication management",
            "Peace of mind for family caregivers",
          ],
          benefits: [
            "Prevent caregiver burnout",
            "Maintain caregiver health",
            "Flexible scheduling options",
            "Professional backup support",
          ],
        },
        {
          id: "post-hospital-care",
          title: "Post-Hospital Care",
          icon: <Hospital className="w-12 h-12 text-blue-500" />,
          description: "Support during recovery after hospital stay",
          features: [
            "Recovery assistance",
            "Medication management",
            "Follow-up appointment reminders",
            "Personal care",
            "Mobility assistance",
            "Rehabilitation support",
          ],
          benefits: [
            "Smooth transition home",
            "Reduce readmission risk",
            "Speed up recovery",
            "Professional medical oversight",
          ],
        },
      ];

      setServices(mockServices);
    } catch (error) {
      setError("Failed to load services. Please try again later.");
      addToast({
        title: "Error",
        description: "Failed to load services. Please refresh the page.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
    }
  };

  const ServiceSkeleton = () => (
    <Card className="mb-8 animate-pulse">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-8 w-48 ml-4" />
        </div>
        <Skeleton className="h-4 w-3/4 mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Error Loading Services</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={fetchServices}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-2xl">
            Professional and compassionate care services tailored to meet your
            unique needs
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="sticky top-16 bg-white shadow-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 gap-4 no-scrollbar">
            {services.map((service) => (
              <Button
                key={service.id}
                variant={activeSection === service.id ? "default" : "outline"}
                className="whitespace-nowrap"
                onClick={() => scrollToSection(service.id)}
              >
                {service.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Content */}
      <div className="container mx-auto px-4 py-12">
        {isLoading
          ? [...Array(4)].map((_, index) => <ServiceSkeleton key={index} />)
          : services.map((service) => (
              <Card
                key={service.id}
                id={service.id}
                className="mb-8 scroll-mt-32 hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-8">
                  {/* Service Header */}
                  <div className="flex items-center mb-6">
                    {service.icon}
                    <h2 className="text-2xl md:text-3xl font-bold ml-4">
                      {service.title}
                    </h2>
                  </div>

                  <p className="text-xl text-gray-600 mb-8">
                    {service.description}
                  </p>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {service.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Benefits Section */}
                  <div className="bg-primary/5 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {service.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <ArrowRight className="w-4 h-4 text-primary mr-2" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={() =>
                        navigate("/contact", {
                          state: { service: service.title },
                        })
                      }
                      className="group"
                    >
                      Request This Service
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Contact us today to learn more about our services and how we can
            help you or your loved ones.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
