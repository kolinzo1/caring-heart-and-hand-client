import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Clock } from "lucide-react";

const TimeClockForm = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    notes: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clients`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data = await response.json();
      setClients(data);
    } catch (error) {
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

    if (!formData.clientId || !formData.startTime || !formData.endTime) {
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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to log shift');
      }

      addToast({
        title: "Success",
        description: "Shift logged successfully",
        variant: "success",
      });

      navigate("/staff/shift-history");
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to log shift",
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
                onChange={(e) =>
                  setFormData({ ...formData, clientId: e.target.value })
                }
                className="w-full"
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {`${client.first_name} ${client.last_name}`}
                  </option>
                ))}
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
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                placeholder="Add any notes about this shift..."
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