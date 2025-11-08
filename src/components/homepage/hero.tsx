
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Award, Users, Briefcase } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400">
      <div className="container relative z-10 flex min-h-[90vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="font-headline text-5xl font-bold text-white drop-shadow-md sm:text-6xl lg:text-7xl">
          Master Computer Skills. Build Your Future.
        </h1>
        <p className="mt-6 max-w-[700px] text-lg text-blue-50 sm:text-xl">
          From Basics to Advanced IT Training — All in One Place. Learn,
          Practice, and Grow with MTech IT Institute.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-white text-indigo-600 shadow-lg transition-transform hover:scale-105 hover:bg-indigo-100"
          >
            <Link href="/learn">Start Learning</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl border-2 border-white bg-transparent text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
          >
            <Link href="/courses">View Courses</Link>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <Award className="h-5 w-5 text-white" />
                <span>20+ Years Of Experience</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <Users className="h-5 w-5 text-white" />
                <span>1000+ Students Trained</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <Briefcase className="h-5 w-5 text-white" />
                <span>Job-Ready IT Skills</span>
            </div>
        </div>

      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{ transform: 'translateY(1px)' }}>
        <svg
          className="relative block h-[50px] w-full lg:h-[100px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-secondary/50"
          ></path>
        </svg>
      </div>
    </section>
  );
}
