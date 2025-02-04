import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const RequestConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">
                Request Submitted Successfully!
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Thank you for your care request. Our team will review your
                information and contact you within 24 hours to discuss your care
                needs.
              </p>

              {formData && (
                <div className="text-left bg-gray-50 p-6 rounded-lg mb-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Request Summary
                  </h2>
                  <div className="space-y-3">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Care Type:</span>{" "}
                      {formData.careType}
                    </p>
                    <p>
                      <span className="font-medium">Start Date:</span>{" "}
                      {formData.startDate}
                    </p>
                    <p>
                      <span className="font-medium">Frequency:</span>{" "}
                      {formData.frequency}
                    </p>
                    <p>
                      <span className="font-medium">Contact Email:</span>{" "}
                      {formData.email}
                    </p>
                    <p>
                      <span className="font-medium">Contact Phone:</span>{" "}
                      {formData.phone}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Return Home
                </Button>
                <Button
                  onClick={() => navigate("/contact")}
                  className="w-full sm:w-auto"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestConfirmationPage;
