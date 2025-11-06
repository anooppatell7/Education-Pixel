
"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navItems } from "@/lib/data";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { EnrollModal } from "@/components/enroll-modal";
import LearnSidebar from "./learn/sidebar"; // Import the sidebar

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isLearnPage = pathname.startsWith('/learn/');
  const courseSlug = isLearnPage ? pathname.split('/')[2] : '';


  const renderNavLinks = () => (
      navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
            pathname === item.href ? "text-accent" : "text-foreground/70"
          )}
          onClick={() => setIsOpen(false)}
        >
          {item.title}
        </Link>
      ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Logo />

        <nav className="hidden md:flex md:items-center md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent",
                pathname === item.href
                  ? "text-accent"
                  : "text-foreground/70"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
           <EnrollModal>
              <Button className="hidden md:inline-flex">Enroll Now</Button>
           </EnrollModal>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80">
            <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
              {isLearnPage ? (
                <LearnSidebar courseSlug={courseSlug} isMobile />
              ) : (
                <>
                  <nav className="grid grid-flow-row auto-rows-max text-sm">
                    {renderNavLinks()}
                  </nav>
                  <EnrollModal>
                    <Button className="w-full" onClick={() => setIsOpen(false)}>Enroll Now</Button>
                  </EnrollModal>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
