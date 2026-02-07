import { motion } from 'framer-motion';
import { Monitor, Brain, Database, Rocket, ArrowRight } from 'lucide-react';

const workflowSteps = [
  {
    title: 'Input',
    description: 'Describe your project',
    icon: Monitor,
    color: 'from-primary/20 to-primary/5',
    borderColor: 'border-primary/30',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  {
    title: 'Analyze',
    description: 'AI agents evaluate',
    icon: Brain,
    color: 'from-accent/20 to-accent/5',
    borderColor: 'border-accent/30',
    iconColor: 'text-accent',
    iconBg: 'bg-accent/10',
  },
  {
    title: 'Design',
    description: 'Architecture generated',
    icon: Database,
    color: 'from-secondary/20 to-secondary/5',
    borderColor: 'border-secondary/30',
    iconColor: 'text-secondary-foreground',
    iconBg: 'bg-secondary',
  },
  {
    title: 'Deploy',
    description: 'Export & build',
    icon: Rocket,
    color: 'from-warning/20 to-warning/5',
    borderColor: 'border-warning/30',
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
  },
];

export function BackendFlowDiagram() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      <div className="section-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Visualize your flow
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            How Bob's architecture engine works under the hood
          </p>
        </motion.div>

        {/* Desktop: Horizontal Workflow */}
        <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6 max-w-5xl mx-auto">
          {workflowSteps.map((step, idx) => (
            <div key={step.title} className="flex items-center">
              {/* Step Card */}
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div
                  className={`rounded-2xl bg-gradient-to-br ${step.color} border ${step.borderColor} p-6 backdrop-blur-sm w-40 lg:w-48 text-center`}
                >
                  <div className={`w-12 h-12 rounded-xl ${step.iconBg} ${step.iconColor} flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>

              {/* Arrow Connector */}
              {idx < workflowSteps.length - 1 && (
                <motion.div
                  className="flex-shrink-0 mx-2 lg:mx-4"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 + 0.2 }}
                >
                  <ArrowRight className="w-5 h-5 text-muted-foreground/50" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: Vertical Workflow */}
        <div className="md:hidden relative max-w-sm mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/30 via-accent/30 to-warning/30" />

          <div className="space-y-6">
            {workflowSteps.map((step, idx) => (
              <motion.div
                key={step.title}
                className="relative flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Step Number Circle */}
                <div className={`w-12 h-12 rounded-full ${step.iconBg} ${step.iconColor} flex items-center justify-center flex-shrink-0 z-10 border-4 border-background`}>
                  <step.icon className="w-5 h-5" />
                </div>

                {/* Step Content */}
                <div className={`flex-1 rounded-2xl bg-gradient-to-r ${step.color} border ${step.borderColor} p-4`}>
                  <h3 className="font-semibold text-foreground text-base mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
