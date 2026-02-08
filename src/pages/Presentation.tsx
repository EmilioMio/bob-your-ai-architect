import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Monitor,
  Brain,
  Shield,
  Zap,
  Coins,
  Database,
  Rocket,
  FolderTree,
  FileCode,
  Check,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

const slides: Slide[] = [
  // Slide 1: Title
  {
    id: 1,
    title: "Bob AI",
    subtitle: "Code Architect",
    content: (
      <div className="space-y-8">
        <motion.p
          className="text-2xl md:text-4xl font-light text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Bob builds your architecture.
        </motion.p>
        <motion.p
          className="text-xl md:text-3xl font-light text-muted-foreground/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          You build your product.
        </motion.p>
      </div>
    ),
  },
  // Slide 2: Tell Bob About Your Project
  {
    id: 2,
    title: "Tell Bob About Your Project",
    subtitle: "The first step to perfect architecture",
    content: (
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Input form mockup */}
          <motion.div
            className="bg-card rounded-2xl border border-border p-6 text-left shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Project Description</label>
                <div className="bg-muted/50 rounded-lg p-3 text-foreground text-sm">
                  "A SaaS dashboard with auth, analytics, and team management"
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Framework</label>
                  <div className="bg-primary/10 text-primary rounded-lg p-2 text-sm font-medium text-center">
                    Next.js
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Team Size</label>
                  <div className="bg-accent/10 text-accent rounded-lg p-2 text-sm font-medium text-center">5-10</div>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Experience Level</label>
                <div className="flex gap-2">
                  {["Beginner", "Mid", "Senior"].map((level, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-lg p-2 text-sm text-center ${idx === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {level}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Specialized Agents */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-left mb-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Specialized Agents Activated</h4>
            </div>
            {[
              { icon: Brain, name: "Orchestrator", task: "Coordinates architecture decisions", color: "bg-primary/10 border-primary/30", iconColor: "text-primary" },
              { icon: FolderTree, name: "Structure Agent", task: "Designs folder hierarchy", color: "bg-accent/10 border-accent/30", iconColor: "text-accent" },
              { icon: Shield, name: "Security Agent", task: "Plans auth & data protection", color: "bg-purple-500/10 border-purple-500/30", iconColor: "text-purple-500" },
              { icon: Coins, name: "Cost Agent", task: "Optimizes for budget efficiency", color: "bg-amber-500/10 border-amber-500/30", iconColor: "text-amber-500" },
              { icon: Zap, name: "Performance Agent", task: "Ensures fast load times", color: "bg-rose-500/10 border-rose-500/30", iconColor: "text-rose-500" },
            ].map((agent, idx) => (
              <motion.div
                key={idx}
                className={`flex items-center gap-3 rounded-xl p-3 border ${agent.color}`}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1, type: "spring", stiffness: 200 }}
              >
                <motion.div 
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${agent.color.replace('border-', 'bg-').split(' ')[0]}`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                >
                  <agent.icon className={`w-5 h-5 ${agent.iconColor}`} />
                </motion.div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.task}</p>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.1, type: "spring" }}
                >
                  <Check className="w-4 h-4 text-accent" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    ),
  },
  // Slide 3: See Bob in Action (VS Code)
  {
    id: 3,
    title: "See Bob in Action",
    subtitle: "Live enforcement in VS Code",
    content: (
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* VS Code title bar */}
          <div className="bg-[hsl(var(--code-bg))] px-4 py-3 flex items-center gap-2 border-b border-[hsl(var(--code-comment))]/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-warning" />
              <div className="w-3 h-3 rounded-full bg-accent" />
            </div>
            <span className="text-[hsl(var(--code-comment))] text-sm ml-2">UserService.ts — my-saas-app</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold">B</div>
              <span className="text-[hsl(var(--code-comment))] text-xs">Bob Active</span>
            </div>
          </div>

          {/* VS Code editor */}
          <div className="bg-[hsl(var(--code-bg))] flex">
            {/* Line numbers */}
            <div className="py-4 px-3 text-right text-[hsl(var(--code-comment))] text-sm font-mono select-none border-r border-[hsl(var(--code-comment))]/10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className={n === 4 ? "text-warning" : ""}>
                  {n}
                </div>
              ))}
            </div>

            {/* Code content */}
            <div className="flex-1 p-4">
              <pre className="text-sm font-mono text-left">
                <code>
                  <span className="text-[hsl(var(--code-keyword))]">export class</span>
                  <span className="text-[hsl(var(--code-function))]"> UserService</span>
                  <span className="text-[hsl(var(--code-text))]"> {"{"}</span>
                  {"\n"}
                  <span className="text-[hsl(var(--code-keyword))]"> async</span>
                  <span className="text-[hsl(var(--code-function))]"> fetchUsers</span>
                  <span className="text-[hsl(var(--code-text))]">() {"{"}</span>
                  {"\n"}
                  <span className="text-[hsl(var(--code-comment))]"> {"// "}TODO: Add error handling</span>
                  {"\n"}
                  <motion.span
                    className="bg-warning/20 block -mx-4 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="text-[hsl(var(--code-keyword))]"> const</span>
                    <span className="text-[hsl(var(--code-text))]"> response = </span>
                    <span className="text-[hsl(var(--code-keyword))]">await</span>
                    <span className="text-[hsl(var(--code-function))]"> fetch</span>
                    <span className="text-[hsl(var(--code-text))]">(</span>
                    <span className="text-[hsl(var(--code-string))]">'/api/users'</span>
                    <span className="text-[hsl(var(--code-text))]">);</span>
                  </motion.span>
                  <span className="text-[hsl(var(--code-keyword))]"> return</span>
                  <span className="text-[hsl(var(--code-text))]"> response.</span>
                  <span className="text-[hsl(var(--code-function))]">json</span>
                  <span className="text-[hsl(var(--code-text))]">();</span>
                  {"\n"}
                  <span className="text-[hsl(var(--code-text))]"> {"}"}</span>
                  {"\n"}
                  <span className="text-[hsl(var(--code-text))]">{"}"}</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Bob warning panel */}
          <motion.div
            className="bg-warning/10 border-t border-warning/30 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-warning text-xl">⚠️</span>
              <div className="flex-1 text-left">
                <p className="text-warning font-semibold text-sm">Architectural Pattern Violation</p>
                <p className="text-warning/80 text-xs mt-1">
                  API calls should use the centralized apiClient from /lib/api — Rule: "All API calls through services
                  layer"
                </p>
              </div>
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <button className="px-3 py-1.5 text-xs bg-warning text-warning-foreground rounded-lg font-medium">
                  Auto-fix
                </button>
                <button className="px-3 py-1.5 text-xs bg-transparent border border-warning/50 text-warning rounded-lg">
                  Ignore
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          className="mt-6 text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          Bob monitors your code in real-time and flags violations of your architectural rules
        </motion.p>
      </div>
    ),
  },
  // Slide 4: Future-Proof Analysis
  {
    id: 4,
    title: "Future-Proof Analysis",
    subtitle: "Can your architecture handle growth?",
    content: (
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* VS Code title bar */}
          <div className="bg-[hsl(var(--code-bg))] px-4 py-3 flex items-center gap-2 border-b border-[hsl(var(--code-comment))]/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-warning" />
              <div className="w-3 h-3 rounded-full bg-accent" />
            </div>
            <span className="text-[hsl(var(--code-comment))] text-sm ml-2">app.config.ts — my-saas-app</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold">B</div>
              <span className="text-[hsl(var(--code-comment))] text-xs">Bob Active</span>
            </div>
          </div>

          {/* VS Code editor */}
          <div className="bg-[hsl(var(--code-bg))] flex">
            {/* Line numbers */}
            <div className="py-4 px-3 text-right text-[hsl(var(--code-comment))] text-sm font-mono select-none border-r border-[hsl(var(--code-comment))]/10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n}>{n}</div>
              ))}
            </div>

            {/* Code content */}
            <div className="flex-1 p-4">
              <pre className="text-sm font-mono text-left">
                <code>
                  <span className="text-[hsl(var(--code-keyword))]">export const</span>
                  <span className="text-[hsl(var(--code-function))]"> dbConfig</span>
                  <span className="text-[hsl(var(--code-text))]"> = {"{"}</span>
                  {"\n"}
                  <span className="text-[hsl(var(--code-text))]">  pool: {"{"}</span>
                  {"\n"}
                  <span className="text-[hsl(var(--code-text))]">    max: </span>
                  <span className="text-[hsl(var(--code-string))]">10</span>
                  <span className="text-[hsl(var(--code-text))]">,</span>
                  {"\n"}
                  <span className="text-[hsl(var(--code-text))]">    idleTimeout: </span>
                  <span className="text-[hsl(var(--code-string))]">30000</span>
                  <span className="text-[hsl(var(--code-text))]">,</span>
                  {"\n"}
                  <span className="text-[hsl(var(--code-text))]">  {"}"}</span>
                  {"\n"}
                  <span className="text-[hsl(var(--code-text))]">{"}"};</span>
                  {"\n\n"}
                  <span className="text-[hsl(var(--code-comment))]">{"// "}Current: ~500 concurrent users</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Future-Proof Analysis Panel */}
          <motion.div
            className="bg-accent/10 border-t border-accent/30 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                className="text-accent text-xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔮
              </motion.div>
              <div className="flex-1 text-left">
                <p className="text-accent font-semibold text-sm">Future-Proof Analysis</p>
                <p className="text-accent/80 text-xs mt-1">
                  Analyzing your architecture for scalability bottlenecks...
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scalability Popup */}
        <motion.div
          className="mt-6 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
        >
          <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">Scalability Report</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded bg-accent/20 text-accent">Projection</span>
          </div>
          <div className="p-4 space-y-4">
            {/* User Load Projections */}
            <div className="space-y-3">
              {[
                { users: "1,000", status: "ok", label: "Current capacity", color: "text-accent", bg: "bg-accent" },
                { users: "5,000", status: "warning", label: "DB pool exhaustion risk", color: "text-warning", bg: "bg-warning" },
                { users: "10,000+", status: "critical", label: "Requires horizontal scaling", color: "text-destructive", bg: "bg-destructive" },
              ].map((tier, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + idx * 0.15 }}
                >
                  <div className="w-20 text-right">
                    <span className="font-mono text-sm font-semibold text-foreground">{tier.users}</span>
                    <span className="text-xs text-muted-foreground ml-1">users</span>
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${tier.bg} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: tier.status === "ok" ? "30%" : tier.status === "warning" ? "60%" : "100%" }}
                      transition={{ delay: 1.4 + idx * 0.15, duration: 0.5 }}
                    />
                  </div>
                  <div className={`text-xs font-medium ${tier.color} w-40 text-left`}>
                    {tier.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recommendations */}
            <motion.div
              className="bg-primary/5 rounded-xl p-3 border border-primary/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <p className="text-xs font-semibold text-primary mb-2">💡 Bob's Recommendations</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-accent" />
                  Increase pool.max to 50 for 5k+ users
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-accent" />
                  Add read replicas for 10k+ concurrent
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-accent" />
                  Consider Redis caching layer
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          className="mt-6 text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          Bob proactively identifies scalability bottlenecks before they become problems
        </motion.p>
      </div>
    ),
  },
  // Slide 5: What Bob Creates
  {
    id: 5,
    title: "What Bob Creates",
    subtitle: "Production-ready architecture",
    content: (
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File tree */}
          <motion.div
            className="bg-card rounded-2xl border border-border p-6 text-left shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <FolderTree className="w-5 h-5 text-primary" />
              <span className="text-sm font-mono text-muted-foreground">my-saas-app/</span>
            </div>
            <div className="space-y-1 font-mono text-sm">
              {[
                { name: "src/", indent: 0, isFolder: true },
                { name: "app/", indent: 1, isFolder: true },
                { name: "(auth)/", indent: 2, isFolder: true },
                { name: "(dashboard)/", indent: 2, isFolder: true },
                { name: "components/", indent: 1, isFolder: true, badge: "20 files" },
                { name: "lib/", indent: 1, isFolder: true },
                { name: "hooks/", indent: 1, isFolder: true },
                { name: "package.json", indent: 0, isFolder: false },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-2"
                  style={{ paddingLeft: `${item.indent * 16}px` }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                >
                  {item.isFolder ? (
                    <FolderTree className="w-4 h-4 text-primary" />
                  ) : (
                    <FileCode className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className={item.isFolder ? "text-foreground" : "text-muted-foreground"}>{item.name}</span>
                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{item.badge}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rules */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-card rounded-xl border border-border p-5">
              <h4 className="font-semibold text-foreground mb-3">Generated Rules</h4>
              <div className="space-y-2">
                {[
                  "Server components by default",
                  "Client components only when needed",
                  "No business logic in page files",
                  "Consistent naming conventions",
                ].map((rule, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                  >
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    {rule}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-accent/10 rounded-xl border border-accent/30 p-5">
              <h4 className="font-semibold text-accent mb-2">Ready to Download</h4>
              <p className="text-sm text-muted-foreground">
                Complete project structure with README, configs, and boilerplate code
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },

  // Slide 6: Architecture Outputs
  {
    id: 6,
    title: "Architecture Outputs",
    subtitle: "Complete project structure generated by Bob",
    content: (
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Frontend Structure */}
          <motion.div
            className="bg-card rounded-2xl border border-border p-5 text-left shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Monitor className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Frontend</span>
              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary ml-auto">Next.js</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              {[
                { name: "src/", indent: 0, isFolder: true },
                { name: "app/", indent: 1, isFolder: true },
                { name: "(auth)/", indent: 2, isFolder: true },
                { name: "login/", indent: 3, isFolder: true },
                { name: "(dashboard)/", indent: 2, isFolder: true },
                { name: "components/", indent: 1, isFolder: true },
                { name: "ui/", indent: 2, isFolder: true, badge: "12" },
                { name: "features/", indent: 2, isFolder: true, badge: "8" },
                { name: "lib/", indent: 1, isFolder: true },
                { name: "hooks/", indent: 1, isFolder: true },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-1.5"
                  style={{ paddingLeft: `${item.indent * 12}px` }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.03 }}
                >
                  {item.isFolder ? (
                    <FolderTree className="w-3 h-3 text-primary" />
                  ) : (
                    <FileCode className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span className={item.isFolder ? "text-foreground" : "text-muted-foreground"}>{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{item.badge}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Backend Structure */}
          <motion.div
            className="bg-card rounded-2xl border border-border p-5 text-left shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Database className="w-5 h-5 text-accent" />
              <span className="font-semibold text-foreground">Backend</span>
              <span className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent ml-auto">FastAPI</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              {[
                { name: "app/", indent: 0, isFolder: true },
                { name: "routers/", indent: 1, isFolder: true },
                { name: "users.py", indent: 2, isFolder: false },
                { name: "products.py", indent: 2, isFolder: false },
                { name: "orders.py", indent: 2, isFolder: false },
                { name: "models/", indent: 1, isFolder: true },
                { name: "services/", indent: 1, isFolder: true },
                { name: "middleware/", indent: 1, isFolder: true },
                { name: "main.py", indent: 1, isFolder: false },
                { name: "tests/", indent: 0, isFolder: true },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-1.5"
                  style={{ paddingLeft: `${item.indent * 12}px` }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.03 }}
                >
                  {item.isFolder ? (
                    <FolderTree className="w-3 h-3 text-accent" />
                  ) : (
                    <FileCode className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span className={item.isFolder ? "text-foreground" : "text-muted-foreground"}>{item.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Database Schema */}
          <motion.div
            className="bg-card rounded-2xl border border-border p-5 text-left shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Database className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-foreground">Database</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 ml-auto">PostgreSQL</span>
            </div>
            <div className="space-y-3">
              {[
                { name: "users", cols: ["id", "email", "name", "created_at"], pk: "id" },
                { name: "products", cols: ["id", "name", "price", "stock"], pk: "id" },
                { name: "orders", cols: ["id", "user_id", "total", "status"], pk: "id", fk: "user_id → users" },
              ].map((table, idx) => (
                <motion.div
                  key={idx}
                  className="bg-muted/50 rounded-lg p-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-foreground">{table.name}</span>
                    {table.fk && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500">
                        FK: {table.fk}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {table.cols.map((col, cidx) => (
                      <span
                        key={cidx}
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          col === table.pk
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {col === table.pk ? `🔑 ${col}` : col}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ER Diagram Preview */}
        <motion.div
          className="mt-6 bg-card rounded-2xl border border-border p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Entity Relationship Diagram</span>
            </div>
            <span className="text-xs text-muted-foreground">Auto-generated from schema</span>
          </div>
          <div className="flex items-center justify-center gap-8 py-4">
            {/* Simple ER visualization */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-primary/10 border-2 border-primary rounded-lg px-4 py-2 text-center">
                <span className="font-mono text-sm font-semibold text-primary">users</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-0.5 bg-muted-foreground" />
                <span className="text-xs text-muted-foreground">1:N</span>
                <div className="w-8 h-0.5 bg-muted-foreground" />
              </div>
              <div className="bg-accent/10 border-2 border-accent rounded-lg px-4 py-2 text-center">
                <span className="font-mono text-sm font-semibold text-accent">orders</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-0.5 bg-muted-foreground" />
                <span className="text-xs text-muted-foreground">1:N</span>
                <div className="w-8 h-0.5 bg-muted-foreground" />
              </div>
              <div className="bg-purple-500/10 border-2 border-purple-500 rounded-lg px-4 py-2 text-center">
                <span className="font-mono text-sm font-semibold text-purple-500">order_items</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-0.5 bg-muted-foreground" />
                <span className="text-xs text-muted-foreground">N:1</span>
                <div className="w-8 h-0.5 bg-muted-foreground" />
              </div>
              <div className="bg-amber-500/10 border-2 border-amber-500 rounded-lg px-4 py-2 text-center">
                <span className="font-mono text-sm font-semibold text-amber-600 dark:text-amber-400">products</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    ),
  },

  // Slide 7: Statistics & Benefits
  {
    id: 7,
    title: "Why Bob?",
    subtitle: "The numbers speak for themselves",
    content: (() => {
      // ========== EASILY EDITABLE STATISTICS ==========
      const stats = {
        timeSaved: {
          value: "40+",
          unit: "hours",
          description: "saved per project on architecture planning",
          icon: Clock,
          color: "text-primary",
          bgColor: "bg-primary/10",
        },
        productivity: {
          value: "3x",
          unit: "faster",
          description: "development kickoff vs manual setup",
          icon: TrendingUp,
          color: "text-accent",
          bgColor: "bg-accent/10",
        },
        teamEfficiency: {
          value: "86%",
          unit: "",
          description: "reduction in architectural debates",
          icon: Users,
          color: "text-purple-500",
          bgColor: "bg-purple-500/10",
        },
        costSavings: {
          value: "$15k",
          unit: "+",
          description: "saved on refactoring costs annually",
          icon: DollarSign,
          color: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
        },
      };

      const benefits = [
        { text: "Consistent architecture across all projects", highlight: true },
        { text: "Best practices enforced automatically", highlight: false },
        { text: "Reduced onboarding time for new developers", highlight: true },
        { text: "Fewer bugs from inconsistent patterns", highlight: false },
        { text: "Clear documentation generated instantly", highlight: true },
      ];
      // ================================================

      return (
        <div className="max-w-5xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            {Object.entries(stats).map(([key, stat], idx) => (
              <motion.div
                key={key}
                className="bg-card rounded-2xl border border-border p-5 text-center shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center mx-auto mb-3`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</span>
                  <span className="text-lg text-muted-foreground">{stat.unit}</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">{stat.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Benefits List */}
          <motion.div
            className="bg-card/50 rounded-2xl border border-border p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Key Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl ${benefit.highlight ? "bg-primary/5 border border-primary/20" : "bg-muted/30"}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.08 }}
                >
                  <Check className={`w-5 h-5 flex-shrink-0 ${benefit.highlight ? "text-primary" : "text-accent"}`} />
                  <span className="text-sm text-foreground">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <a href="/" className="btn-primary">
              Try Bob Now
            </a>
            <button className="btn-ghost">View on GitHub</button>
          </motion.div>
        </div>
      );
    })(),
  },
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(() => {
    // Ensure we start at a valid slide index
    return 0;
  });
  const navigate = useNavigate();

  // Safeguard: ensure currentSlide is within bounds
  const safeCurrentSlide = Math.min(currentSlide, slides.length - 1);

  useEffect(() => {
    // Reset to valid index if out of bounds
    if (currentSlide >= slides.length) {
      setCurrentSlide(slides.length - 1);
    }
  }, [currentSlide]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(safeCurrentSlide + 1);
  }, [safeCurrentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(safeCurrentSlide - 1);
  }, [safeCurrentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
        case "Escape":
          navigate("/");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, navigate]);

  const slide = slides[safeCurrentSlide];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Home className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="text-sm text-muted-foreground">
          {safeCurrentSlide + 1} / {slides.length}
        </div>
      </header>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((safeCurrentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Slide content */}
      <main className="flex-1 flex items-center justify-center px-8 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="w-full max-w-6xl text-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {slide.title}
            </motion.h1>
            {slide.subtitle && (
              <motion.p
                className="text-xl md:text-2xl text-primary mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {slide.subtitle}
              </motion.p>
            )}
            <div className="flex justify-center mt-8">{slide.content}</div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation buttons */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={prevSlide}
          disabled={safeCurrentSlide === 0}
          className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <button
          onClick={nextSlide}
          disabled={safeCurrentSlide === slides.length - 1}
          className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Slide dots */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 translate-y-12 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === safeCurrentSlide ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground hidden md:block">
        Use ← → arrows or click to navigate • ESC to exit
      </div>
    </div>
  );
}
