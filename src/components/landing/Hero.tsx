import { motion } from "framer-motion";
import { ArrowRight, Upload } from "lucide-react";
import { AnimatedBackground } from "./AnimatedBackground";
export function Hero() {
  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({
      behavior: "smooth",
    });
  };
  const scrollToUpload = () => {
    document.getElementById("flow-diagram")?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <AnimatedBackground />

      <div className="section-container relative z-10 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          ></motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
          >
            Stop Planning. Start Buidling.
          </motion.h1>

          <motion.p
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-muted-foreground mb-8"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
          >
            You build your product.
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
          >
            AI code architect that learns your needs, generates project structures, and keeps your codebase
            consistent—from first commit to production.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.4,
            }}
          >
            <button onClick={scrollToDemo} className="btn-primary group">
              Start Building
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={scrollToUpload} className="btn-ghost group">
              <Upload className="mr-2 h-4 w-4" />
              Upload Project
            </button>
          </motion.div>
        </div>
      </div>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
