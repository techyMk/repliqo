import type { Metadata } from "next";
import { LegalLayout } from "@/components/marketing/legal-layout";

export const metadata: Metadata = {
  title: "Security",
  description: "How Repliqo protects your data and your Instagram tokens.",
};

export default function SecurityPage() {
  return (
    <LegalLayout title="Security" updated="January 5, 2026">
      <p>
        Repliqo holds something valuable — access to your Instagram account.
        We've engineered the product around that responsibility.
      </p>

      <h2>1. Token storage</h2>
      <ul>
        <li>
          Every Instagram access token is encrypted with{" "}
          <strong>AES-256-GCM</strong> before it touches the database. The encryption key
          lives only in server environment variables, never in code or git.
        </li>
        <li>
          We store an authenticated ciphertext (IV + ciphertext + auth tag), so any
          tampering at the database layer is detected on decrypt.
        </li>
        <li>
          When you disconnect an account or delete your workspace, the token row is
          deleted immediately. No soft-delete window.
        </li>
      </ul>

      <h2>2. Webhook integrity</h2>
      <ul>
        <li>
          Every inbound webhook from Meta is verified against its{" "}
          <code>x-hub-signature-256</code> HMAC-SHA256 header using your app secret,
          on the raw request bytes. Unsigned or tampered payloads are dropped.
        </li>
        <li>
          We dedupe every payload via SHA-256 of the raw body, stored as a unique
          column in <code>webhook_events</code>. Meta redeliveries don't fire your
          automation twice.
        </li>
        <li>
          Per-comment idempotency is enforced at the database layer too — a unique
          index on <code>(automation_id, comment_id, event_type)</code> guarantees
          we won't double-send.
        </li>
      </ul>

      <h2>3. Database isolation (RLS)</h2>
      <p>
        Postgres Row-Level Security policies are enabled on every user-owned table.
        A user authenticated through Repliqo can read and write only the rows they
        own. Even if our public anon key leaked tomorrow, no one could read another
        user's automations, logs, or Instagram metadata.
      </p>

      <h2>4. Network and transport</h2>
      <ul>
        <li>All traffic uses TLS 1.2+ with HSTS.</li>
        <li>OAuth state tokens are CSRF-protected via HttpOnly, Secure, SameSite=Lax cookies.</li>
        <li>The service-role database key is used only by the webhook handler and cron jobs — never sent to the browser.</li>
      </ul>

      <h2>5. Secrets management</h2>
      <ul>
        <li>
          Secrets are stored only as environment variables in your hosting
          provider (Vercel / Railway / equivalent). They are never committed to
          source control.
        </li>
        <li>
          Our token encryption key is independent of any Meta-issued secret, so a
          rotation of one does not force a rotation of the other.
        </li>
        <li>
          The token-refresh cron is the same code path used for key rotation:
          decrypt with the current key, refresh the IG long-lived token, encrypt
          with the (possibly new) current key.
        </li>
      </ul>

      <h2>6. Supply chain</h2>
      <ul>
        <li>Dependencies are pinned. We review Dependabot alerts weekly.</li>
        <li>We build with deterministic CI and reject unauthenticated dependencies.</li>
      </ul>

      <h2>7. Compliance posture</h2>
      <ul>
        <li>We design for GDPR data-subject rights (access, deletion, portability).</li>
        <li>Our subprocessors (Supabase, our hosting provider, Stripe) are SOC 2 audited.</li>
        <li>SOC 2 Type 1 for Repliqo is on our roadmap; we're not certified yet.</li>
      </ul>

      <h2>8. What you should still do</h2>
      <ul>
        <li>Use a strong, unique password (or sign in with Google).</li>
        <li>Don't share your Repliqo login. We support team seats — use those.</li>
        <li>Disconnect any Instagram account that no longer needs access.</li>
        <li>Review the inbox occasionally — unusual failure spikes can be an early signal that someone is poking at your account.</li>
      </ul>

      <h2>9. Reporting a vulnerability</h2>
      <p>
        We treat all reports as a top priority. Email{" "}
        <a href="mailto:security@repliqo.app">security@repliqo.app</a> with:
      </p>
      <ul>
        <li>A description of the issue and its impact</li>
        <li>Steps to reproduce (please don't test against another user's account)</li>
        <li>Your name and how you'd like to be credited (if at all)</li>
      </ul>
      <p>
        We aim to acknowledge within 1 business day and resolve within 14 days
        for high-severity issues. Please give us time to fix before public
        disclosure.
      </p>
    </LegalLayout>
  );
}
