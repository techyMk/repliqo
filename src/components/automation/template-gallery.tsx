"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Tag, Lock, GraduationCap, FileText, Link2, MessageSquare, Plus, ArrowRight, ArrowLeft,
} from "lucide-react";
import {
  AUTOMATION_TEMPLATES,
  type AutomationTemplateId,
} from "@/lib/automation/templates";
import { Badge } from "@/components/ui/badge";

const iconFor: Record<AutomationTemplateId, React.ComponentType<{ className?: string }>> = {
  "drop": Tag,
  "follow-gate": Lock,
  "course-lead": GraduationCap,
  "ebook": FileText,
  "link-in-bio": Link2,
  "qualify": MessageSquare,
  "blank": Plus,
};

export function TemplateGallery() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/automations"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Back to automations
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Start with a template
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hand-tuned starting points used by creators and brands on Repliqo. Edit anything after.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AUTOMATION_TEMPLATES.map((t, i) => {
          const Icon = iconFor[t.id];
          const isBlank = t.id === "blank";
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
            >
              <Link
                href={`/dashboard/automations/new?t=${t.id}`}
                className="group block h-full rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] inline-flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <Badge variant="muted" className="text-[10px] uppercase tracking-widest">
                    {t.category}
                  </Badge>
                </div>

                <h3 className="mt-4 text-base font-semibold tracking-tight">{t.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {t.description}
                </p>

                {!isBlank && t.keywords.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {t.keywords.slice(0, 4).map((k) => (
                      <span
                        key={k}
                        className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[11px] font-mono text-foreground/80"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {isBlank ? "Start blank" : "Use this template"}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
