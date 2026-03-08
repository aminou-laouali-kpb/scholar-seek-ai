import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { AdminAdmission } from "@/pages/admin/AdminAdmissions";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admission: AdminAdmission | null;
  onSaved: () => void;
}

const EMPTY = {
  institution_name: "", country: "", country_flag: "",
  institution_type: "university", programs: "", levels: "",
  intake: "", description_en: "", description_fr: "",
  why_fit_en: "", why_fit_fr: "", budget_level: "medium",
  status: "open", is_featured: false, is_published: true,
  external_link: "", admin_notes: "", relevance_tags: "",
};

const AdmissionForm = ({ open, onOpenChange, admission, onSaved }: Props) => {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (admission) {
      setForm({
        institution_name: admission.institution_name,
        country: admission.country,
        country_flag: admission.country_flag,
        institution_type: admission.institution_type,
        programs: admission.programs.join(", "),
        levels: admission.levels.join(", "),
        intake: admission.intake,
        description_en: admission.description_en,
        description_fr: admission.description_fr,
        why_fit_en: admission.why_fit_en,
        why_fit_fr: admission.why_fit_fr,
        budget_level: admission.budget_level,
        status: admission.status,
        is_featured: admission.is_featured,
        is_published: admission.is_published,
        external_link: admission.external_link || "",
        admin_notes: admission.admin_notes || "",
        relevance_tags: admission.relevance_tags.join(", "),
      });
    } else {
      setForm(EMPTY);
    }
  }, [admission, open]);

  const handleSave = async () => {
    if (!form.institution_name || !form.country) {
      toast({ title: "Institution name and country are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      institution_name: form.institution_name,
      country: form.country,
      country_flag: form.country_flag,
      institution_type: form.institution_type,
      programs: form.programs.split(",").map((s) => s.trim()).filter(Boolean),
      levels: form.levels.split(",").map((s) => s.trim()).filter(Boolean),
      intake: form.intake,
      description_en: form.description_en,
      description_fr: form.description_fr,
      why_fit_en: form.why_fit_en,
      why_fit_fr: form.why_fit_fr,
      budget_level: form.budget_level,
      status: form.status,
      is_featured: form.is_featured,
      is_published: form.is_published,
      external_link: form.external_link || null,
      admin_notes: form.admin_notes || null,
      relevance_tags: form.relevance_tags.split(",").map((s) => s.trim()).filter(Boolean),
    };

    if (admission) {
      await supabase.from("admin_admissions").update(payload).eq("id", admission.id);
      toast({ title: "Admission updated" });
    } else {
      await supabase.from("admin_admissions").insert(payload);
      toast({ title: "Admission created" });
    }
    setSaving(false);
    onOpenChange(false);
    onSaved();
  };

  const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{admission ? "Edit Admission" : "New Admission"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Institution Name *</Label><Input value={form.institution_name} onChange={(e) => set("institution_name", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Country Code *</Label><Input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="FR" /></div>
              <div><Label>Flag</Label><Input value={form.country_flag} onChange={(e) => set("country_flag", e.target.value)} placeholder="🇫🇷" /></div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Institution Type</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.institution_type} onChange={(e) => set("institution_type", e.target.value)}>
                <option value="university">University</option>
                <option value="grande-ecole">Grande École</option>
                <option value="community-college">Community College</option>
                <option value="college">College</option>
                <option value="language-pathway">Language Pathway</option>
              </select>
            </div>
            <div><Label>Programs (comma-separated)</Label><Input value={form.programs} onChange={(e) => set("programs", e.target.value)} /></div>
            <div><Label>Levels (comma-separated)</Label><Input value={form.levels} onChange={(e) => set("levels", e.target.value)} /></div>
          </div>

          <div><Label>Intake</Label><Input value={form.intake} onChange={(e) => set("intake", e.target.value)} placeholder="September 2026" /></div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Description (EN)</Label><Textarea value={form.description_en} onChange={(e) => set("description_en", e.target.value)} rows={3} /></div>
            <div><Label>Description (FR)</Label><Textarea value={form.description_fr} onChange={(e) => set("description_fr", e.target.value)} rows={3} /></div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Why It Fits (EN)</Label><Textarea value={form.why_fit_en} onChange={(e) => set("why_fit_en", e.target.value)} rows={2} /></div>
            <div><Label>Why It Fits (FR)</Label><Textarea value={form.why_fit_fr} onChange={(e) => set("why_fit_fr", e.target.value)} rows={2} /></div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Budget Level</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.budget_level} onChange={(e) => set("budget_level", e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div><Label>External Link</Label><Input value={form.external_link} onChange={(e) => set("external_link", e.target.value)} /></div>
          </div>

          <div><Label>Relevance Tags (comma-separated)</Label><Input value={form.relevance_tags} onChange={(e) => set("relevance_tags", e.target.value)} /></div>
          <div><Label>Admin Notes</Label><Textarea value={form.admin_notes} onChange={(e) => set("admin_notes", e.target.value)} rows={2} /></div>

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

export default AdmissionForm;
