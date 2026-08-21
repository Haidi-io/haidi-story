import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = { title: "Privacy | Haidi", description: "Privacy policy for Haidi and IBP Ready." };

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        Haidi is operated by IBP Ready AG, Switzerland. This policy describes how we handle information when you use our
        website and contact forms.
      </p>
      <h2>Information we collect</h2>
      <p>
        When you submit the “Prepare to launch” form, we collect the details you provide (such as name, work email,
        company, and planning context). We use this solely to respond to your enquiry and recommend an appropriate next
        step.
      </p>
      <h2>How we use it</h2>
      <ul>
        <li>To review your planning situation and follow up with a demo, discussion, or case example</li>
        <li>To improve our understanding of common planning challenges (in aggregate, without identifying individuals)</li>
      </ul>
      <h2>Storage and retention</h2>
      <p>
        Form submissions are transmitted securely to our team. We retain enquiry data only as long as needed for the
        conversation and any resulting business relationship.
      </p>
      <h2>Your rights</h2>
      <p>
        You may request access, correction, or deletion of your personal data by contacting{" "}
        <a href="mailto:hello@haidi.io">hello@haidi.io</a>.
      </p>
      <h2>Contact</h2>
      <p>
        IBP Ready AG · Switzerland · <a href="mailto:hello@haidi.io">hello@haidi.io</a>
      </p>
    </LegalPage>
  );
}
