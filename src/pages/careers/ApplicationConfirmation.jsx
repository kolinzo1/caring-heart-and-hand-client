import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle, Clock, Mail, ArrowRight } from "lucide-react";

const ApplicationConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <CardTitle className="text-2xl mb-2">
              Application Submitted Successfully!
            </CardTitle>
            <CardDescription className="text-lg mb-8">
              Thank you for your interest in joining our team.
            </CardDescription>

            {formData && (
              <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
                <h3 className="font-semibold mb-4">Application Details</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Position:</span>{" "}
                    {formData.position}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {formData.email}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">What happens next?</h4>
                  <p className="text-gray-600">
                    Our hiring team will review your application and get back to
                    you within 3-5 business days regarding next steps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Watch your inbox</h4>
                  <p className="text-gray-600">
                    You'll receive a confirmation email shortly with more
                    details about your application.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate("/careers")}>
              View More Opportunities
            </Button>
            <Button onClick={() => navigate("/")} className="flex items-center">
              Return Home
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationConfirmation;
