import React, { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
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
  User,
  Filter,
  Download,
} from "lucide-react";

const ShiftHistory = () => {
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
    fetchShifts();
    fetchClients();
  }, [filters]);

  const fetchShifts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        client: filters.client,
        startDate: filters.startDate,
        endDate: filters.endDate,
        status: filters.status,
      }).toString();

      const response = await fetch(`/api/staff/shifts?${queryParams}`);
      const data = await response.json();
      setShifts(data);
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to fetch shifts",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/staff/clients");
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

  const formatDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diff = endTime - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const calculateTotal = () => {
    return shifts.reduce((total, shift) => {
      const duration = new Date(shift.endTime) - new Date(shift.startTime);
      return total + duration;
    }, 0);
  };

  const handleExportShifts = async () => {
    try {
      const response = await fetch("/api/staff/shifts/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
              onChange={(e) =>
                setFilters({ ...filters, client: e.target.value })
              }
              className="w-full"
            >
              <option value="all">All Clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Select>

            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="w-full"
            />

            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="w-full"
            />

            <Select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending Report</option>
              <option value="flagged">Flagged</option>
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
              <>
                {shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{shift.clientName}</h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(shift.startTime).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {`${new Date(
                              shift.startTime
                            ).toLocaleTimeString()} - ${new Date(
                              shift.endTime
                            ).toLocaleTimeString()}`}
                          </div>
                          <div>
                            Duration:{" "}
                            {formatDuration(shift.startTime, shift.endTime)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
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
                  </div>
                ))}

                {/* Summary */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Total Shifts</div>
                      <div className="text-xl font-semibold">
                        {shifts.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Total Hours</div>
                      <div className="text-xl font-semibold">
                        {Math.round(calculateTotal() / (1000 * 60 * 60))}h
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shift Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shift Report</DialogTitle>
          </DialogHeader>
          {selectedShift && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Client</div>
                    <div className="font-medium">
                      {selectedShift.clientName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium">
                      {new Date(selectedShift.startTime).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Time</div>
                    <div className="font-medium">
                      {`${new Date(
                        selectedShift.startTime
                      ).toLocaleTimeString()} - 
                        ${new Date(
                          selectedShift.endTime
                        ).toLocaleTimeString()}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">
                      {formatDuration(
                        selectedShift.startTime,
                        selectedShift.endTime
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Tasks Completed</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedShift.report.tasksCompleted).map(
                    ([task, completed]) => (
                      <div key={task} className="flex items-center gap-2">
                        <input type="checkbox" checked={completed} readOnly />
                        <span>
                          {task.charAt(0).toUpperCase() + task.slice(1)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Client's Condition</h3>
                <p className="text-gray-600">
                  {selectedShift.report.clientCondition}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-gray-600">{selectedShift.report.notes}</p>
              </div>

              {selectedShift.report.concerns && (
                <div>
                  <h3 className="font-medium mb-2">Concerns</h3>
                  <p className="text-gray-600">
                    {selectedShift.report.concerns}
                  </p>
                </div>
              )}

              {selectedShift.report.followUpNeeded && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2">
                    Follow-up Required
                  </h3>
                  <p className="text-yellow-700">
                    This shift has been flagged for follow-up.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShiftHistory;
