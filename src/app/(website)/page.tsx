"use client";

import Link from "next/link";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* DotPattern positioned to cover the entire background */}
      <DotPattern
        className="absolute inset-0 w-full h-full text-blue-500/15 z-0"
        width={20}
        height={20}
      />

      {/* Enhanced background gradient effects */}
      <div className="absolute inset-0 z-0">
        {/* Bottom-right gradient blob */}
        <div className="absolute bottom-0 right-0 w-[1300px] h-[500px] bg-gradient-to-b from-blue-400 to-blue-100 rounded-full blur-3xl opacity-60 transform translate-x-1/3 translate-y-1/3"></div>

        {/* Bottom-left gradient blob */}
        <div className="absolute bottom-0 left-0 w-[1300px] h-[500px] bg-gradient-to-tr from-blue-400 to-cyan-100 rounded-full blur-3xl opacity-60 transform -translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Content positioned above the DotPattern and gradients */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">
              <span className="mr-2 font-bold tracking-tight"></span>
              InterviewPrep
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-600/80 shadow-xl transition-all duration-300 hover:shadow-lg hover:translate-y-px"
              asChild
            >
              <Link href="/get-started">Get started</Link>
            </Button>
          </div>
        </nav>

        {/* Hero Section with enhanced gradient effects */}
        <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              Your AI Interview Assistant
            </span>
          </div>

          <div className="relative">
            {/* Hero-specific gradient effect */}
            <div className="absolute inset-0 -z-10 flex place-items-center">
              <div className="absolute h-[500px] w-full max-w-3xl mx-auto -translate-x-1/2 left-1/2 rounded-full bg-gradient-radial from-white to-transparent opacity-70 blur-2xl"></div>
              <div className="absolute h-[300px] w-[300px] -translate-x-1/2 left-1/2 translate-y-1/4 rounded-full bg-gradient-conic from-sky-200 via-blue-200 to-transparent opacity-30 blur-2xl"></div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">
              The all-in-one AI platform
              <br />
              <span className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                for your interviews.
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              InterviewPrep is the enterprise-ready platform to prepare for all
              of your interviews. Plus, enabling personalized feedback to
              improve your interview skills.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-600/80 w-64 shadow-xl transition-all duration-300 hover:shadow-lg hover:translate-y-px"
                asChild
              >
                <Link href="/get-started">
                  Get started - it's free{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              7-day free trial. No credit card required.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
