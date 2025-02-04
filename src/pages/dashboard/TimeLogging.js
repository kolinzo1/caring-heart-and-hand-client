import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card.js";
import { Button } from "../../components/ui/button.js";
import { Select, SelectItem } from "../../components/ui/select.js";
import { Input } from "../../components/ui/input.js";
import { Textarea } from "../../components/ui/textarea.js";
import {
  Clock,
  Calendar,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const TimeLogging = () => {
  const user = useSelector((state) => state.auth.user);
  const [clients, setClients] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    clientId: "",
    date: "",
    startTime: "",
    endTime: "",
    serviceType: "",
    notes: "",
  });

  useEffect(() => {
    fetchClients();
    fetchRecentLogs();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchRecentLogs = async () => {
    try {
      const response = await fetch("/api/time-logs/recent", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setRecentLogs(data);
    } catch (error) {
      console.error("Error fetching recent logs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/time-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...formData,
          staffId: user.id,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          clientId: "",
          date: "",
          startTime: "",
          endTime: "",
          serviceType: "",
          notes: "",
        });
        fetchRecentLogs();

        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error logging time:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (start, end) => {
    const startTime = new Date(`2000-01-01 ${start}`);
    const endTime = new Date(`2000-01-01 ${end}`);
    const diff = endTime - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const serviceTypes = [
    "Personal Care",
    "Companionship",
    "Medication Reminder",
    "Light Housekeeping",
    "Meal Preparation",
    "Transportation",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Time Logging Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Log Your Time
              </CardTitle>
              <CardDescription>
                Record your care hours for clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Time logged successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Client</label>
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, clientId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Type</label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, serviceType: value })
                    }
                  >
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    placeholder="Add any notes about the care provided..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="h-32"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Log Time
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Time Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Recent Time Logs
              </CardTitle>
              <CardDescription>Your recently logged care hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.map((log, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{log.clientName}</h4>
                        <p className="text-sm text-gray-600">{log.date}</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {calculateDuration(log.startTime, log.endTime)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        {log.startTime} - {log.endTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {log.serviceType}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="text-sm text-gray-600 mt-2">{log.notes}</p>
                    )}
                  </div>
                ))}

                {recentLogs.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No recent time logs found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TimeLogging;
