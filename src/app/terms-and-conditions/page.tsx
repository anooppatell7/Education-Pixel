
import type { Metadata } from 'next';
import SectionDivider from '@/components/section-divider';
import { Card, CardContent } from '@/components/ui/card';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://education-pixel.com";

export const metadata: Metadata = {
  title: "Terms and Conditions - Education Pixel",
  description: "Read the Terms and Conditions for using the Education Pixel website and its services. By accessing our website, you agree to these terms.",
  alternates: {
    canonical: `${siteUrl}/terms-and-conditions`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
        <div className="container py-16 sm:py-24 text-center">
          <h1 className="font-headline text-4xl font-bold sm:text-5xl">Terms & Conditions</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-50">
            Please read our terms carefully before using our services.
          </p>
        </div>
      </div>
       <div className="bg-secondary relative">
        <SectionDivider style="wave" className="text-gradient-to-br from-purple-900 via-blue-900 to-black" position="top"/>
        <div className="container py-16 sm:py-24">
          <Card className="max-w-4xl mx-auto shadow-lg rounded-lg">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-headline prose-headings:text-primary">
                <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <h2>1. Agreement to Terms</h2>
                <p>
                  By accessing or using our website ({siteUrl}) and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access the service.
                </p>

                <h2>2. Intellectual Property</h2>
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Education Pixel and its licensors. The content, including text, graphics, logos, and course materials, is protected by copyright and other laws. Our trademarks may not be used in connection with any product or service without the prior written consent of Education Pixel.
                </p>

                <h2>3. User Accounts</h2>
                <p>
                  When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>
                <p>
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
                </p>

                <h2>4. Courses and Payments</h2>
                <p>
                  We offer various courses for a fee. By enrolling in a course, you agree to pay the specified fees. All fees are non-refundable except as required by law or as explicitly stated in our refund policy. We reserve the right to change our prices at any time.
                </p>

                <h2>5. Limitation of Liability</h2>
                <p>
                  In no event shall Education Pixel, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>
                
                <h2>6. Disclaimer</h2>
                <p>
                  Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
                </p>

                <h2>7. Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>

                <h2>8. Changes to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                
                <h2>9. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at ashishkumargiri51@gmail.com.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
