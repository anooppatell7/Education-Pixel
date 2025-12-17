
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://education-pixel.com";

export const metadata: Metadata = {
  title: "Privacy Policy - Education Pixel",
  description: "Read the Privacy Policy for Education Pixel. We are committed to protecting your personal information and your right to privacy.",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background">
      <div className="container py-16 sm:py-24">
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-headline prose-headings:text-primary">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <p>
            Education Pixel ("we," "our," or "us") is committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at admin@educationpixel.com.
          </p>

          <p>
            This privacy notice describes how we might use your information if you visit our website at <a href={siteUrl}>{siteUrl}</a>, or otherwise engage with us.
          </p>

          <h2>1. WHAT INFORMATION DO WE COLLECT?</h2>
          <p>
            <strong>Personal information you disclose to us:</strong> We collect personal information that you voluntarily provide to us when you register for courses, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.
          </p>
          <p>
            The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect may include the following: names, phone numbers, email addresses, mailing addresses, and other similar information.
          </p>
           <p>
            <strong>Information automatically collected:</strong> We automatically collect certain information when you visit, use or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Website and other technical information.
          </p>


          <h2>2. HOW DO WE USE YOUR INFORMATION?</h2>
          <p>
            We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul>
            <li>To facilitate account creation and logon process.</li>
            <li>To post testimonials. We post testimonials on our Website that may contain personal information.</li>
            <li>Request feedback. We may use your information to request feedback and to contact you about your use of our Website.</li>
            <li>To manage user accounts. We may use your information for the purposes of managing our account and keeping it in working order.</li>
             <li>To send administrative information to you.</li>
             <li>To protect our Services.</li>
          </ul>

          <h2>3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </p>

          <h2>4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
          </p>

          <h2>5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
          </p>

          <h2>6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
          </p>
          
          <h2>7. DO WE COLLECT INFORMATION FROM MINORS?</h2>
          <p>
            We do not knowingly solicit data from or market to children under 18 years of age.
          </p>

          <h2>8. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
          <p>
            In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
          </p>

          <h2>9. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
          <p>
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.
          </p>

          <h2>10. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
          <p>
            Yes, we will update this notice as necessary to stay compliant with relevant laws. The updated version will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible.
          </p>
          
          <h2>11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          <p>
            If you have questions or comments about this notice, you may email us at admin@educationpixel.com or by post to:
          </p>
          <p>
            Education Pixel<br/>
            Patti Pratapgarh, 230135, Uttar Pradesh.
          </p>
        </div>
      </div>
    </div>
  );
}
