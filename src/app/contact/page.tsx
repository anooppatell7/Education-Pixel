
import ContactForm from "@/components/contact-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Facebook, Instagram, Send, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SectionDivider from "@/components/section-divider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://education-pixel.com";

export const metadata: Metadata = {
  title: "Contact Education Pixel - Premier Tech Institute",
  description: "Contact Education Pixel for admissions, course details, or any inquiry. We're a leading tech training institute. Call 7355379619.",
  keywords: ["tech institute contact", "Education Pixel address", "Education Pixel phone number", "join Education Pixel", "coding bootcamp contact"],
   alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact Education Pixel - Premier Tech Institute",
    description: "Contact Education Pixel for admissions, course details, or any inquiry. We're a leading tech training institute.",
    url: `${siteUrl}/contact`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contact Education Pixel - Premier Tech Institute",
    description: "Contact Education Pixel for admissions, course details, or any inquiry. We're a leading tech training institute.",
  },
};

export default function ContactPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white">
        <div className="container py-16 sm:py-24 text-center">
          <h1 className="font-headline text-4xl font-bold sm:text-5xl">Contact Us<span className="text-teal-400">.</span></h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Have questions about our tech courses? We'd love to hear from you.
          </p>
        </div>
      </div>
      
      <div className="bg-secondary relative">
        <SectionDivider style="wave" className="text-blue-900/10" position="top"/>
        <div className="container py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Send a Message</CardTitle>
                  <CardDescription>Fill out the form below and our team will get back to you shortly.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-background">
                <CardHeader>
                   <CardTitle className="font-headline text-2xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span>bhavdaspur kota bhawaniganj kunda pratapgarh up (230143)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-accent" />
                    <span>7355379619</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-accent" />
                    <span>ashishkumargiri51@gmail.com</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background">
                  <CardHeader>
                      <CardTitle className="font-headline text-xl">Follow Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                       <div className="flex space-x-4">
                          <Link href="https://wa.me/917355379619" aria-label="WhatsApp" className="p-3 bg-primary/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                              <Send className="w-6 h-6" />
                          </Link>
                          <Link href="#" aria-label="Facebook" className="p-3 bg-primary/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                              <Facebook className="w-6 h-6" />
                          </Link>
                          <Link href="#" aria-label="Instagram" className="p-3 bg-primary/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                              <Instagram className="w-6 h-6" />
                          </Link>
                      </div>
                  </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-16">
            <div className="rounded-lg overflow-hidden shadow-lg border">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11342.234595946415!2d81.52552566948638!3d25.94641764082319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399ae30043f42cbd%3A0x814cb517774ea5b3!2sMTS%20Computer%20Institute!5e1!3m2!1sen!2sin!4v1766032707642!5m2!1sen!2sin" width="100%" height="450" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
