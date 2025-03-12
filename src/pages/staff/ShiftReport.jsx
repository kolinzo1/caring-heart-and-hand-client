import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Loader2 } from "lucide-react";

const ShiftReport = () => {
  console.log('ShiftReport component rendering'); // Add this line
  const { shiftId } = useParams();
  console.log('ShiftReport - Shift ID:', shiftId); // Keep this existing log
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [shift, setShift] = useState(null);
  const [formData, setFormData] = useState({
    tasksCompleted: {
      personalCare: false,
      medication: false,
      mobility: false,
      mealPrep: false,
      housekeeping: false,
      companionship: false,
    },
    clientCondition: "",
    notes: "",
    concerns: "",
    followUpNeeded: false,
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    const fetchShiftDetails = async () => {
      try {
        console.log('Fetching shift details for ID:', shiftId);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/time-logs/${shiftId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch shift details');
        }

        const data = await response.json();
        console.log('Received shift data:', data);
        setShift(data);
      } catch (error) {
        console.error('Error fetching shift details:', error);
        addToast({
          title: "Error",
          description: "Failed to fetch shift details",
          variant: "error",
        });
      }
    };
  
    fetchShiftDetails();
  }, [shiftId, token, navigate, addToast]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/time-logs/${shiftId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit report');

      addToast({
        title: "Success",
        description: "Shift report submitted successfully",
        variant: "success",
      });

      navigate("/staff/dashboard");
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to submit shift report",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!shift) {
    return <div className="text-center py-8">Loading shift details...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Shift Report</CardTitle>
          <CardDescription>
            Complete this report for your shift with {shift.clientName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Tasks Completed</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.tasksCompleted).map(([task, checked]) => (
                  <div key={task} className="flex items-center space-x-2">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          tasksCompleted: {
                            ...prev.tasksCompleted,
                            [task]: checked,
                          },
                        }))
                      }
                    />
                    <label className="text-sm">
                      {task.charAt(0).toUpperCase() + task.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">
                Client's Condition
              </label>
              <Textarea
                value={formData.clientCondition}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientCondition: e.target.value,
                  }))
                }
                placeholder="Describe the client's general condition and mood"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Any additional notes about the shift"
                rows={3}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Concerns</label>
              <Textarea
                value={formData.concerns}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    concerns: e.target.value,
                  }))
                }
                placeholder="Note any concerns or issues that need attention"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.followUpNeeded}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    followUpNeeded: checked,
                  }))
                }
              />
              <label>Follow-up needed</label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/staff/dashboard")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ShiftReport;