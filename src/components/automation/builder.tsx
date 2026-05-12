"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import {
  Sparkles,
  MessageSquareReply,
  Lock,
  Send,
  Loader2,
  Zap,
  X,
  ImageIcon,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DMPreview } from "./dm-preview";
import { PostPicker } from "./post-picker";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { truncate } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name your automation"),
  description: z.string().optional(),
  ig_account_id: z.string().uuid(),
  post_id: z.string().optional(),
  match_mode: z.enum(["contains", "exact", "starts_with"]).default("contains"),
  case_sensitive: z.boolean().default(false),
  comment_reply: z.string().optional(),
  dm_message: z.string().min(4, "Write the DM message"),
  dm_button_label: z.string().optional(),
  dm_button_url: z.string().url().optional().or(z.literal("")),
  follow_gate_enabled: z.boolean().default(false),
  follow_gate_message: z.string().optional(),
  follow_gate_cta: z.string().default("I'm following!"),
  rate_limit_per_hour: z.number().int().min(1).max(2000).default(200),
});
type Form = z.infer<typeof schema>;

type Account = {
  id: string;
  username: string;
  profile_picture_url: string | null;
  ig_user_id: string;
};

export type BuilderInitial = {
  id: string;
  values: Partial<Form>;
  keywords: string[];
  post?: { id: string | null; thumbnail_url: string | null; caption: string | null };
};

export type BuilderPrefill = {
  values?: Partial<Form>;
  keywords?: string[];
};

