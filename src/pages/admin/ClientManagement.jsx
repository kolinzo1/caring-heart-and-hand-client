import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import api from "../../lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
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
  Plus,
  Home,
  AlertTriangle,
} from "lucide-react";
import { selectCurrentToken } from "../../redux/slices/authSlice";

const ClientManagement = () => {
  const { addToast } = useToast();
  const token = useSelector(selectCurrentToken);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    status: "active"
  });

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/clients', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      console.log('Clients response:', response.data);
      const responseData = Array.isArray(response.data) ? response.data : [];
      setClients(responseData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch clients",
        variant: "destructive"
      });
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (token) {
      fetchClients();
    } else {
      setIsLoading(false);
      console.error('No authentication token available');
    }
  }, [token]);

  const handleAddClientClick = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      status: "active"
    });
    setShowAddModal(true);
  };
  
  const handleEditClientClick = (client) => {
    if (!client) return;
    
    setSelectedClient(client);
    setFormData({
      firstName: client.first_name || "",
      lastName: client.last_name || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      emergencyContactName: client.emergency_contact_name || "",
      emergencyContactPhone: client.emergency_contact_phone || "",
      status: client.status || "active"
    });
    setShowEditModal(true);
  };
  
  const handleViewClientClick = (client) => {
    if (!client) return;
    
    setSelectedClient(client);
    setShowViewModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.firstName || !formData.lastName) {
        addToast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const response = await api.post('/api/clients', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        status: formData.status
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      setClients([...clients, response.data]);
      setShowAddModal(false);
      
      addToast({
        title: "Success",
        description: "Client added successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error adding client:', error);
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add client",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      if (!selectedClient || !selectedClient.id) {
        addToast({
          title: "Error",
          description: "No client selected for update",
          variant: "destructive"
        });
        return;
      }
      
      if (!formData.firstName || !formData.lastName) {
        addToast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const response = await api.put(`/api/clients/${selectedClient.id}`, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        status: formData.status
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      // Update the client in the local state
      const updatedClients = clients.map(client => 
        client.id === selectedClient.id ? { 
          ...client, 
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_phone: formData.emergencyContactPhone,
          status: formData.status
        } : client
      );
      
      setClients(updatedClients);
      setShowEditModal(false);
      setSelectedClient(null);
      
      addToast({
        title: "Success",
        description: "Client updated successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error updating client:', error);
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update client",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClient = async (id) => {
    if (!id) {
      console.error('No id provided for deletion');
      return;
    }
    
    if (window.confirm("Are you sure you want to remove this client?")) {
      try {
        await api.delete(`/api/clients/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        setClients(clients.filter((client) => client.id !== id));
        addToast({
          title: "Success",
          description: "Client removed successfully",
          variant: "success"
        });
      } catch (error) {
        console.error('Error deleting client:', error);
        addToast({
          title: "Error",
          description: error.response?.data?.message || "Failed to remove client",
          variant: "destructive"
        });
      }
    }
  };

  // Filter the clients based on search and status filter
  const filteredClients = clients.filter((client) => {
    if (!client) return false;
    
    const fullName = `${client.first_name || ''} ${client.last_name || ''}`.toLowerCase();
    const email = client.email ? client.email.toLowerCase() : '';
    const phone = client.phone ? client.phone.toLowerCase() : '';
    
    const matchesSearch =
      searchTerm === '' ||
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm.toLowerCase());
      
    const matchesStatus =
      statusFilter.toLowerCase() === "all" ||
      (client.status && client.status.toLowerCase() === statusFilter.toLowerCase());
      
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Client Management</h1>
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
        <h1 className="text-2xl font-bold">Client Management</h1>
        <Button onClick={handleAddClientClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredClients.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No clients found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? "Try adjusting your filters to see more results." 
              : "Get started by adding your first client."}
          </p>
          <Button onClick={handleAddClientClick}>
            Add Client
          </Button>
        </div>
      ) : (
        /* Clients Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id || Math.random().toString()} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                  <span>{client.first_name || ""} {client.last_name || ""}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status || "active"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-2 text-sm mb-4">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                  {client.emergency_contact_name && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="truncate">
                        {client.emergency_contact_name} 
                        {client.emergency_contact_phone && ` (${client.emergency_contact_phone})`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewClientClick(client)}
                  >
                    View Details
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClientClick(client)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[600px] bg-gray-100">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Client</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[600px] bg-gray-100">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdateClient} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Client</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedClient.first_name} {selectedClient.last_name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedClient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedClient.status || "active"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p>{selectedClient.email || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p>{selectedClient.phone || "Not provided"}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Address</h4>
                <p>{selectedClient.address || "Not provided"}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-500">Emergency Contact</h4>
                {selectedClient.emergency_contact_name ? (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p>{selectedClient.emergency_contact_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p>{selectedClient.emergency_contact_phone || "Not provided"}</p>
                    </div>
                  </div>
                ) : (
                  <p>No emergency contact provided</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-500">Client Since</h4>
                <p>{new Date(selectedClient.created_at).toLocaleDateString()}</p>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleEditClientClick(selectedClient)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Client
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement;