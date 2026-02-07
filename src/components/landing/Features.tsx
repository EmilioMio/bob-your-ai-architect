import { motion } from 'framer-motion';
import { Layers, Brain, Shield, Users, BookOpen, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Instant Scaffolding',
    description: 'Complete, production-ready project structure in seconds based on industry best practices and your specific needs.',
  },
  {
    icon: Brain,
    title: 'Adapts to Experience',
    description: "Beginner-friendly with helpful comments, or expert-level with clean architecture patterns. Bob meets you where you are.",
  },
  {
    icon: Shield,
    title: 'Live Pattern Enforcement',
    description: 'VS Code integration that flags architectural violations in real-time. You stay in control—Bob suggests, never forces.',
  },
  {
    icon: Users,
    title: 'Multi-Agent Orchestration',
    description: 'Bob delegates tasks to specialized AI tools (Lovable, Cursor, GitHub Copilot) for optimal workflow.',
  },
  {
    icon: BookOpen,
    title: 'Learns from GitHub',
    description: 'Trained on thousands of successful open-source projects to recommend proven patterns for your stack.',
  },
  {
    icon: CheckCircle,
    title: 'Consistency Checker',
    description: 'Every file, every import, every component location—validated against your architectural rules automatically.',
  },
];

export function Features() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="section-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for modern development teams
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to maintain architectural excellence at scale
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              className="card-elevated p-6 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
