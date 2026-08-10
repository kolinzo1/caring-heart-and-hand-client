import React, { useState } from "react";
import { useApplicantAuth } from "../../context/ApplicantAuthContext";
import { useToast } from "../../hooks/useToast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { FileUpload } from "../../components/ui/FileUpload";
import { STRUCTURED_FORM_FIELDS } from "./structuredFormFields";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const OnboardingDocumentForm = ({ document, onSubmitted, onCancel }) => {
  const { token } = useApplicantAuth();
  const { addToast } = useToast();
  const structuredFields = STRUCTURED_FORM_FIELDS[document.title];
  const initialFieldValues = {};
  if (structuredFields) {
    structuredFields.forEach((f) => {
      initialFieldValues[f.name] = document.form_data
        ? JSON.parse(document.form_data)[f.name] || ""
        : "";
    });
  }

  const [fieldValues, setFieldValues] = useState(initialFieldValues);
  const [signedName, setSignedName] = useState(document.signed_name || "");
  const [agreed, setAgreed] = useState(!!document.signed_name);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (name, value) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (document.requires_signature && (!signedName.trim() || !agreed)) {
      addToast({ title: "Error", description: "Please type your name and confirm agreement", variant: "error" });
      return;
    }
    if (document.requires_upload && !file && !document.uploaded_file_url) {
      addToast({ title: "Error", description: "Please attach the required file", variant: "error" });
      return;
    }
    if (structuredFields) {
      const missing = structuredFields.find((f) => f.required && !fieldValues[f.name]);
      if (missing) {
        addToast({ title: "Error", description: `${missing.label} is required`, variant: "error" });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (document.requires_signature) {
        formData.append("signed_name", signedName.trim());
      }
      if (structuredFields) {
        formData.append("form_data", JSON.stringify(fieldValues));
      }
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(
        `${API_URL}/api/onboarding/submissions/${document.template_id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      addToast({ title: "Submitted", description: "Document submitted successfully", variant: "success" });
      onSubmitted();
    } catch (error) {
      addToast({ title: "Error", description: error.message, variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">{document.description}</p>

      {document.reference_file_url && (
        <a
          href={document.reference_file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline block"
        >
          View reference document
        </a>
      )}

      {structuredFields && (
        <div className="grid sm:grid-cols-2 gap-4">
          {structuredFields.map((field) => (
            <div key={field.name} className={field.type === "select" ? "" : ""}>
              <label className="block text-sm font-medium mb-1">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </label>
              {field.type === "select" ? (
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  value={fieldValues[field.name] || ""}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                >
                  <option value="" disabled>Select...</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <Input
                  type={field.type}
                  value={fieldValues[field.name] || ""}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {document.requires_upload && (
        <FileUpload
          label="Upload document"
          acceptedTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
          maxSize={5}
          currentFile={file}
          onFileSelect={setFile}
          onRemove={() => setFile(null)}
        />
      )}
      {document.requires_upload && !file && document.uploaded_file_url && (
        <p className="text-xs text-gray-500">A file was previously uploaded. Select a new one to replace it.</p>
      )}

      {document.requires_signature && (
        <div className="space-y-3 border-t pt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type your full legal name to sign</label>
            <Input value={signedName} onChange={(e) => setSignedName(e.target.value)} placeholder="Full legal name" />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox checked={agreed} onCheckedChange={setAgreed} className="mt-1" />
            <span className="text-sm text-gray-600">
              I certify that the information provided is true and accurate, and I agree to the terms of this document.
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default OnboardingDocumentForm;
