import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { useToast } from "../../hooks/useToast";
import {
  Edit,
  Trash2,
  UserPlus,
  Search,
  Mail,
  Phone,
  User,
  Award,
} from "lucide-react";

const TeamManagement = () => {
  const { addToast } = useToast();
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const roles = [
    "All",
    "Care Provider",
    "Nurse",
    "Care Coordinator",
    "Administrator",
  ];

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockData = [
        {
          id: 1,
          name: "Matilda Oyedele",
          role: "Administrator",
          email: "matilda@caringheartandhand.com",
          phone: "423-748-3508",
          status: "active",
          qualifications: "RN, BSN, MBA",
          hireDate: "2020-01-15",
          certifications: ["CPR", "First Aid", "Care Management"],
          image: "/images/team/ceo.jpg",
        },
        // Add more mock data
      ];
      setTeamMembers(mockData);
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = (newMember) => {
    setTeamMembers([...teamMembers, { id: Date.now(), ...newMember }]);
    setShowAddModal(false);
    addToast({
      title: "Success",
      description: "Team member added successfully",
      variant: "success",
    });
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        // API call would go here
        setTeamMembers(teamMembers.filter((member) => member.id !== id));
        addToast({
          title: "Success",
          description: "Team member removed successfully",
          variant: "success",
        });
      } catch (error) {
        addToast({
          title: "Error",
          description: "Failed to remove team member",
          variant: "error",
        });
      }
    }
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole.toLowerCase() === "all" ||
      member.role.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Team Member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-48"
        >
          {roles.map((role) => (
            <option key={role} value={role.toLowerCase()}>
              {role}
            </option>
          ))}
        </Select>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card
            key={member.id}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditMember(member.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span>{member.qualifications}</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {member.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal would go here */}
    </div>
  );
};

export default TeamManagement;
