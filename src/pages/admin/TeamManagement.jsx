import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import api from "../../lib/axios";
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { useToast } from "../../hooks/useToast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Edit,
  Trash2,
  Search,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { selectCurrentToken } from "../../redux/slices/authSlice";

const TeamManagement = () => {
  const { addToast } = useToast();
  const token = useSelector(selectCurrentToken);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: ""
  });

 

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/admin/team', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      console.log('Team members response:', response.data);  // Debug log
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch team members",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchTeamMembers();
    }
  }, [token]);

  const handleAddMemberClick = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      password: ""
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.role || !formData.password) {
        addToast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const response = await api.post('/api/admin/team', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      setTeamMembers([...teamMembers, response.data]);
      setShowAddModal(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        password: ""
      });
      
      addToast({
        title: "Success",
        description: "Team member added successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add team member",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        await api.delete(`/api/admin/team/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        setTeamMembers(teamMembers.filter((member) => member.id !== id));
        addToast({
          title: "Success",
          description: "Team member removed successfully",
          variant: "success"
        });
      } catch (error) {
        console.error('Error deleting team member:', error);
        addToast({
          title: "Error",
          description: error.response?.data?.message || "Failed to remove team member",
          variant: "destructive"
        });
      }
    }
  };

  const filteredMembers = teamMembers.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole.toLowerCase() === "all" ||
      member.role.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Team Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <Button onClick={handleAddMemberClick}>
          <User className="w-4 h-4 mr-2" />
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
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">{member.first_name} {member.last_name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
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
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[600px] bg-gray-200">
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role *</label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Team Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;