import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApplicantAuth } from "../../context/ApplicantAuthContext";
import { useToast } from "../../hooks/useToast";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Mail, Lock } from "lucide-react";

const ApplicantLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useApplicantAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      addToast({ title: "Welcome back!", description: "Logged in successfully", variant: "success" });
      navigate("/portal/onboarding");
    } catch (error) {
      addToast({ title: "Error", description: error.message || "Invalid email or password", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Applicant Portal</h1>
            <p className="text-gray-600 mt-2">Log in to complete your onboarding</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Just been hired?{" "}
            <Link to="/portal/register" className="text-primary hover:underline">
              Create your portal account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicantLoginPage;