export function AutomationBuilder({
  accounts,
  initial,
  prefill,
}: {
  accounts: Account[];
  initial?: BuilderInitial;
  prefill?: BuilderPrefill;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const seed = initial ?? (prefill ? { values: prefill.values ?? {}, keywords: prefill.keywords ?? [] } : undefined);
  const [submitting, setSubmitting] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(seed?.keywords?.length ? seed.keywords : ["link"]);
  const [kwInput, setKwInput] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<{
    id: string | null;
    thumbnail_url: string | null;
    caption: string | null;
  }>(initial?.post ?? { id: null, thumbnail_url: null, caption: null });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: seed?.values?.name ?? "",
      description: seed?.values?.description ?? "",
      ig_account_id: seed?.values?.ig_account_id ?? accounts[0].id,
      match_mode: seed?.values?.match_mode ?? "contains",
      case_sensitive: seed?.values?.case_sensitive ?? false,
      comment_reply: seed?.values?.comment_reply ?? "Sent! Check your DMs 📩",
      dm_message: seed?.values?.dm_message ?? "Hey {username} 👋 here's the link you asked for.",
      dm_button_label: seed?.values?.dm_button_label ?? "",
      dm_button_url: seed?.values?.dm_button_url ?? "",
      follow_gate_enabled: seed?.values?.follow_gate_enabled ?? false,
      follow_gate_message:
        seed?.values?.follow_gate_message ?? "Almost there! Follow @{username} first, then tap to unlock.",
      follow_gate_cta: seed?.values?.follow_gate_cta ?? "I'm following!",
      rate_limit_per_hour: seed?.values?.rate_limit_per_hour ?? 200,
    },
  });

  const values = watch();

  const addKeyword = () => {
    const next = kwInput.trim().toLowerCase();
    if (!next) return;
    if (keywords.includes(next)) return;
    setKeywords([...keywords, next]);
    setKwInput("");
  };

  const removeKeyword = (k: string) =>
    setKeywords(keywords.filter((x) => x !== k));

  const onSubmit = async (
    data: Form,
    statusOnCreate: "draft" | "active" | "paused"
  ) => {
    if (keywords.length === 0) {
      toast.error("Add at least one trigger keyword");
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit && initial) {
        // Edit mode → PATCH the existing automation + replace keywords
        const res = await fetch(`/api/automations/${initial.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            description: data.description || null,
            match_mode: data.match_mode,
            case_sensitive: data.case_sensitive,
            comment_reply: data.comment_reply || null,
            dm_message: data.dm_message,
            dm_button_label: data.dm_button_label || null,
            dm_button_url: data.dm_button_url || null,
            follow_gate_enabled: data.follow_gate_enabled,
            follow_gate_message: data.follow_gate_message || null,
            follow_gate_cta: data.follow_gate_cta || "I'm following!",
            rate_limit_per_hour: data.rate_limit_per_hour,
            status: statusOnCreate,
            keywords,
            post_id: selectedPost.id,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error?.message || body?.error || "Update failed");
        }
        toast.success("Automation updated");
        router.push(`/dashboard/automations/${initial.id}`);
        router.refresh();
        return;
      }

      // Create mode
      const sb = createSupabaseBrowserClient();
      const { data: created, error } = await sb
        .from("automations")
        .insert({
          ig_account_id: data.ig_account_id,
          name: data.name,
          description: data.description || null,
          post_id: selectedPost.id,
          post_thumbnail_url: selectedPost.thumbnail_url,
          post_caption: selectedPost.caption,
          match_mode: data.match_mode,
          case_sensitive: data.case_sensitive,
          comment_reply: data.comment_reply || null,
          dm_message: data.dm_message,
          dm_button_label: data.dm_button_label || null,
          dm_button_url: data.dm_button_url || null,
          follow_gate_enabled: data.follow_gate_enabled,
          follow_gate_message: data.follow_gate_message || null,
          follow_gate_cta: data.follow_gate_cta || "I'm following!",
          rate_limit_per_hour: data.rate_limit_per_hour,
          status: statusOnCreate,
        })
        .select("id")
        .single();
      if (error) throw error;

      await sb
        .from("automation_keywords")
        .insert(keywords.map((k) => ({ automation_id: created!.id, keyword: k })));

      toast.success(
        statusOnCreate === "active" ? "Automation is live" : "Saved as draft"
      );
      router.push(`/dashboard/automations`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <a href="/dashboard/automations" className="hover:text-foreground">
              Automations
            </a>
            <span>/</span>
            <span>{isEdit ? "Edit" : "New"}</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {isEdit ? "Edit automation" : "Build an automation"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={submitting}
            onClick={handleSubmit((d) => onSubmit(d, isEdit ? "paused" : "draft"))}
          >
            {isEdit ? "Save & pause" : "Save as draft"}
          </Button>
          <Button
            type="button"
            disabled={submitting}
            onClick={handleSubmit((d) => onSubmit(d, "active"))}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {isEdit ? "Save & activate" : "Launch"}
          </Button>
        </div>
      </div>

      {/* Two-column workflow */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Left: form */}
        <div className="space-y-6">
          {/* Basics */}
          <Card>
            <CardHeader>
              <CardTitle>Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input placeholder="The Drop · Comment → DM" {...register("name")} />
                  {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Instagram account</Label>
                  <select
                    {...register("ig_account_id")}
                    className="flex h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id} className="bg-[#0a0a0a]">
                        @{a.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description (optional)</Label>
                <Input placeholder="What this automation does — for your own reference" {...register("description")} />
              </div>
            </CardContent>
          </Card>

          {/* Trigger */}
          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <div className="h-7 w-7 rounded-md border border-white/10 bg-white/[0.04] inline-flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <CardTitle>Trigger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label>Listens on</Label>
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="w-full flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors px-3 py-2.5 text-left"
                >
                  {selectedPost.thumbnail_url ? (
                    <div className="relative h-11 w-11 rounded-lg overflow-hidden border border-white/10 shrink-0">
                      <Image
                        src={selectedPost.thumbnail_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="44px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-11 w-11 rounded-lg border border-white/10 bg-white/[0.04] inline-flex items-center justify-center shrink-0">
                      {selectedPost.id ? (
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {selectedPost.id ? "Specific post" : "Any post on this account"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {selectedPost.caption
                        ? truncate(selectedPost.caption, 70)
                        : selectedPost.id
                          ? `Media ID ${selectedPost.id}`
                          : "Matches comments across every post — good for evergreen keywords."}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Change</span>
                </button>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label>Trigger keywords</Label>
                <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-2 min-h-[44px]">
                  {keywords.map((k) => (
                    <Badge key={k} variant="default" className="rounded-md gap-1">
                      {k}
                      <button
                        type="button"
                        onClick={() => removeKeyword(k)}
                        className="hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <input
                    value={kwInput}
                    onChange={(e) => setKwInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                    placeholder={keywords.length ? "Add another…" : "e.g. link"}
                    className="flex-1 bg-transparent text-sm outline-none px-1 min-w-[8rem]"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Press Enter or comma to add. Matches are case-insensitive by default.
                </p>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Match mode</Label>
                  <select
                    {...register("match_mode")}
                    className="flex h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm"
                  >
                    <option value="contains" className="bg-[#0a0a0a]">Comment contains keyword</option>
                    <option value="exact" className="bg-[#0a0a0a]">Comment is exactly the keyword</option>
                    <option value="starts_with" className="bg-[#0a0a0a]">Comment starts with keyword</option>
                  </select>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 h-10">
                  <Label>Case sensitive</Label>
                  <Controller
                    name="case_sensitive"
                    control={control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response */}
          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <div className="h-7 w-7 rounded-md border border-white/10 bg-white/[0.04] inline-flex items-center justify-center">
                <MessageSquareReply className="h-3.5 w-3.5" />
              </div>
              <CardTitle>Response</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label>Public comment reply (optional)</Label>
                <Input placeholder="Sent! Check your DMs 📩" {...register("comment_reply")} />
                <p className="text-xs text-muted-foreground">
                  Posted publicly under the original comment. Skip to send only the DM.
                </p>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label>DM message</Label>
                <Textarea rows={4} placeholder="Hey {username} 👋 here's the link you asked for." {...register("dm_message")} />
                <p className="text-xs text-muted-foreground">
                  Use <code className="text-foreground/80">{"{username}"}</code> to personalize.
                </p>
                {errors.dm_message && <p className="text-xs text-red-400">{errors.dm_message.message}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>CTA button label</Label>
                  <Input placeholder="Shop the drop" {...register("dm_button_label")} />
                </div>
                <div className="space-y-1.5">
                  <Label>CTA button URL</Label>
                  <Input placeholder="https://shop.example.com/the-drop" {...register("dm_button_url")} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Follow gate */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md border border-white/10 bg-white/[0.04] inline-flex items-center justify-center">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <CardTitle>Follow gate</CardTitle>
              </div>
              <Controller
                name="follow_gate_enabled"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                When enabled, we send a "follow us first" DM with a button. The link unlocks only after the user follows you.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Gate message</Label>
                  <Textarea rows={3} placeholder="Follow first, then tap to unlock 🔓" disabled={!values.follow_gate_enabled} {...register("follow_gate_message")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Button label</Label>
                  <Input placeholder="I'm following!" disabled={!values.follow_gate_enabled} {...register("follow_gate_cta")} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limits */}
          <Card>
            <CardHeader>
              <CardTitle>Safety & limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Rate limit (DMs / hour)</Label>
                  <Input type="number" {...register("rate_limit_per_hour", { valueAsNumber: true })} />
                  <p className="text-xs text-muted-foreground">
                    Caps how many DMs go out in a 60-min window to stay under Meta's spam thresholds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: live preview */}
        <div className="lg:sticky lg:top-24 h-fit">
          <Tabs defaultValue="dm">
            <TabsList className="w-full">
              <TabsTrigger value="dm" className="flex-1">
                <Send className="h-3.5 w-3.5" /> DM preview
              </TabsTrigger>
              <TabsTrigger value="post" className="flex-1">
                <MessageSquareReply className="h-3.5 w-3.5" /> Post preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dm">
              <DMPreview
                message={values.dm_message}
                buttonLabel={values.dm_button_label}
                buttonUrl={values.dm_button_url}
                followGate={values.follow_gate_enabled}
                gateMessage={values.follow_gate_message}
                gateCTA={values.follow_gate_cta}
                username={accounts.find((a) => a.id === values.ig_account_id)?.username || ""}
              />
            </TabsContent>
            <TabsContent value="post">
              <PostPreview
                reply={values.comment_reply}
                keywords={keywords}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <PostPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        accountId={values.ig_account_id}
        onSelect={(p) => setSelectedPost(p)}
      />
    </form>
  );
}

function PostPreview({
  reply,
  keywords,
}: {
  reply?: string;
  keywords: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Public reply preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground">A commenter writes:</div>
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-3 text-sm">
          {keywords.length > 0 ? (
            <>
              <span className="font-medium">@marisa.k</span> {keywords[0]} please!
            </>
          ) : (
            <span className="text-muted-foreground">Add a keyword to preview</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">You reply:</div>
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-3 text-sm">
          <span className="font-medium">@you</span>{" "}
          {reply || <span className="text-muted-foreground">No public reply</span>}
        </div>
      </CardContent>
    </Card>
  );
}
