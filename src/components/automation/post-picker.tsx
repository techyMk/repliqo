"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Loader2, ImageOff, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn, formatCompact, truncate } from "@/lib/utils";

type Media = {
  id: string;
  caption: string | null;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "REELS";
  thumbnail_url: string | null;
  permalink: string;
  timestamp: string;
  comments_count: number;
  like_count: number;
};

export function PostPicker({
  open,
  onOpenChange,
  accountId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  accountId: string;
  onSelect: (post: { id: string | null; thumbnail_url: string | null; caption: string | null }) => void;
}) {
  const [media, setMedia] = useState<Media[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | "any">("any");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/instagram/media?account=${accountId}&limit=24`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (cancelled) return;
        if (!ok) setError(j?.error || "Failed to load posts");
        else setMedia(j.media as Media[]);
      })
      .catch((err) => !cancelled && setError(err?.message || "Network error"))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [open, accountId]);

  const confirm = () => {
    if (selected === "any") {
      onSelect({ id: null, thumbnail_url: null, caption: null });
    } else {
      const m = media?.find((x) => x.id === selected);
      if (m) onSelect({ id: m.id, thumbnail_url: m.thumbnail_url, caption: m.caption });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pick an Instagram post</DialogTitle>
          <DialogDescription>
            The automation will only fire on comments under this post. Choose
            "Any post" to match comments across your whole account.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto pr-1 -mr-2">
          <PostTile
            label="Any post"
            icon={<Globe className="h-5 w-5" />}
            selected={selected === "any"}
            onClick={() => setSelected("any")}
            subtitle="Match on every post"
          />

          {loading &&
            Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}

          {!loading && error && (
            <div className="col-span-full text-sm text-red-400 py-4 text-center">
              {error}
            </div>
          )}

          {!loading && !error && media?.length === 0 && (
            <div className="col-span-full text-sm text-muted-foreground py-6 text-center">
              No posts found on this account yet.
            </div>
          )}

          {!loading && !error &&
            media?.map((m) => (
              <MediaTile
                key={m.id}
                media={m}
                selected={selected === m.id}
                onClick={() => setSelected(m.id)}
              />
            ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={confirm} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Use this
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PostTile({
  label,
  subtitle,
  icon,
  selected,
  onClick,
}: {
  label: string;
  subtitle?: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative aspect-square rounded-xl border bg-white/[0.02] flex flex-col items-center justify-center gap-2 p-3 transition-colors",
        selected
          ? "border-white ring-2 ring-white/30"
          : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
      )}
    >
      <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] inline-flex items-center justify-center">
        {icon}
      </div>
      <div className="text-sm font-medium text-center">{label}</div>
      {subtitle && (
        <div className="text-[11px] text-muted-foreground text-center">
          {subtitle}
        </div>
      )}
    </button>
  );
}

function MediaTile({
  media,
  selected,
  onClick,
}: {
  media: Media;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative aspect-square rounded-xl border overflow-hidden bg-white/[0.02] transition-all group",
        selected
          ? "border-white ring-2 ring-white/30"
          : "border-white/[0.08] hover:border-white/20"
      )}
    >
      {media.thumbnail_url ? (
        <Image
          src={media.thumbnail_url}
          alt={media.caption || "Instagram post"}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform group-hover:scale-105"
          unoptimized
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
          <ImageOff className="h-5 w-5" />
        </div>
      )}

      <div className="absolute top-2 left-2">
        <Badge variant="muted" className="text-[10px] uppercase tracking-widest bg-black/60 border-white/15 backdrop-blur-sm">
          {media.media_type === "CAROUSEL_ALBUM" ? "ALBUM" : media.media_type}
        </Badge>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/85 to-transparent text-left">
        {media.caption && (
          <p className="text-[11px] text-foreground/85 line-clamp-2 leading-snug">
            {truncate(media.caption, 60)}
          </p>
        )}
        <div className="mt-1 flex items-center gap-3 text-[10px] text-foreground/70">
          <span className="inline-flex items-center gap-1">
            <Heart className="h-3 w-3" /> {formatCompact(media.like_count)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-3 w-3" /> {formatCompact(media.comments_count)}
          </span>
        </div>
      </div>
    </button>
  );
}
