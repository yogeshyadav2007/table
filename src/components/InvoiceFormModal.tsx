import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";

// Invoice Form Modal Component
function InvoiceFormModal({ open, onClose, onSubmit, mode, initialData, existingInvoices }: any) {
  // Error state
  const [errors, setErrors] = useState<any>({});

  // Form data state
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    "Invoice Number": "",
    "Smart Property": "",
    "Smart Property City": "",
    "Opportunity Name": "",
    "Opportunity Owner": "",
    "Total Commission": "",
    "Days Past Due": "",
    "Move In Date": "",
    "Application Date": "",
    "AR Owner": "",
    "Accounts Receivable Stage": "",
    "AR Last Modified Date": ""
  });

  // Populate form data when editing an invoice
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
    }
    else {
      setFormData({
        "Invoice Number": "",
        "Smart Property": "",
        "Smart Property City": "",
        "Opportunity Name": "", 
        "Opportunity Owner": "",
        "Total Commission": "", 
        "Days Past Due": "",
        "Move In Date": "", 
        "Application Date": "",
        "AR Owner": "", 
        "Accounts Receivable Stage": "",
        "AR Last Modified Date": ""
      });
    }
  }, [mode, initialData]);

  // Get current date
  const today = new Date().toISOString().split("T")[0];

  // Form fields
  const fields = [
    { key: "Invoice Number", type: "text" },
    { key: "Smart Property", type: "text" },
    { key: "Smart Property City", type: "text" },
    { key: "Opportunity Name", type: "text" },
    { key: "Opportunity Owner", type: "text" },
    { key: "Total Commission", type: "number" },
    { key: "Days Past Due", type: "number" },
    { key: "Move In Date", type: "date" },
    { key: "Application Date", type: "date" },
    { key: "AR Owner", type: "text" },
    { key: "Accounts Receivable Stage", type: "select" },
    { key: "AR Last Modified Date", type: "date" },
  ];

  // Handle form submission with validation
  const handleSubmit = () => {
    let newErrors: any = {};
    const moveInDate = new Date(formData["Move In Date"]);
    const appDate = new Date(formData["Application Date"]);

    // Required field validation
    Object.entries(formData).forEach(([key, value]) => {
      if (!value || value.toString().trim() === "") {
        newErrors[key] = "This field is required";
      }
    });

    // Move In Date validation
    if (moveInDate.getTime() > appDate.getTime()) {
      setErrors(( prev: any ) => ({
        ...prev,
        "Move In Date": "Cannot be after Application Date"
      }));
    }

    // Application Date validation
    if (appDate.getTime() > new Date(today).getTime()) {
      setErrors((prev: any) => ({
        ...prev,
        "Application Date": "Cannot be future date"
      }));
    }

    // Unique Invoice Number validation
    if (
      mode === "add" &&
      existingInvoices.some(
        (invoice: any) =>
          invoice["Invoice Number"].toLowerCase().trim() ===
          formData["Invoice Number"].toLowerCase().trim()
      )
    ) {
      newErrors["Invoice Number"] = "Invoice Number already exists";
    }

    // If there are validation errors, set them and do not submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  // Render input field with error handling
  const renderInput = (key: string, type: string) => (
    <div className="flex flex-col" key={key}>
      <div className="relative">

        {/* Dropdown */}
        {type === "select" ? (
          <select
            className={`w-full  bg-white bg-100 border rounded-md px-3 py-2 text-blue-gray-700 focus:border-black focus:ring-1 transition ${errors[key] ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-blue-gray-200 focus:border-black focus:ring-black"}`}
            value={formData[key]}
            disabled={mode === "edit" && key === "Invoice Number"}
            onChange={(e) => {
              setFormData({ ...formData, [key]: e.target.value });
              setErrors((prev: any) => ({ ...prev, [key]: "" }));
            }}
          >
            <option value="">Select Stage</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        ) : (
          // Input field
          <Input
            type={type === "date" ? "date" : type === "number" ? "number" : "text"}
            label={key}
            value={formData[key]}
            error={!!errors[key]}
            max={type === "date" ? today : undefined}
            disabled={mode === "edit" && key === "Invoice Number"}
            onChange={(e) => {
              setFormData({ ...formData, [key]: e.target.value });
              setErrors((prev: any) => ({ ...prev, [key]: "" }));
            }}
            onFocus={(e) => {
              if (type === "date") {
                (e.target as HTMLInputElement).showPicker?.();
              }
            }}
            className={type === "date" ? "pr-10" : ""}
          />
        )}
        {/* Calendar icon */}
        {type === "date" && (
          <CalendarIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={(e) => {
              const input = (e.currentTarget
                .closest("div")
                ?.querySelector("input")) as HTMLInputElement;
              input?.showPicker?.();
              input?.focus();
            }}
          />
        )}
      </div>
      {/* Error message */}
      {errors[key] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[key]}
        </p>
      )}
    </div>
  );


  return (
    <Dialog open={open} handler={onClose} size="md" className="max-h-[90vh] flex flex-col">
      <DialogHeader>{mode === "edit" ? "Edit Invoice" : "Add Invoice"}</DialogHeader>

      <DialogBody className="overflow-y-auto flex-1">
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(field => renderInput(field.key, field.type))}
        </div>

      </DialogBody>
      {/* Dialog footer */}
      <DialogFooter className="sticky bottom-0 bg-white">
        <Button variant="text" onClick={() => { onClose(); setFormData({
          "Invoice Number": "",
          "Smart Property": "",
          "Smart Property City": "",
          "Opportunity Name": "",
          "Opportunity Owner": "",
          "Total Commission": "",
          "Days Past Due": "",
          "Move In Date": "",
          "Application Date": "",
          "AR Owner": "",
          "Accounts Receivable Stage": "",
          "AR Last Modified Date": ""
        });
          setErrors({}); }}>Cancel</Button>

        <Button variant="gradient" onClick={ handleSubmit }>Save</Button>
      </DialogFooter>
    </Dialog>
  );
}

export default InvoiceFormModal;