import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Mail, Phone, Award, GraduationCap } from "lucide-react";

const TeamPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Matilda Oyedele",
      role: "CEO & Founder",
      image: "/images/team/ceo.jpg",
      qualifications: "RN, BSN, MBA",
      experience: "15+ years in healthcare management",
      specialties: [
        "Healthcare Administration",
        "Care Quality Management",
        "Team Leadership",
      ],
      contact: {
        email: "matilda@caringheartandhand.com",
        phone: "423-748-3508",
      },
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Director of Care Services",
      image: "/images/team/director.jpg",
      qualifications: "RN, BSN",
      experience: "12+ years in home care",
      specialties: ["Care Coordination", "Staff Training", "Quality Assurance"],
      contact: {
        email: "sarah@caringheartandhand.com",
        phone: "423-748-3509",
      },
    },
    // Add more team members as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Care Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our dedicated team of healthcare professionals committed to
            providing exceptional care and support to our clients.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h2 className="text-2xl font-bold mb-1">{member.name}</h2>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="w-5 h-5" />
                    <span>{member.qualifications}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-5 h-5" />
                    <span>{member.experience}</span>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Specialties</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {member.specialties.map((specialty, index) => (
                        <li key={index}>{specialty}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${member.contact.email}`}
                        className="hover:text-primary"
                      >
                        {member.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <a
                        href={`tel:${member.contact.phone}`}
                        className="hover:text-primary"
                      >
                        {member.contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join Our Team Section */}
        <div className="mt-16 text-center bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're always looking for passionate healthcare professionals to join
            our team. If you're committed to making a difference in people's
            lives, we'd love to hear from you.
          </p>
          <a
            href="/careers"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Career Opportunities
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
