
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Award, Users, Briefcase, Rocket } from "lucide-react";
import SectionDivider from "../section-divider";

export default function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-br from-blue-900 via-gray-900 to-black">
      <div className="container relative z-10 flex min-h-[90vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="font-headline text-5xl font-bold text-white drop-shadow-md sm:text-6xl lg:text-7xl">
          Build Your Future in Tech<span className="text-teal-400">.</span> Master the Skills<span className="text-teal-400">.</span>
        </h1>
        <p className="mt-6 max-w-[700px] text-lg text-gray-300 sm:text-xl">
          From Foundational Logic to Advanced IT. Learn, Build, and Innovate with MTech IT Institute.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="h-auto bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:opacity-90 transition-all transform hover:scale-105 rounded-full px-8 py-4 text-base font-semibold shadow-lg shadow-blue-500/30"
          >
            <Link href="/learn">
                Start Learning
                <Rocket className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-auto rounded-full border-2 border-white bg-transparent text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white px-8 py-4 text-base font-semibold"
          >
            <Link href="/courses">Explore Courses</Link>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Award className="h-5 w-5 text-teal-400" />
                <span>Industry-Recognized Curriculum</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Users className="h-5 w-5 text-teal-400" />
                <span>Expert-Led Mentorship</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Briefcase className="h-5 w-5 text-teal-400" />
                <span>Career-Focused Training</span>
            </div>
        </div>

      </div>
      <SectionDivider style="wave" className="text-background" />
    </section>
  );
}
