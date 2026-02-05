import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import { useState, useEffect } from "react";

function InvoiceFormModal({ open, onClose, onSubmit, mode, initialData }: any) {
  const [formData, setFormData] = useState({
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

  return (
    <Dialog open={open} handler={onClose} size="md" className="max-h-[90vh] flex flex-col">
      <DialogHeader>Add Invoice</DialogHeader>

      <DialogBody className="overflow-y-auto flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input label="Invoice Number" value={formData["Invoice Number"]} required
            onChange={(e) => setFormData({...formData, "Invoice Number": e.target.value})}
          />

          <Input label="Smart Property" value={formData["Smart Property"]} required
            onChange={(e) => setFormData({...formData, "Smart Property": e.target.value})}
          />

          <Input label="Smart Property City" value={formData["Smart Property City"]} required
            onChange={(e) => setFormData({...formData, "Smart Property City": e.target.value})}
          />

          <Input label="Opportunity Name" value={formData["Opportunity Name"]} required
            onChange={(e) => setFormData({...formData, "Opportunity Name": e.target.value})}
          />

          <Input label="Opportunity Owner" value={formData["Opportunity Owner"]} required
            onChange={(e) => setFormData({...formData, "Opportunity Owner": e.target.value})}
          />

          <Input label="Total Commission" value={formData["Total Commission"]} required
            onChange={(e) => setFormData({...formData, "Total Commission": e.target.value})}
          />

          <Input label="Days Past Due" value={formData["Days Past Due"]} required
            onChange={(e) => setFormData({...formData, "Days Past Due": e.target.value})}
          />

          <Input label="Move In Date" value={formData["Move In Date"]} required
            onChange={(e) => setFormData({...formData, "Move In Date": e.target.value})}
          />

          <Input label="Application Date" value={formData["Application Date"]} required
            onChange={(e) => setFormData({...formData, "Application Date": e.target.value})}
          />

          <Input label="AR Owner" value={formData["AR Owner"]} required
            onChange={(e) => setFormData({...formData, "AR Owner": e.target.value})}
          />

          <Input label="Accounts Receivable Stage" value={formData["Accounts Receivable Stage"]} required
            onChange={(e) => setFormData({...formData, "Accounts Receivable Stage": e.target.value})}
          />

          <Input label="AR Last Modified Date" value={formData["AR Last Modified Date"]} required
            onChange={(e) => setFormData({...formData, "AR Last Modified Date": e.target.value})}
          />

        </div>
      </DialogBody>

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
        <Button variant="gradient" onClick={() => onSubmit(formData)}>Save</Button>
      </DialogFooter>
    </Dialog>
  );
}

export default InvoiceFormModal;