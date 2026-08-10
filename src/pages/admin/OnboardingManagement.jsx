import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../../hooks/useToast";
import { onboardingService } from "../../services/api/onboardingService";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { CheckCircle2, XCircle, Clock, Circle, Plus } from "lucide-react";

const CATEGORY_LABELS = {
  tax_forms: "Tax / Payroll",
  policy_acknowledgment: "Policy Acknowledgment",
  compliance: "Compliance",
  custom: "Custom",
};

const STATUS_META = {
  approved: { label: "Approved", icon: <CheckCircle2 className="w-4 h-4 text-green-600" /> },
  submitted: { label: "Submitted", icon: <Clock className="w-4 h-4 text-yellow-600" /> },
  rejected: { label: "Rejected", icon: <XCircle className="w-4 h-4 text-red-600" /> },
  pending: { label: "Not Started", icon: <Circle className="w-4 h-4 text-gray-400" /> },
};

const OnboardingManagement = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("applicants");

  // Applicants tab state
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [reviewNotes, setReviewNotes] = useState({});

  // Templates tab state
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    category: "custom",
    description: "",
    requires_upload: false,
    requires_signature: true,
  });

  const fetchApplicants = useCallback(async () => {
    try {
      setLoadingApplicants(true);
      const data = await onboardingService.getHiredApplicants();
      setApplicants(data);
    } catch (error) {
      addToast({ title: "Error", description: "Failed to load hired applicants", variant: "error" });
    } finally {
      setLoadingApplicants(false);
    }
  }, [addToast]);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoadingTemplates(true);
      const data = await onboardingService.getTemplates();
      setTemplates(data);
    } catch (error) {
      addToast({ title: "Error", description: "Failed to load document templates", variant: "error" });
    } finally {
      setLoadingTemplates(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchApplicants();
    fetchTemplates();
  }, [fetchApplicants, fetchTemplates]);

  const openApplicant = async (applicant) => {
    setSelectedApplicant(applicant);
    setLoadingSubmissions(true);
    try {
      const data = await onboardingService.getApplicantSubmissions(applicant.application_id);
      setSubmissions(data);
    } catch (error) {
      addToast({ title: "Error", description: "Failed to load submissions", variant: "error" });
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleReview = async (submissionId, status) => {
    try {
      await onboardingService.reviewSubmission(submissionId, status, reviewNotes[submissionId] || "");
      addToast({ title: "Success", description: `Submission ${status}`, variant: "success" });
      openApplicant(selectedApplicant);
      fetchApplicants();
    } catch (error) {
      addToast({ title: "Error", description: "Failed to review submission", variant: "error" });
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      await onboardingService.createTemplate(newTemplate);
      addToast({ title: "Success", description: "Template created", variant: "success" });
      setShowNewTemplate(false);
      setNewTemplate({ title: "", category: "custom", description: "", requires_upload: false, requires_signature: true });
      fetchTemplates();
    } catch (error) {
      addToast({ title: "Error", description: "Failed to create template", variant: "error" });
    }
  };

  const handleToggleActive = async (template) => {
    try {
      await onboardingService.updateTemplate(template.id, { is_active: template.is_active ? 0 : 1 });
      fetchTemplates();
    } catch (error) {
      addToast({ title: "Error", description: "Failed to update template", variant: "error" });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Onboarding</h1>

      <div className="flex gap-2 mb-6">
        <Button variant={activeTab === "applicants" ? "default" : "outline"} onClick={() => setActiveTab("applicants")}>
          Hired Applicants
        </Button>
        <Button variant={activeTab === "templates" ? "default" : "outline"} onClick={() => setActiveTab("templates")}>
          Document Templates
        </Button>
      </div>

      {activeTab === "applicants" && (
        <Card>
          <CardHeader>
            <CardTitle>Hired Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingApplicants ? (
              <p className="text-gray-500">Loading...</p>
            ) : applicants.length === 0 ? (
              <p className="text-gray-500">No hired applicants yet.</p>
            ) : (
              <div className="space-y-2">
                {applicants.map((a) => {
                  const pct = a.total_docs ? Math.round((a.completed_docs / a.total_docs) * 100) : 0;
                  return (
                    <div
                      key={a.application_id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => openApplicant(a)}
                    >
                      <div>
                        <p className="font-medium">{a.first_name} {a.last_name}</p>
                        <p className="text-sm text-gray-500">{a.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{pct}% complete</p>
                        <p className="text-xs text-gray-500">
                          {a.has_portal_account ? "Portal account created" : "Not registered yet"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "templates" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Document Templates</CardTitle>
            <Button size="sm" onClick={() => setShowNewTemplate(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add Document
            </Button>
          </CardHeader>
          <CardContent>
            {loadingTemplates ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <div className="space-y-2">
                {templates.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{t.title}</p>
                      <p className="text-sm text-gray-500">
                        {CATEGORY_LABELS[t.category] || t.category}
                        {t.requires_upload ? " · Requires upload" : ""}
                        {t.requires_signature ? " · Requires signature" : ""}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleToggleActive(t)}>
                      {t.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Applicant submission review dialog */}
      <Dialog open={!!selectedApplicant} onOpenChange={(open) => !open && setSelectedApplicant(null)}>
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
          {selectedApplicant && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedApplicant.first_name} {selectedApplicant.last_name} - Onboarding Progress
                </DialogTitle>
              </DialogHeader>
              {loadingSubmissions ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <div className="space-y-3">
                  {submissions.map((s) => {
                    const meta = STATUS_META[s.status || "pending"];
                    return (
                      <div key={s.template_id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {meta.icon}
                            <span className="font-medium">{s.title}</span>
                          </div>
                          <span className="text-sm text-gray-500">{meta.label}</span>
                        </div>

                        {s.status === "submitted" && (
                          <div className="mt-3 space-y-2">
                            {s.signed_name && (
                              <p className="text-sm text-gray-600">Signed by: {s.signed_name}</p>
                            )}
                            {s.form_data && (
                              <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(JSON.parse(s.form_data), null, 2)}
                              </pre>
                            )}
                            {s.uploaded_file_url && (
                              <a
                                href={s.uploaded_file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline block"
                              >
                                View uploaded file
                              </a>
                            )}
                            <Textarea
                              placeholder="Notes (optional)"
                              value={reviewNotes[s.submission_id] || ""}
                              onChange={(e) =>
                                setReviewNotes((prev) => ({ ...prev, [s.submission_id]: e.target.value }))
                              }
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleReview(s.submission_id, "approved")}>
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReview(s.submission_id, "rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New template dialog */}
      <Dialog open={showNewTemplate} onOpenChange={setShowNewTemplate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Onboarding Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTemplate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={newTemplate.title}
                onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={newTemplate.requires_signature}
                onCheckedChange={(v) => setNewTemplate({ ...newTemplate, requires_signature: v })}
              />
              <span className="text-sm">Requires typed signature</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={newTemplate.requires_upload}
                onCheckedChange={(v) => setNewTemplate({ ...newTemplate, requires_upload: v })}
              />
              <span className="text-sm">Requires file upload</span>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowNewTemplate(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnboardingManagement;
