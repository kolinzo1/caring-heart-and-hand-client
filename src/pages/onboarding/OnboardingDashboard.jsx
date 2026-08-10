import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApplicantAuth } from "../../context/ApplicantAuthContext";
import { useToast } from "../../hooks/useToast";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";
import OnboardingDocumentForm from "./OnboardingDocumentForm";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const STATUS_META = {
  approved: { label: "Approved", icon: <CheckCircle2 className="w-5 h-5 text-green-600" />, badge: "success" },
  submitted: { label: "Submitted - Pending Review", icon: <Clock className="w-5 h-5 text-yellow-600" />, badge: "warning" },
  rejected: { label: "Needs Changes", icon: <XCircle className="w-5 h-5 text-red-600" />, badge: "destructive" },
  pending: { label: "Not Started", icon: <Circle className="w-5 h-5 text-gray-400" />, badge: "outline" },
};

const OnboardingDashboard = () => {
  const { token, applicant, logout } = useApplicantAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState(null);

  const fetchChecklist = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/onboarding/checklist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load checklist");
      setChecklist(data);
    } catch (error) {
      addToast({ title: "Error", description: error.message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [token, addToast]);

  useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);

  const handleLogout = () => {
    logout();
    navigate("/portal/login");
  };

  const completedCount = checklist.filter((d) => d.status === "submitted" || d.status === "approved").length;
  const progressPct = checklist.length ? Math.round((completedCount / checklist.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Onboarding Checklist</h1>
            {applicant && (
              <p className="text-gray-600 mt-1">Welcome, {applicant.first_name || applicant.email}</p>
            )}
          </div>
          <Button variant="outline" onClick={handleLogout}>Log Out</Button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{completedCount} of {checklist.length} completed</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-6">
          This portal captures onboarding information and a typed e-signature for
          internal HR records. It is not a substitute for legally required
          government forms — please confirm with your HR/legal advisor that this
          process meets your compliance needs.
        </p>

        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading...</p>
        ) : (
          <div className="space-y-3">
            {checklist.map((doc) => {
              const meta = STATUS_META[doc.status || "pending"];
              return (
                <Card key={doc.template_id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {meta.icon}
                      <div>
                        <p className="font-semibold">{doc.title}</p>
                        <p className="text-sm text-gray-500">{meta.label}</p>
                        {doc.status === "rejected" && doc.admin_notes && (
                          <p className="text-sm text-red-600 mt-1">Note: {doc.admin_notes}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant={doc.status === "approved" ? "outline" : "default"}
                      onClick={() => setActiveDoc(doc)}
                    >
                      {doc.status === "approved" ? "View" : doc.status ? "Edit" : "Complete"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!activeDoc} onOpenChange={(open) => !open && setActiveDoc(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          {activeDoc && (
            <>
              <DialogHeader>
                <DialogTitle>{activeDoc.title}</DialogTitle>
              </DialogHeader>
              <OnboardingDocumentForm
                document={activeDoc}
                onCancel={() => setActiveDoc(null)}
                onSubmitted={() => {
                  setActiveDoc(null);
                  fetchChecklist();
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnboardingDashboard;
