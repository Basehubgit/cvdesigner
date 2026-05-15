import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#07070F] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white text-lg tracking-tight">
              Resume<span className="text-purple-400">AI</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-[#64748B] text-sm">Last updated: January 1, 2025</p>
        </div>

        <div className="space-y-8 text-[#94A3B8] text-sm leading-relaxed">
          <Section title="1. Information We Collect">
            We collect information you provide directly to us, such as when you create an account, build a resume, or contact us for support:
            <ul className="list-disc list-inside mt-2 space-y-1 text-[#64748B]">
              <li><strong className="text-[#94A3B8]">Account information:</strong> name, email address, and password</li>
              <li><strong className="text-[#94A3B8]">Resume content:</strong> work history, education, skills, and other information you enter</li>
              <li><strong className="text-[#94A3B8]">Usage data:</strong> pages visited, features used, and interaction patterns</li>
              <li><strong className="text-[#94A3B8]">Payment information:</strong> processed securely by our payment provider (we do not store card details)</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            We use the information we collect to:
            <ul className="list-disc list-inside mt-2 space-y-1 text-[#64748B]">
              <li>Provide, maintain, and improve the Service</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Generate AI-powered suggestions and content</li>
            </ul>
          </Section>

          <Section title="3. Data Storage and Security">
            Your resume data is stored securely on servers located in the European Union and United States. We implement industry-standard security measures including encryption at rest and in transit, regular security audits, and access controls. However, no method of transmission over the Internet is 100% secure.
          </Section>

          <Section title="4. AI Processing">
            When you use AI features, your resume content is processed by our AI systems to generate suggestions and improvements. This processing is done to provide the Service and your content is not used to train our AI models without your explicit consent.
          </Section>

          <Section title="5. Sharing of Information">
            We do not sell, rent, or share your personal information with third parties for their marketing purposes. We may share your information with:
            <ul className="list-disc list-inside mt-2 space-y-1 text-[#64748B]">
              <li>Service providers who assist in our operations (hosting, payment processing)</li>
              <li>Law enforcement when required by applicable law</li>
              <li>Successor entities in the event of a merger or acquisition</li>
            </ul>
          </Section>

          <Section title="6. Cookies">
            We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept cookies, some parts of the Service may not function properly.
          </Section>

          <Section title="7. Your Rights">
            Depending on your location, you may have the following rights:
            <ul className="list-disc list-inside mt-2 space-y-1 text-[#64748B]">
              <li><strong className="text-[#94A3B8]">Access:</strong> request a copy of the personal data we hold about you</li>
              <li><strong className="text-[#94A3B8]">Correction:</strong> request correction of inaccurate data</li>
              <li><strong className="text-[#94A3B8]">Deletion:</strong> request deletion of your personal data</li>
              <li><strong className="text-[#94A3B8]">Portability:</strong> request a machine-readable export of your data</li>
              <li><strong className="text-[#94A3B8]">Opt-out:</strong> opt out of marketing communications at any time</li>
            </ul>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:privacy@cvdesignerai.com" className="text-purple-400 hover:text-purple-300">privacy@cvdesignerai.com</a>.
          </Section>

          <Section title="8. Data Retention">
            We retain your personal information for as long as your account is active or as needed to provide the Service. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal purposes.
          </Section>

          <Section title="9. Children's Privacy">
            The Service is not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
          </Section>

          <Section title="10. Changes to This Policy">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the Service after any changes constitutes your acceptance of the new policy.
          </Section>

          <Section title="11. Contact Us">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@cvdesignerai.com" className="text-purple-400 hover:text-purple-300">privacy@cvdesignerai.com</a>.
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
          <Link href="/terms" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Terms of Service</Link>
          <Link href="/" className="text-sm text-[#64748B] hover:text-white transition-colors">Back to home</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-white mb-3">{title}</h2>
      <div className="text-[#94A3B8]">{children}</div>
    </div>
  );
}
