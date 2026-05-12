import type { Metadata } from "next";
import { LegalLayout } from "@/components/marketing/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Repliqo collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="January 5, 2026">
      <p>
        This Privacy Policy explains what data Repliqo collects, why we collect it,
        and the controls you have over it. We've kept it as direct as we can —
        if anything is unclear, email{" "}
        <a href="mailto:techymk.dev@gmail.com">techymk.dev@gmail.com</a>.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Repliqo (operated by Repliqo, Inc., the "Service") is a SaaS application
        that lets Instagram Business and Creator account owners automate replies
        to comments and direct messages on their own Instagram accounts using
        the official Instagram Graph API.
      </p>

      <h2>2. Data we collect</h2>

      <h3>2.1 Account data (you give us)</h3>
      <ul>
        <li>Your email address, name, and password (hashed via Supabase Auth)</li>
        <li>Billing information, processed and stored by our payment provider — we never see card numbers</li>
      </ul>

      <h3>2.2 Instagram data (Meta gives us, with your permission)</h3>
      <p>
        When you connect an Instagram account through the official Instagram
        Login flow, we receive and store the following so we can run your
        automations:
      </p>
      <ul>
        <li>Your Instagram username, user ID, profile picture URL, account type, follower/following/media counts</li>
        <li>A long-lived access token, AES-256-GCM encrypted at rest, used only to call the Instagram Graph API on your behalf</li>
        <li>For posts you connect an automation to: the post ID, caption, and thumbnail URL</li>
      </ul>

      <h3>2.3 Comment & message data (received via Meta's webhooks)</h3>
      <p>
        When someone comments on a post you've configured an automation for, or
        sends you a DM that triggers a Repliqo flow, Meta sends us:
      </p>
      <ul>
        <li>The comment text, comment ID, parent post ID</li>
        <li>The commenter's Instagram-scoped ID (IGSID) and username</li>
        <li>The timestamp and the matching keyword</li>
        <li>The outcome of our reply (success, failure, error code)</li>
      </ul>
      <p>
        We retain this data so you can see automation history in your inbox and
        analytics. Commenters who haven't taken any action with a Repliqo
        automation are <strong>not</strong> tracked.
      </p>

      <h3>2.4 Product analytics (we collect)</h3>
      <ul>
        <li>Page views and feature usage in your Repliqo dashboard</li>
        <li>Errors and performance traces (Sentry-style)</li>
        <li>IP address and user agent (for security)</li>
      </ul>

      <h2>3. Why we collect it</h2>
      <ul>
        <li><strong>To run your automations.</strong> Without your IG token and webhook events, the product can't function.</li>
        <li><strong>To provide analytics.</strong> So you can see which keywords convert.</li>
        <li><strong>To prevent abuse.</strong> Rate limits, dedup, anti-spam protection.</li>
        <li><strong>To bill you.</strong> If you're on a paid plan.</li>
        <li><strong>To improve the product.</strong> Aggregated, never identifying.</li>
      </ul>

      <h2>4. Who we share data with</h2>
      <p>We do not sell your data. We share it only with:</p>
      <ul>
        <li><strong>Subprocessors</strong> we contract with to run the service: Supabase (database, auth), our hosting provider (Vercel or Railway), Stripe (payments), and an email provider (e.g. Resend) for transactional email.</li>
        <li><strong>Meta / Instagram</strong>, when we call the Graph API on your behalf.</li>
        <li><strong>Law enforcement</strong>, only when compelled by valid legal process.</li>
      </ul>

      <h2>5. Data retention</h2>
      <ul>
        <li>Account data: kept while your account is active, deleted within 30 days of account deletion.</li>
        <li>Automation logs (comment text, DM outcomes): kept for 12 months by default.</li>
        <li>Encrypted access tokens: deleted immediately when you disconnect an Instagram account or delete your Repliqo account.</li>
        <li>Webhook event payloads: kept for 90 days for debugging, then purged.</li>
      </ul>

      <h2>6. Security</h2>
      <ul>
        <li>Instagram access tokens are AES-256-GCM encrypted at rest with a 32-byte server-side key.</li>
        <li>All traffic is TLS-encrypted.</li>
        <li>Row-Level Security on Postgres — even with the right anon key, no user can read another user's rows.</li>
        <li>Webhook payloads are verified via Meta's HMAC-SHA256 signature before processing.</li>
      </ul>
      <p>
        If you discover a vulnerability, please email{" "}
        <a href="mailto:techymk.dev@gmail.com">techymk.dev@gmail.com</a>. We
        respond within 1 business day.
      </p>

      <h2>7. Your rights</h2>
      <p>You can, at any time:</p>
      <ul>
        <li>Export your data (request via <a href="mailto:techymk.dev@gmail.com">techymk.dev@gmail.com</a>)</li>
        <li>Delete your account from <code>/dashboard/settings</code> — this triggers a 30-day deletion cascade</li>
        <li>Disconnect an Instagram account, which immediately purges that account's encrypted token</li>
        <li>Object to processing or request restriction — write to us</li>
      </ul>
      <p>
        For Meta-platform data deletion requests, you can also use the standard
        Instagram "data deletion" flow described at{" "}
        <a href="https://help.instagram.com" target="_blank" rel="noreferrer">help.instagram.com</a>.
      </p>

      <h2>8. International transfers</h2>
      <p>
        Data is stored in the region you select when creating your workspace.
        If we must transfer data internationally, we rely on Standard
        Contractual Clauses or equivalent safeguards.
      </p>

      <h2>9. Children</h2>
      <p>Repliqo is not intended for, and we do not knowingly collect data from, anyone under 18.</p>

      <h2>10. Not affiliated with Meta</h2>
      <p>
        Repliqo is an independent product. We are not endorsed by, affiliated
        with, or sponsored by Meta Platforms, Inc., Facebook, or Instagram.
      </p>

      <h2>11. Changes</h2>
      <p>
        We'll update this page when our practices change. If the change is
        material, we'll email you at least 14 days before it takes effect.
      </p>

      <h2>12. Contact</h2>
      <p>
        Repliqo, Inc.<br />
        Privacy questions: <a href="mailto:techymk.dev@gmail.com">techymk.dev@gmail.com</a><br />
        Security: <a href="mailto:techymk.dev@gmail.com">techymk.dev@gmail.com</a>
      </p>
    </LegalLayout>
  );
}
