import type { Metadata } from "next";
import { LegalLayout } from "@/components/marketing/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Repliqo.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="January 5, 2026">
      <p>
        These Terms govern your use of Repliqo. By creating an account, you
        agree to them. If you're agreeing on behalf of a company, you confirm
        you have authority to bind that company.
      </p>

      <h2>1. The Service</h2>
      <p>
        Repliqo is a SaaS application that lets owners of Instagram Business
        and Creator accounts automate replies to public comments and direct
        messages on their own Instagram accounts, using the official Instagram
        Graph API.
      </p>

      <h2>2. Eligibility</h2>
      <ul>
        <li>You must be at least 18 years old.</li>
        <li>You must own (or be authorized to manage) the Instagram accounts you connect.</li>
        <li>You must comply with Meta's Platform Terms, Community Guidelines, and Instagram Terms of Use.</li>
      </ul>

      <h2>3. Acceptable use</h2>
      <p>You must not use Repliqo to:</p>
      <ul>
        <li>Send unsolicited bulk messages, spam, scams, phishing, or harassment</li>
        <li>Automate engagement on accounts you don't own or aren't authorized to manage</li>
        <li>Circumvent rate limits, anti-spam logic, or platform restrictions</li>
        <li>Send sexually explicit, hateful, violent, or illegal content</li>
        <li>Promote regulated products in violation of Meta's commerce policies (e.g. drugs, weapons, certain financial products)</li>
        <li>Reverse engineer, scrape, or resell the Service</li>
      </ul>
      <p>
        We can suspend or terminate accounts that violate these rules. For
        clear violations, we may do so without notice.
      </p>

      <h2>4. Your responsibilities for messaging</h2>
      <ul>
        <li>You are solely responsible for the content of automated replies, DMs, and any links you include.</li>
        <li>You must give recipients a clear way to opt out (e.g. "Reply STOP to stop hearing from me").</li>
        <li>You must comply with applicable communications laws (e.g. CAN-SPAM, GDPR, TRAI, CASL) in the jurisdictions where your recipients live.</li>
      </ul>

      <h2>5. Plans, billing, and trials</h2>
      <ul>
        <li>Free plans have usage limits (see <a href="/#pricing">/pricing</a>). Paid plans are billed monthly or annually in advance.</li>
        <li>Fees are non-refundable except where required by law.</li>
        <li>We may change pricing with 30 days' notice; the new price takes effect at your next renewal.</li>
        <li>You can cancel any time from <code>/dashboard/settings</code>. Your plan remains active until the end of the current billing period.</li>
      </ul>

      <h2>6. Your data</h2>
      <p>
        You own your data. We get a limited license to host, process, and
        display it so we can run the Service. See our{" "}
        <a href="/privacy">Privacy Policy</a> for details.
      </p>
      <p>
        Instagram-derived data is subject to Meta's terms. If you disconnect
        an account, we delete its access token immediately and purge associated
        comment/message data within 30 days.
      </p>

      <h2>7. Third-party services</h2>
      <p>
        Repliqo integrates with Meta / Instagram, Supabase, and our hosting
        and payment providers. Outages or policy changes at these providers
        may affect the Service. We're not liable for issues caused by them.
      </p>

      <h2>8. Service availability</h2>
      <p>
        We aim for high availability but do not guarantee uninterrupted
        service. We may perform maintenance with reasonable notice. Webhook
        delivery depends on Meta and is outside our control.
      </p>

      <h2>9. Intellectual property</h2>
      <ul>
        <li>The Repliqo product, brand, and code are our IP.</li>
        <li>You retain all rights to the content you push through Repliqo.</li>
        <li>If you give us feedback or suggestions, you grant us a perpetual, royalty-free right to use them.</li>
      </ul>

      <h2>10. Disclaimers</h2>
      <p>
        The Service is provided <strong>"as is"</strong> without warranties of
        any kind, express or implied. We do not warrant that the Service will
        be uninterrupted, error-free, or meet your specific requirements.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, our total liability to you in
        any 12-month period will not exceed the greater of (a) the amount you
        paid us during that period, or (b) USD 100. We are not liable for
        indirect, incidental, consequential, or punitive damages.
      </p>

      <h2>12. Indemnity</h2>
      <p>
        You will indemnify and hold us harmless from any claim arising from
        your content, your use of the Service, or your violation of these
        Terms.
      </p>

      <h2>13. Termination</h2>
      <ul>
        <li>You can delete your account at any time.</li>
        <li>We can terminate accounts that violate these Terms or pose a security risk.</li>
        <li>On termination, your access ends and your data is deleted in accordance with our retention policy.</li>
      </ul>

      <h2>14. Governing law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which
        Repliqo, Inc. is incorporated, without regard to conflict-of-laws
        principles. Disputes will be resolved exclusively in those courts.
      </p>

      <h2>15. Changes</h2>
      <p>
        We may update these Terms. Material changes will be notified by email
        at least 14 days before they take effect. Continued use after that
        date constitutes acceptance.
      </p>

      <h2>16. Contact</h2>
      <p>
        Repliqo, Inc. — <a href="mailto:techymk.dev@gmail.com">techymk.dev@gmail.com</a>
      </p>
    </LegalLayout>
  );
}
