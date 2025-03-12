import React, { useState, useEffect } from "react";
import { teamService } from "../services/api/teamService";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import JobApplicationDialog from '../components/JobApplicationDialog';
import {
  Briefcase,
  Clock,
  MapPin,
  Heart,
  Star,
  Users,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const CareersPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [openPositions, setOpenPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const departments = [
    "All",
    "Care Providers",
    "Nursing",
    "Administration",
    "Management",
  ];

  useEffect(() => {
    const loadPositions = async () => {
      try {
        setLoading(true);
        const positions = await teamService.getOpenPositions();
        setOpenPositions(positions);
      } catch (err) {
        console.error("Failed to fetch positions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPositions();
  }, []);

  const benefits = [
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Healthcare Benefits",
      description:
        "Comprehensive medical, dental, and vision coverage for you and your family",
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Work-Life Balance",
      description: "Flexible scheduling options and paid time off",
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: "Growth Opportunities",
      description: "Professional development and career advancement paths",
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-primary" />,
      title: "Education Support",
      description: "Continuing education and certification assistance",
    },
  ];

  const filteredPositions = openPositions.filter(
    (position) =>
      position.is_active && 
      (selectedDepartment === "all" || 
       position.department.toLowerCase() === selectedDepartment)
  );

  const handleApplicationSubmit = async (applicationData) => {
    try {
      await teamService.submitApplication(applicationData);
      // You might want to show a success message here
    } catch (error) {
      throw new Error('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Join Our Care Team</h1>
            <p className="text-xl mb-8">
              Make a difference in people's lives while building a rewarding
              career with one of the leading home care providers.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() =>
                document
                  .getElementById("positions")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              View Open Positions
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Open Positions
          </h2>

          {/* Department Filter */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 flex-wrap justify-center">
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={
                    selectedDepartment === dept.toLowerCase()
                      ? "default"
                      : "outline"
                  }
                  onClick={() => setSelectedDepartment(dept.toLowerCase())}
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>

          {/* Positions Grid */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredPositions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No open positions available in this department at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPositions.map((position) => (
                <Card
                  key={position.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle>{position.title}</CardTitle>
                    <CardDescription>
                      <div className="flex gap-4 mt-2">
                        <span className="flex items-center text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {position.employment_type}
                        </span>
                        <span className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {position.location}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="mb-4">{position.description}</p>

                    {position.requirements?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {position.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {position.benefits?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Benefits:</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {position.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <JobApplicationDialog
                      position={position}
                      onSubmit={handleApplicationSubmit}
                      trigger={
                        <Button className="w-full flex items-center justify-center">
                          Apply Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      }
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Career Growth Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Grow With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Supportive Team</h3>
                <p className="text-gray-600">
                  Join a collaborative team that supports your growth and
                  success
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Training & Development
                </h3>
                <p className="text-gray-600">
                  Access ongoing training and professional development
                  opportunities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Career Advancement
                </h3>
                <p className="text-gray-600">
                  Clear paths for advancement and leadership opportunities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Application Process
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Apply Online</h3>
                  <p className="text-gray-600">
                    Submit your application through our online portal. Make sure
                    to include your updated resume and cover letter.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Initial Review</h3>
                  <p className="text-gray-600">
                    Our hiring team will review your application and reach out
                    if your qualifications match our needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Interview</h3>
                  <p className="text-gray-600">
                    Selected candidates will be invited for an interview to
                    discuss their experience and our opportunities.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Welcome Aboard</h3>
                  <p className="text-gray-600">
                    Successful candidates will receive an offer and begin their
                    onboarding process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
