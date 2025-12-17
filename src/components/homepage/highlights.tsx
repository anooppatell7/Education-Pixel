
import { GraduationCap, Users, IndianRupee } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const highlights = [
  {
    icon: <GraduationCap className="h-10 w-10 text-accent" />,
    title: "Expert Instructors",
    description: "Learn from industry veterans with years of real-world experience and a passion for mentorship.",
  },
  {
    icon: <Users className="h-10 w-10 text-accent" />,
    title: "Thriving Community",
    description: "Join a growing network of successful alumni who started their tech careers with CodeSphere.",
  },
  {
    icon: <IndianRupee className="h-10 w-10 text-accent" />,
    title: "Value-Driven Pricing",
    description: "We believe in accessible education, offering high-quality, in-demand courses at fair prices.",
  },
];

export default function Highlights() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl font-bold text-primary sm:text-4xl">Why Choose CodeSphere Academy?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-primary/80">
            We provide a learning environment that is not just educational, but also transformative.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-card border-t-4 border-t-accent">
              <CardHeader className="p-8">
                <div className="flex justify-center mb-4 p-4 bg-accent/10 rounded-full w-fit mx-auto">{highlight.icon}</div>
                <CardTitle className="font-headline text-xl text-primary">{highlight.title}</CardTitle>
                <CardDescription className="pt-2 text-base">{highlight.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
