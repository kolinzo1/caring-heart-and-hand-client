import React, { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { teamService } from "../../services/api/teamService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  DollarSign,
  Briefcase,
} from "lucide-react";

const JobPositionsManagement = () => {
  console.log('JobPositionsManagement rendering');
  const { addToast } = useToast();
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    employmentType: "",
    location: "",
    salary: "",
    description: "",
    requirements: [],
    benefits: [],
    isActive: true,
  });

  const employmentTypes = ["Full-time", "Part-time", "Contract", "Temporary"];

  const departments = [
    "Care Providers",
    "Nursing",
    "Administration",
    "Management",
  ];

  useEffect(() => {
    fetchPositions();
  }, []);

  useEffect(() => {
    if (editingPosition) {
      setFormData(editingPosition);
    } else {
      resetForm();
    }
  }, [editingPosition]);

  const fetchPositions = async () => {
    setIsLoading(true);
    try {
      const data = await teamService.getOpenPositions();
      setPositions(data);
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to fetch positions",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      employmentType: "",
      location: "",
      salary: "",
      description: "",
      requirements: [],
      benefits: [],
      isActive: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPosition) {
        await teamService.updatePosition(editingPosition.id, formData);
        setPositions(
          positions.map((pos) =>
            pos.id === editingPosition.id ? { ...pos, ...formData } : pos
          )
        );
      } else {
        const newPosition = await teamService.createPosition(formData);
        setPositions([...positions, newPosition]);
      }
      setShowModal(false);
      setEditingPosition(null);
      resetForm();
      addToast({
        title: "Success",
        description: editingPosition ? "Position updated" : "Position created",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to save position",
        variant: "error",
      });
    }
  };

  const handleDeletePosition = async (id) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      try {
        await teamService.deletePosition(id);
        setPositions(positions.filter((pos) => pos.id !== id));
        addToast({
          title: "Success",
          description: "Position deleted",
          variant: "success",
        });
      } catch (error) {
        addToast({
          title: "Error",
          description: "Failed to delete position",
          variant: "error",
        });
      }
    }
  };

  const handleEditClick = (position) => {
    setEditingPosition(position);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setEditingPosition(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Positions</h1>
        <Button onClick={handleAddClick} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Position
        </Button>
      </div>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {positions.map((position) => (
          <Card key={position.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{position.title}</span>
                {position.isActive ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    Inactive
                  </span>
                )}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {position.department}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {position.employmentType}
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {position.location}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  {position.salary}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  Posted {new Date(position.postedDate).toLocaleDateString()}
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {position.requirements.slice(0, 3).map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                    {position.requirements.length > 3 && (
                      <li>+ {position.requirements.length - 3} more</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(position)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDeletePosition(position.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/careers/${position.id}`, "_blank")}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add/Edit Position Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[600px] bg-gray-200">
          <DialogHeader>
            <DialogTitle>
              {editingPosition ? "Edit Position" : "Add New Position"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Department *
                </label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department: value })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Employment Type *
                </label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, employmentType: value })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {employmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location *
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Salary Range *
                </label>
                <Input
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  placeholder="e.g., $50,000 - $60,000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Requirements
              </label>
              <Textarea
                value={formData.requirements.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requirements: e.target.value
                      .split("\n")
                      .filter((r) => r.trim()),
                  })
                }
                placeholder="Enter each requirement on a new line"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Benefits</label>
              <Textarea
                value={formData.benefits.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    benefits: e.target.value
                      .split("\n")
                      .filter((b) => b.trim()),
                  })
                }
                placeholder="Enter each benefit on a new line"
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                id="isActive"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Position is active
              </label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingPosition ? "Update Position" : "Create Position"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobPositionsManagement;
