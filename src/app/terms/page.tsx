import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#07070F] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
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
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-[#64748B] text-sm">Last updated: January 1, 2025</p>
        </div>

        <div className="space-y-8 text-[#94A3B8] text-sm leading-relaxed">
          <Section title="1. Acceptance of Terms">
            By accessing or using CVDesignerAI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to update these terms at any time; your continued use of the Service constitutes acceptance of any changes.
          </Section>

          <Section title="2. Description of Service">
            CVDesignerAI provides an AI-powered resume building platform that allows users to create, edit, and export professional resumes. The Service includes access to resume templates, AI writing assistance, ATS optimization tools, and PDF export functionality.
          </Section>

          <Section title="3. Account Registration">
            To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and to keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </Section>

          <Section title="4. Acceptable Use">
            You agree not to use the Service to:
            <ul className="list-disc list-inside mt-2 space-y-1 text-[#64748B]">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit harmful, offensive, or misleading content</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Use automated tools to scrape or extract data from the Service</li>
            </ul>
          </Section>

          <Section title="5. Intellectual Property">
            The Service and its original content, features, and functionality are owned by CVDesignerAI and are protected by international copyright, trademark, and other intellectual property laws. Resume content you create remains your property. By using the Service, you grant CVDesignerAI a limited license to store and process your content solely to provide the Service.
          </Section>

          <Section title="6. Subscription and Payment">
            CVDesignerAI offers free and paid subscription plans. Paid subscriptions are billed in advance on a monthly or annual basis. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period. Refunds are provided at our discretion and in accordance with applicable consumer protection laws.
          </Section>

          <Section title="7. AI-Generated Content">
            Our Service uses artificial intelligence to assist in content generation. While we strive for accuracy and quality, AI-generated content may contain errors or inaccuracies. You are solely responsible for reviewing and verifying any AI-generated content before use. CVDesignerAI makes no warranties regarding the accuracy or fitness of AI-generated content for any particular purpose.
          </Section>

          <Section title="8. Limitation of Liability">
            To the maximum extent permitted by law, CVDesignerAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising out of or in connection with your use of the Service.
          </Section>

          <Section title="9. Termination">
            We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our sole discretion. Upon termination, your right to use the Service ceases immediately.
          </Section>

          <Section title="10. Contact">
            If you have any questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:legal@cvdesignerai.com" className="text-purple-400 hover:text-purple-300">legal@cvdesignerai.com</a>.
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
          <Link href="/privacy" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Privacy Policy</Link>
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
