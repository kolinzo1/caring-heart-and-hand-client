import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Clock } from "lucide-react";

const TimeClockForm = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token } = useAuth();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    notes: "",
    serviceType: ""
  });

  const serviceTypes = [
    "Personal Care",
    "Companionship",
    "Medication Reminder",
    "Light Housekeeping",
    "Meal Preparation",
    "Transportation",
    "Other",
  ];

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchClients();
  }, [token, navigate]);

  const fetchClients = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Fetch clients error:', error);
      addToast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "error",
      });
    }
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return "";

    const [startHours, startMinutes] = formData.startTime.split(":").map(Number);
    const [endHours, endMinutes] = formData.endTime.split(":").map(Number);

    let hours = endHours - startHours;
    let minutes = endMinutes - startMinutes;

    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }

    if (hours < 0) {
      hours += 24;
    }

    return `${hours} hours ${minutes} minutes`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('API URL:', process.env.REACT_APP_API_URL);
    console.log('API endpoint:', `${process.env.REACT_APP_API_URL}/api/time-logs`);
    

    const submissionData = {
      ...formData,
      clientId: parseInt(formData.clientId, 10),
      startTime: formData.startTime + ':00',
      endTime: formData.endTime + ':00', // Convert to number
    };

    console.log('Form Data being submitted:', submissionData);
  
    if (!submissionData.clientId || !submissionData.startTime || !submissionData.endTime || !submissionData.serviceType) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/time-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(submissionData),
    });

    // Log the full response
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseData = await response.json();
    console.log('Response data:', responseData);

    if (!response.ok) {
      throw new Error(`Failed to log shift: ${responseData.message || response.statusText}`);
    }

    addToast({
      title: "Success",
      description: "Shift logged successfully",
      variant: "success",
    });

    navigate("/staff/shift-history");
  } catch (error) {
    console.error('Error submitting shift:', error);
    addToast({
      title: "Error",
      description: error.message || "Failed to log shift",
      variant: "error",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Log Shift Time
          </CardTitle>
          <CardDescription>Record your shift details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Client *</label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {`${client.first_name} ${client.last_name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Service Type *</label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date *</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Time *
                </label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  End Time *
                </label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {formData.startTime && formData.endTime && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Shift Duration</h3>
                <p className="text-gray-600">{calculateDuration()}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any notes about this shift..."
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Save Shift"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeClockForm;