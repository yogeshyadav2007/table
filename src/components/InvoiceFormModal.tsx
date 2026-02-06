import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";

// Invoice Form Modal Component
function InvoiceFormModal({ open, onClose, onSubmit, mode, initialData, existingInvoices }: any) {
  const [errors, setErrors] = useState<any>({});
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
    { key: "Accounts Receivable Stage", type: "text" },
    { key: "AR Last Modified Date", type: "date" },
  ];


  // Handle form submission with validation
  const handleSubmit = () => {
    let newErrors: any = {};
    // Required field validation
    Object.entries(formData).forEach(([key, value]) => {
      if (!value || value.toString().trim() === "") {
        newErrors[key] = "This field is required";
      }
    });

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
        <Input
          type={type}
          label={key}
          value={formData[key]}
          error={!!errors[key]}
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
        }); }}>Cancel</Button>

        <Button variant="gradient" onClick={ handleSubmit }>Save</Button>
      </DialogFooter>
    </Dialog>
  );
}

export default InvoiceFormModal;