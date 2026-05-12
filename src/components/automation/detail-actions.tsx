"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Pause, Play, Loader2, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Status = "draft" | "active" | "paused" | "archived";

export function AutomationDetailActions({
  id,
  status,
}: {
  id: string;
  status: Status;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"toggle" | "delete" | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const nextStatus: Status =
    status === "active" ? "paused" : "active";

  const onToggle = async () => {
    setBusy("toggle");
    try {
      const res = await fetch(`/api/automations/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success(nextStatus === "active" ? "Automation active" : "Automation paused");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  const onDelete = async () => {
    setBusy("delete");
    try {
      const res = await fetch(`/api/automations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Automation archived");
      router.push("/dashboard/automations");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setBusy(null);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        onClick={onToggle}
        disabled={busy !== null || status === "archived"}
      >
        {busy === "toggle" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : status === "active" ? (
          <>
            <Pause className="h-4 w-4" /> Pause
          </>
        ) : (
          <>
            <Play className="h-4 w-4" /> Activate
          </>
        )}
      </Button>
      <Button asChild>
        <Link href={`/dashboard/automations/${id}/edit`}>
          <Pencil className="h-4 w-4" /> Edit
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setConfirmOpen(true)}
        disabled={busy !== null}
        aria-label="Archive automation"
        title="Archive"
      >
        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-400" />
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive this automation?</DialogTitle>
            <DialogDescription>
              It will stop firing immediately. Logs and analytics are preserved.
              You can't undo this from the UI.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)} disabled={busy === "delete"}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={busy === "delete"}>
              {busy === "delete" && <Loader2 className="h-4 w-4 animate-spin" />}
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
