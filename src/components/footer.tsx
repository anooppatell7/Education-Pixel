
import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, MapPin, Send, Youtube } from "lucide-react";
import Logo from "./logo";

export default function Footer() {
  // Split links for a two-column layout
  const quickLinks = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Courses", href: "/courses" },
    { title: "Learn", href: "/learn" },
  ];

  const secondaryLinks = [
    { title: "Resources", href: "/resources" },
    { title: "Reviews", href: "/reviews" },
    { title: "Verify Certificate", href: "/verify-certificate" },
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Terms & Conditions", href: "/terms-and-conditions" },
  ];
  
  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container py-12">
        
        {/* Top Section: Logo and Description */}
        <div className="text-center md:text-left mb-10">
            <div className="flex justify-center md:justify-start">
              <Logo />
            </div>
            <p className="text-sm max-w-md mt-4 mx-auto md:mx-0">
              Education Pixel is dedicated to providing top-quality IT training and computer courses to empower students for a successful career in technology.
            </p>
        </div>

        {/* Middle Section: Links and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center md:text-left">
            {/* Contact Info */}
            <div className="space-y-4">
                 <h3 className="font-headline text-lg font-semibold">Contact Us</h3>
                 <div className="flex items-center justify-center md:justify-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-1"/>
                    <span>bhavdaspur kota bhawaniganj kunda pratapgarh up (230143)</span>
                </div>
                 <div className="flex items-center justify-center md:justify-start gap-3 text-sm">
                    <Phone className="w-4 h-4 text-accent flex-shrink-0"/>
                    <span>7355379619</span>
                </div>
                 <div className="flex items-center justify-center md:justify-start gap-3 text-sm">
                    <Mail className="w-4 h-4 text-accent flex-shrink-0"/>
                    <span>ashishkumargiri51@gmail.com</span>
                </div>
            </div>

            {/* Links Section - two columns */}
            <div className="md:col-span-2">
                 <h3 className="font-headline text-lg font-semibold mb-4">Quick Links</h3>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <ul className="space-y-2">
                        {quickLinks.map((item) => (
                            <li key={item.href}>
                            <Link href={item.href} className="hover:text-accent transition-colors">
                                {item.title}
                            </Link>
                            </li>
                        ))}
                    </ul>
                    <ul className="space-y-2">
                        {secondaryLinks.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className="hover:text-accent transition-colors">
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                 </div>
            </div>
        </div>

        {/* Bottom Section: Socials and Copyright */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center gap-4">
              <Link href="https://wa.me/917355379619" aria-label="WhatsApp" className="p-2 bg-primary/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <Send className="w-5 h-5" />
              </Link>
              <Link href="#" aria-label="Facebook" className="p-2 bg-primary/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" aria-label="Instagram" className="p-2 bg-primary/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
               <Link href="https://www.youtube.com/@epixel2.0" aria-label="YouTube" className="p-2 bg-primary/10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          <div className="text-sm text-center sm:text-right">
            <span>&copy; {new Date().getFullYear()} Education Pixel. All Rights Reserved.</span>
            <div className="mt-2">
                <a href="https://www.instagram.com/veloxlaunch" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                    Powered by VeloxLaunch
                </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
