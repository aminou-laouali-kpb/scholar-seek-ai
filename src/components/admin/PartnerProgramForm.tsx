import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { PartnerProgram } from "@/pages/admin/AdminPartnerPrograms";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: PartnerProgram | null;
  onSaved: () => void;
}

const EMPTY = {
  school_name: "", school_slug: "", partner_status: "partner",
  country: "", city: "", campus_name: "",
  program_name: "", program_family: "", degree_level: "",
  duration: "", language_of_instruction: "",
  tuition_amount: "", tuition_currency: "EUR", tuition_period: "per year",
  application_intake: "", eligibility_academic: "", eligibility_language: "",
  required_documents: "", application_process: "",
  scholarship_available: "Unknown", status: "contact_us",
  source_url: "", notes_internal: "",
  is_published: true, is_featured: false,
};

const PartnerProgramForm = ({ open, onOpenChange, program, onSaved }: Props) => {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (program) {
      setForm({
        school_name: program.school_name,
        school_slug: program.school_slug,
        partner_status: program.partner_status,
        country: program.country,
        city: program.city,
        campus_name: program.campus_name,
        program_name: program.program_name,
        program_family: program.program_family,
        degree_level: program.degree_level,
        duration: program.duration,
        language_of_instruction: program.language_of_instruction,
        tuition_amount: program.tuition_amount,
        tuition_currency: program.tuition_currency,
        tuition_period: program.tuition_period,
        application_intake: program.application_intake,
        eligibility_academic: program.eligibility_academic,
        eligibility_language: program.eligibility_language,
        required_documents: program.required_documents,
        application_process: program.application_process,
        scholarship_available: program.scholarship_available,
        status: program.status,
        source_url: program.source_url,
        notes_internal: program.notes_internal,
        is_published: program.is_published,
        is_featured: program.is_featured,
      });
    } else {
      setForm(EMPTY);
    }
  }, [program, open]);

  const handleSave = async () => {
    if (!form.school_name || !form.program_name) {
      toast({ title: "School name and program name are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = { ...form };

    if (program) {
      await supabase.from("partner_programs").update(payload).eq("id", program.id);
      toast({ title: "Program updated" });
    } else {
      await supabase.from("partner_programs").insert(payload);
      toast({ title: "Program created" });
    }
    setSaving(false);
    onOpenChange(false);
    onSaved();
  };

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{program ? "Edit Partner Program" : "New Partner Program"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* School info */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div><Label>School Name *</Label><Input value={form.school_name} onChange={(e) => set("school_name", e.target.value)} /></div>
            <div><Label>School Slug</Label><Input value={form.school_slug} onChange={(e) => set("school_slug", e.target.value)} placeholder="e.g. icn-business-school" /></div>
            <div>
              <Label>Partner Status</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.partner_status} onChange={(e) => set("partner_status", e.target.value)}>
                <option value="partner">Partner</option>
                <option value="preferred">Preferred</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div><Label>Country *</Label><Input value={form.country} onChange={(e) => set("country", e.target.value)} /></div>
            <div><Label>City</Label><Input value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
            <div><Label>Campus Name</Label><Input value={form.campus_name} onChange={(e) => set("campus_name", e.target.value)} /></div>
          </div>

          {/* Program info */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div><Label>Program Name *</Label><Input value={form.program_name} onChange={(e) => set("program_name", e.target.value)} /></div>
            <div><Label>Program Family</Label><Input value={form.program_family} onChange={(e) => set("program_family", e.target.value)} /></div>
            <div><Label>Degree Level</Label><Input value={form.degree_level} onChange={(e) => set("degree_level", e.target.value)} placeholder="Bachelor, Master, etc." /></div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div><Label>Duration</Label><Input value={form.duration} onChange={(e) => set("duration", e.target.value)} /></div>
            <div><Label>Language of Instruction</Label><Input value={form.language_of_instruction} onChange={(e) => set("language_of_instruction", e.target.value)} /></div>
            <div><Label>Application Intake</Label><Input value={form.application_intake} onChange={(e) => set("application_intake", e.target.value)} /></div>
          </div>

          {/* Tuition */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div><Label>Tuition Amount</Label><Input value={form.tuition_amount} onChange={(e) => set("tuition_amount", e.target.value)} /></div>
            <div>
              <Label>Currency</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.tuition_currency} onChange={(e) => set("tuition_currency", e.target.value)}>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="MAD">MAD</option>
                <option value="AED">AED</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div><Label>Tuition Period</Label><Input value={form.tuition_period} onChange={(e) => set("tuition_period", e.target.value)} /></div>
          </div>

          {/* Eligibility */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Academic Eligibility</Label><Textarea value={form.eligibility_academic} onChange={(e) => set("eligibility_academic", e.target.value)} rows={2} /></div>
            <div><Label>Language Eligibility</Label><Textarea value={form.eligibility_language} onChange={(e) => set("eligibility_language", e.target.value)} rows={2} /></div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Required Documents</Label><Textarea value={form.required_documents} onChange={(e) => set("required_documents", e.target.value)} rows={2} /></div>
            <div><Label>Application Process</Label><Textarea value={form.application_process} onChange={(e) => set("application_process", e.target.value)} rows={2} /></div>
          </div>

          {/* Status & admin */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Scholarship Available</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.scholarship_available} onChange={(e) => set("scholarship_available", e.target.value)}>
                <option value="Unknown">Unknown</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="open">Open</option>
                <option value="rolling">Rolling</option>
                <option value="contact_us">Contact Us</option>
                <option value="to_confirm">To Confirm</option>
              </select>
            </div>
            <div><Label>Source URL (admin only)</Label><Input value={form.source_url} onChange={(e) => set("source_url", e.target.value)} /></div>
          </div>

          <div><Label>Internal Notes (admin only)</Label><Textarea value={form.notes_internal} onChange={(e) => set("notes_internal", e.target.value)} rows={2} /></div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(v) => set("is_featured", v)} /><Label>Featured</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_published} onCheckedChange={(v) => set("is_published", v)} /><Label>Published</Label></div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button variant="accent" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerProgramForm;
