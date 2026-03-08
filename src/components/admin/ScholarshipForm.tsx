import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { AdminScholarship } from "@/pages/admin/AdminScholarships";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholarship: AdminScholarship | null;
  onSaved: () => void;
}

const EMPTY = {
  name: "", country: "", country_flag: "", programs: "",
  levels: "", description_en: "", description_fr: "",
  eligibility_en: "", eligibility_fr: "", deadline: "",
  funding_type: "partial", budget_friendly: true,
  status: "open", is_featured: false, is_published: true,
  external_link: "", admin_notes: "", relevance_tags: "",
};

const ScholarshipForm = ({ open, onOpenChange, scholarship, onSaved }: Props) => {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (scholarship) {
      setForm({
        name: scholarship.name,
        country: scholarship.country,
        country_flag: scholarship.country_flag,
        programs: scholarship.programs.join(", "),
        levels: scholarship.levels.join(", "),
        description_en: scholarship.description_en,
        description_fr: scholarship.description_fr,
        eligibility_en: scholarship.eligibility_en,
        eligibility_fr: scholarship.eligibility_fr,
        deadline: scholarship.deadline,
        funding_type: scholarship.funding_type,
        budget_friendly: scholarship.budget_friendly,
        status: scholarship.status,
        is_featured: scholarship.is_featured,
        is_published: scholarship.is_published,
        external_link: scholarship.external_link || "",
        admin_notes: scholarship.admin_notes || "",
        relevance_tags: scholarship.relevance_tags.join(", "),
      });
    } else {
      setForm(EMPTY);
    }
  }, [scholarship, open]);

  const handleSave = async () => {
    if (!form.name || !form.country) {
      toast({ title: "Name and country are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      country: form.country,
      country_flag: form.country_flag,
      programs: form.programs.split(",").map((s) => s.trim()).filter(Boolean),
      levels: form.levels.split(",").map((s) => s.trim()).filter(Boolean),
      description_en: form.description_en,
      description_fr: form.description_fr,
      eligibility_en: form.eligibility_en,
      eligibility_fr: form.eligibility_fr,
      deadline: form.deadline,
      funding_type: form.funding_type,
      budget_friendly: form.budget_friendly,
      status: form.status,
      is_featured: form.is_featured,
      is_published: form.is_published,
      external_link: form.external_link || null,
      admin_notes: form.admin_notes || null,
      relevance_tags: form.relevance_tags.split(",").map((s) => s.trim()).filter(Boolean),
    };

    if (scholarship) {
      await supabase.from("admin_scholarships").update(payload).eq("id", scholarship.id);
      toast({ title: "Scholarship updated" });
    } else {
      await supabase.from("admin_scholarships").insert(payload);
      toast({ title: "Scholarship created" });
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
          <DialogTitle>{scholarship ? "Edit Scholarship" : "New Scholarship"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Country Code *</Label><Input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="FR" /></div>
              <div><Label>Flag</Label><Input value={form.country_flag} onChange={(e) => set("country_flag", e.target.value)} placeholder="🇫🇷" /></div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Programs (comma-separated)</Label><Input value={form.programs} onChange={(e) => set("programs", e.target.value)} /></div>
            <div><Label>Levels (comma-separated)</Label><Input value={form.levels} onChange={(e) => set("levels", e.target.value)} placeholder="bachelor, master, phd" /></div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Description (EN)</Label><Textarea value={form.description_en} onChange={(e) => set("description_en", e.target.value)} rows={3} /></div>
            <div><Label>Description (FR)</Label><Textarea value={form.description_fr} onChange={(e) => set("description_fr", e.target.value)} rows={3} /></div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Eligibility (EN)</Label><Textarea value={form.eligibility_en} onChange={(e) => set("eligibility_en", e.target.value)} rows={2} /></div>
            <div><Label>Eligibility (FR)</Label><Textarea value={form.eligibility_fr} onChange={(e) => set("eligibility_fr", e.target.value)} rows={2} /></div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div><Label>Deadline</Label><Input value={form.deadline} onChange={(e) => set("deadline", e.target.value)} /></div>
            <div>
              <Label>Funding Type</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.funding_type} onChange={(e) => set("funding_type", e.target.value)}>
                <option value="full">Full</option>
                <option value="partial">Partial</option>
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
          </div>

          <div><Label>External Link</Label><Input value={form.external_link} onChange={(e) => set("external_link", e.target.value)} /></div>
          <div><Label>Relevance Tags (comma-separated)</Label><Input value={form.relevance_tags} onChange={(e) => set("relevance_tags", e.target.value)} /></div>
          <div><Label>Admin Notes</Label><Textarea value={form.admin_notes} onChange={(e) => set("admin_notes", e.target.value)} rows={2} /></div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2"><Switch checked={form.budget_friendly} onCheckedChange={(v) => set("budget_friendly", v)} /><Label>Budget Friendly</Label></div>
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

export default ScholarshipForm;
