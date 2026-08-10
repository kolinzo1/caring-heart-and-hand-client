// Fixed field layouts for the four documents that need structured data
// entry rather than just a signature. Keyed by template title since that's
// stable across environments (seeded once in database/migrations/002_onboarding_portal.sql).
export const STRUCTURED_FORM_FIELDS = {
  "Form W-4 - Federal Tax Withholding": [
    { name: "filing_status", label: "Filing Status", type: "select", options: ["Single", "Married filing jointly", "Head of household"], required: true },
    { name: "dependents_amount", label: "Dependent Credit Amount ($)", type: "number" },
    { name: "other_income", label: "Other Income (not from jobs)", type: "number" },
    { name: "deductions", label: "Deductions (if itemizing)", type: "number" },
    { name: "extra_withholding", label: "Extra Withholding Per Pay Period", type: "number" },
  ],
  "Form I-9 - Employment Eligibility Verification": [
    { name: "full_legal_name", label: "Full Legal Name", type: "text", required: true },
    { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
    { name: "ssn", label: "Social Security Number", type: "text", required: true },
    { name: "citizenship_status", label: "Citizenship / Immigration Status", type: "select", options: ["U.S. Citizen", "Noncitizen National", "Lawful Permanent Resident", "Authorized Alien"], required: true },
    { name: "address", label: "Current Address", type: "text", required: true },
  ],
  "Direct Deposit Authorization": [
    { name: "bank_name", label: "Bank Name", type: "text", required: true },
    { name: "routing_number", label: "Routing Number", type: "text", required: true },
    { name: "account_number", label: "Account Number", type: "text", required: true },
    { name: "account_type", label: "Account Type", type: "select", options: ["Checking", "Savings"], required: true },
  ],
  "Emergency Contact Information": [
    { name: "contact_name", label: "Contact Full Name", type: "text", required: true },
    { name: "relationship", label: "Relationship", type: "text", required: true },
    { name: "phone", label: "Phone Number", type: "tel", required: true },
    { name: "alternate_phone", label: "Alternate Phone (optional)", type: "tel" },
  ],
};
