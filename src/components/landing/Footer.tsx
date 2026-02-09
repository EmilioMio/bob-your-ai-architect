import { motion } from "framer-motion";
import { Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-background">
      <div className="section-container">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">Bob</p>
              <p className="text-xs text-muted-foreground">AI Code Architect</p>
            </div>
          </div>

          {/* Center */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Built at KTH AI Society x Florent Venture Partners Hackathon 2026
            </p>
            <p className="text-xs text-muted-foreground mt-1">Open Source (Coming Soon)</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="mailto:hello@bob.dev"
              className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© 2024 Bob. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
