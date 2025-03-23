"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowRightIcon } from "lucide-react"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function LandingPage() {
  // Animation variants for text elements
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Enhanced background gradient effects */}
      <div className="absolute inset-0 z-0">
        {/* Bottom-right gradient blob */}
        <div
          className="absolute bottom-0 right-0 w-[1300px] h-[500px] bg-gradient-to-b from-blue-400 
        to-blue-100 rounded-full blur-3xl opacity-60 transform translate-x-1/3 translate-y-1/3"
        />

        {/* Bottom-left gradient blob */}
        <div
          className="absolute bottom-0 left-0 w-[1300px] h-[500px] bg-gradient-to-tr from-blue-400 
        to-cyan-100 rounded-full blur-3xl opacity-60 transform -translate-x-1/3 translate-y-1/3"
        />
      </div>

      {/* Content positioned above the DotPattern and gradients */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M18 3C9.716 3 3 9.716 3 18C3 26.284 9.716 33 18 33C26.284 33 33 26.284 33 18C33 9.716 26.284 3 18 3Z"
                  fill="#E6F0FF"
                />
                <path
                  d="M18 6C11.373 6 6 11.373 6 18C6 24.627 11.373 30 18 30C24.627 30 30 24.627 30 18C30 11.373 24.627 6 18 6Z"
                  fill="#2563EB"
                />
                <path
                  d="M18 9C13.029 9 9 13.029 9 18C9 22.971 13.029 27 18 27C22.971 27 27 22.971 27 18C27 13.029 22.971 9 18 9Z"
                  fill="#1E40AF"
                />
                <path
                  d="M18 12C14.686 12 12 14.686 12 18C12 21.314 14.686 24 18 24C21.314 24 24 21.314 24 18C24 14.686 21.314 12 18 12Z"
                  fill="#3B82F6"
                />
                <path
                  d="M22 18C22 20.209 20.209 22 18 22C15.791 22 14 20.209 14 18C14 15.791 15.791 14 18 14C20.209 14 22 15.791 22 18Z"
                  fill="#FFFFFF"
                />
                <path d="M26 14L28 18L26 22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 14L8 18L10 22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="text-2xl font-bold text-blue-600">
                <span className="font-bold tracking-tight">Prep</span>
                <span className="font-bold tracking-tight text-blue-800">Pulse</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center space-x-4"
          >
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-600/80 shadow-xl 
              transition-all duration-300 hover:shadow-lg hover:translate-y-px"
            >
              Get started
            </Button>
          </motion.div>
        </nav>

        {/* Hero Section with enhanced gradient effects */}
        <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="z-10 flex items-center justify-center"
          >
            <div
              className={cn(
                "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
              )}
            >
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <span>✨ Your AI Interview Assistant</span>
                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </div>
          </motion.div>
          <div className="relative">
            {/* Hero-specific gradient effect */}
            <div className="absolute inset-0 -z-10 flex place-items-center">
              <div className="absolute h-[500px] w-full max-w-3xl mx-auto -translate-x-1/2 left-1/2 rounded-full bg-gradient-radial from-white to-transparent opacity-70 blur-2xl"></div>
              <div className="absolute h-[300px] w-[300px] -translate-x-1/2 left-1/2 translate-y-1/4 rounded-full bg-gradient-conic from-sky-200 via-blue-200 to-transparent opacity-30 blur-2xl"></div>
            </div>

            <motion.h1
              custom={0}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900"
            >
              <motion.span custom={0} variants={textVariants}>
                The all-in-one AI platform
              </motion.span>
              <br />
              <motion.span
                custom={1}
                variants={textVariants}
                className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400"
              >
                for your interviews.
              </motion.span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
            >
              PrepPulse is the enterprise-ready platform to prepare for all of your interviews. Plus, enabling
              personalized feedback to improve your interview skills.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-600/80 w-64 shadow-xl 
                transition-all duration-300 hover:shadow-lg hover:translate-y-px"
              >
                Get started - it&apos;s free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-4 text-sm text-gray-500"
            >
              7-day free trial. No credit card required.
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
