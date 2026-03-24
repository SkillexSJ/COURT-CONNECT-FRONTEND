"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-100 flex h-screen w-full flex-col items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="relative flex flex-col items-center justify-center space-y-8">
        {/* Logo */}
        <div className="relative overflow-hidden">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-foreground to-foreground/70 md:text-7xl"
          >
            SKILL<span className="text-primary">BRIDGE</span>
          </motion.h1>

          {/* Shining effect */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              delay: 0.6,
            }}
            className="absolute inset-0 z-10 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
        </div>

        {/* Loading*/}
        <div className="flex flex-col items-center gap-2">
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-secondary/50">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="h-full w-full bg-primary origin-left"
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
          >
            Is Loading
          </motion.p>
        </div>
      </div>
    </div>
  );
}
