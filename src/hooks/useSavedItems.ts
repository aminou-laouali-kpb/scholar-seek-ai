import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { track } from "@/lib/analytics";

export type SavedItemType = "scholarship" | "admission" | "destination";

export interface SavedItem {
  id: string;
  user_id: string;
  item_type: SavedItemType;
  item_id: string;
  is_priority: boolean;
  created_at: string;
}

export function useSavedItems() {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    const { data } = await supabase
      .from("saved_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setItems((data as SavedItem[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const isSaved = useCallback(
    (itemType: SavedItemType, itemId: string) =>
      items.some((i) => i.item_type === itemType && i.item_id === itemId),
    [items]
  );

  const isPriority = useCallback(
    (itemType: SavedItemType, itemId: string) =>
      items.some((i) => i.item_type === itemType && i.item_id === itemId && i.is_priority),
    [items]
  );

  const toggleSave = useCallback(
    async (itemType: SavedItemType, itemId: string) => {
      if (!user) return;
      const existing = items.find((i) => i.item_type === itemType && i.item_id === itemId);
      if (existing) {
        setItems((prev) => prev.filter((i) => i.id !== existing.id));
        await supabase.from("saved_items").delete().eq("id", existing.id);
      } else {
        const newItem: Partial<SavedItem> = {
          user_id: user.id,
          item_type: itemType,
          item_id: itemId,
          is_priority: false,
        };
        setItems((prev) => [{ ...newItem, id: crypto.randomUUID(), created_at: new Date().toISOString() } as SavedItem, ...prev]);
        await supabase.from("saved_items").insert(newItem as any);
        fetchItems();
      }
    },
    [user, items, fetchItems]
  );

  const togglePriority = useCallback(
    async (itemType: SavedItemType, itemId: string) => {
      if (!user) return;
      const existing = items.find((i) => i.item_type === itemType && i.item_id === itemId);
      if (!existing) return;
      const newPriority = !existing.is_priority;
      setItems((prev) => prev.map((i) => i.id === existing.id ? { ...i, is_priority: newPriority } : i));
      await supabase.from("saved_items").update({ is_priority: newPriority } as any).eq("id", existing.id);
    },
    [user, items]
  );

  return { items, loading, isSaved, isPriority, toggleSave, togglePriority, refetch: fetchItems };
}
