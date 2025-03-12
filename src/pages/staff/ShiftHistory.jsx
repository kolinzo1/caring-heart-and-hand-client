import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import {
  Card,
  CardHeader,
  CardTitle,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Calendar,
  Clock,
  Search,
  FileText,
  Filter,
  Download,
} from "lucide-react";

const ShiftHistory = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addToast } = useToast();
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShift, setSelectedShift] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({
    client: "all",
    startDate: "",
    endDate: "",
    status: "all",
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchShifts();
    fetchClients();
  }, [token, filters]);

  const fetchShifts = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching shifts with token:', token); // Log token being used
      
      const queryParams = new URLSearchParams({
        client: filters.client,
        startDate: filters.startDate,
        endDate: filters.endDate,
        status: filters.status,
      }).toString();
  
      console.log('Making request to:', `${process.env.REACT_APP_API_URL}/api/shifts?${queryParams}`);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/shifts?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch shifts');
      }
  
      const data = await response.json();
      console.log('Received shifts data:', data); // Log received data
  
      if (!Array.isArray(data)) {
        console.error('Received non-array data:', data);
        throw new Error('Invalid data format received from server');
      }
  
      setShifts(data);
    } catch (error) {
      console.error('Full error details:', error);
      addToast({
        title: "Error",
        description: error.message || "Failed to fetch shifts",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clients`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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

  const handleExportShifts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/shifts/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(filters),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "shift-history.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      addToast({
        title: "Success",
        description: "Shifts exported successfully",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to export shifts",
        variant: "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Shift History
            </CardTitle>
            <Button
              variant="outline"
              onClick={handleExportShifts}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select
              value={filters.client}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, client: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {`${client.first_name} ${client.last_name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full"
            />

            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full"
            />

            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending Report</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Shifts List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading shifts...</div>
            ) : shifts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No shifts found for the selected filters
              </div>
            ) : (
              shifts.map((shift) => (
                <div
                  key={shift.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{`${shift.first_name} ${shift.last_name}`}</h3>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(shift.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {`${shift.start_time} - ${shift.end_time}`}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedShift(shift);
                        setShowReportModal(true);
                      }}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      View Report
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="bg-white text-black">  {/* Add these classes */}
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Shift Report</DialogTitle>
          </DialogHeader>
          {selectedShift && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Client</div>
                  <div className="font-medium text-black">  {/* Add text-black */}
                    {`${selectedShift.first_name} ${selectedShift.last_name}`}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-medium text-black">  {/* Add text-black */}
                    {new Date(selectedShift.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Service Type</div>
                <div className="font-medium text-black">  {/* Add text-black */}
                  {selectedShift.service_type}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Notes</div>
                <div className="font-medium text-black">  {/* Add text-black */}
                  {selectedShift.notes}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShiftHistory;