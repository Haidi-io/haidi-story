import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Terms | Haidi", description: "Terms of use for the Haidi website." };

export default function Terms() {
  return (
    <LegalPage title="Terms of use">
      <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>
      <h2>Website content</h2>
      <p>
        Product descriptions, mock interfaces, and case summaries on this site are for informational purposes. They do
        not constitute a binding offer or guarantee of specific product capabilities.
      </p>
      <h2>Intellectual property</h2>
      <p>
        Haidi, IBP Ready, and related branding are owned by IBP Ready AG. You may not copy, scrape, or redistribute site
        content without written permission.
      </p>
      <h2>Enquiries</h2>
      <p>
        Submitting the launch form does not create a customer relationship. Any commercial terms are agreed separately
        in writing.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href="mailto:hello@haidi.io">hello@haidi.io</a>
      </p>
    </LegalPage>
  );
}
