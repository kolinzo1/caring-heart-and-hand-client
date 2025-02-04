import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { LoadingOverlay } from "../components/ui/LoadingStates/LoadingOverlay";
import { Skeleton } from "../components/ui/LoadingStates/Skeleton";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Heart,
  Award,
  Users,
  HandHeart,
  Trophy,
  Star,
  Target,
  Smile,
  Phone,
  AlertCircle,
} from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [teamData, setTeamData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockTeamData = [
        {
          name: "Matilda Oyedele",
          role: "CEO & Founder",
          image: "../assets/images/team/matilda.jpg",
          description:
            "With over 15 years of experience in healthcare management, Matilda leads our team with vision and compassion.",
        },
        {
          name: "Sarah Johnson",
          role: "Director of Care Services",
          image: "/images/director.jpg",
          description:
            "A registered nurse with extensive experience in home care coordination and team management.",
        },
        {
          name: "David Chen",
          role: "Quality Assurance Manager",
          image: "/images/manager.jpg",
          description:
            "Ensures the highest standards of care through continuous monitoring and improvement of our services.",
        },
      ];

      setTeamData(mockTeamData);
    } catch (error) {
      setError("Failed to load team data");
      addToast({
        title: "Error",
        description:
          "Failed to load team information. Please refresh the page.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Compassion",
      description:
        "We approach every client with genuine care, understanding, and empathy.",
    },
    {
      icon: <Award className="w-8 h-8 text-blue-500" />,
      title: "Excellence",
      description:
        "We maintain the highest standards in professional home care services.",
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Purpose-Driven",
      description:
        "Every action we take is guided by our mission to enhance lives.",
    },
    {
      icon: <Smile className="w-8 h-8 text-yellow-500" />,
      title: "Client-Focused",
      description:
        "Your needs and preferences are at the center of everything we do.",
    },
  ];

  const achievements = [
    {
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      stat: "1000+",
      label: "Clients Served",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      stat: "50+",
      label: "Care Professionals",
    },
    {
      icon: <Star className="w-8 h-8 text-purple-500" />,
      stat: "98%",
      label: "Client Satisfaction",
    },
  ];

  const TeamMemberSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="w-48 h-48 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            About Caring Heart & Hand
          </h1>
          <p className="text-xl max-w-2xl animate-slide-up">
            Dedicated to providing compassionate, professional home care
            services that enhance the quality of life for our clients.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="prose lg:prose-xl mx-auto">
              <p className="mb-4">
                Founded with a vision to transform home care services, Caring
                Heart & Hand has been serving our community with dedication and
                compassion. Our journey began with a simple mission: to provide
                the highest quality of care while treating each client as
                family.
              </p>
              <p className="mb-4">
                Under the leadership of our CEO Matilda Oyedele, we've built a
                team of dedicated professionals who share our commitment to
                excellence in home care. Our approach combines professional
                expertise with genuine compassion, ensuring that each client
                receives personalized care that meets their unique needs.
              </p>
              <p className="mb-4">
                Today, we continue to grow and evolve, always maintaining our
                core values and commitment to exceptional care. Our team of
                highly trained caregivers works tirelessly to support our
                clients' independence, dignity, and quality of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-gray-600">
                    To provide exceptional home care services that enable our
                    clients to maintain their independence and dignity while
                    living safely and comfortably in their own homes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-gray-600">
                    To be the most trusted and respected provider of home care
                    services, known for our commitment to excellence,
                    compassion, and innovative care solutions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Achievements
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {achievement.icon}
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {achievement.stat}
                  </div>
                  <div className="text-gray-600">{achievement.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Leadership Team
          </h2>

          {error ? (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchTeamData}>Retry</Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {isLoading
                ? [...Array(3)].map((_, index) => (
                    <TeamMemberSkeleton key={index} />
                  ))
                : teamData.map((member, index) => (
                    <Card
                      key={index}
                      className="text-center hover:shadow-lg transition-shadow duration-200"
                    >
                      <CardContent className="p-6">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h3 className="text-2xl font-bold mb-2">
                          {member.name}
                        </h3>
                        <p className="text-primary mb-4">{member.role}</p>
                        <p className="text-gray-600">{member.description}</p>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Care Family</h2>
          <p className="mb-8 text-lg max-w-2xl mx-auto">
            Experience the difference of personalized, compassionate care from a
            team that truly cares.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate("/contact")}
              className="bg-white text-primary hover:bg-gray-100"
            >
              Contact Us
            </Button>
            <Button
              onClick={() => navigate("/careers")}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Join Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
