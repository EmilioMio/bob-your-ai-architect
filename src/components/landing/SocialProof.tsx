import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "The architectural decisions I used to spend hours debating, Bob handles in seconds.",
    role: "Senior Developer",
    perspective: "10+ years of experience",
  },
  {
    quote: "Finally, a junior-friendly tool that teaches best practices instead of just generating code.",
    role: "Junior Developer",
    perspective: "Learning clean architecture",
  },
  {
    quote: "Multi-agent orchestration is the future. Bob gets it.",
    role: "Tech Lead",
    perspective: "Managing 20+ developers",
  },
];

export function SocialProof() {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="section-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for the modern developer workflow
          </h2>
          <p className="text-lg text-muted-foreground">
            What developers are saying about Bob
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="card-elevated p-6 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <blockquote className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="border-t border-border pt-4">
                <p className="font-medium text-foreground">{testimonial.role}</p>
                <p className="text-sm text-muted-foreground">{testimonial.perspective}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
