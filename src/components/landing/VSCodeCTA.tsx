import { motion } from 'framer-motion';
import { Download, ExternalLink, Zap, RefreshCw, Lightbulb, Target } from 'lucide-react';

const features = [
  { icon: Zap, text: 'Real-time pattern enforcement' },
  { icon: RefreshCw, text: 'Syncs with your Bob architecture' },
  { icon: Lightbulb, text: 'Contextual suggestions as you code' },
  { icon: Target, text: 'Zero configuration needed' },
];

export function VSCodeCTA() {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      
      <div className="section-container relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to code with confidence?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* VS Code Mockup */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-xl overflow-hidden border border-border shadow-xl">
              <div className="bg-code-bg px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <span className="text-code-comment text-sm ml-2">VS Code - Bob Extension Active</span>
              </div>
              
              <div className="bg-code-bg flex">
                {/* Sidebar */}
                <div className="w-12 bg-code-bg/80 border-r border-code-comment/20 py-4 flex flex-col items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-bold">B</span>
                  </div>
                  <div className="w-6 h-6 text-code-comment/50">📁</div>
                  <div className="w-6 h-6 text-code-comment/50">🔍</div>
                </div>
                
                {/* Editor */}
                <div className="flex-1 p-4 min-h-[200px]">
                  <pre className="text-sm font-mono">
                    <code>
                      <span className="text-code-keyword">function</span>
                      <span className="text-code-function"> Dashboard</span>
                      <span className="text-code-text">() {'{'}</span>
                      {'\n'}
                      <span className="text-code-comment">  // Bob: ✓ Following patterns</span>
                      {'\n'}
                      <span className="text-code-keyword">  return</span>
                      <span className="text-code-text"> {'<'}</span>
                      <span className="text-code-string">div</span>
                      <span className="text-code-text">{'>'}</span>
                      <span className="text-code-text">...</span>
                      <span className="text-code-text">{'</'}</span>
                      <span className="text-code-string">div</span>
                      <span className="text-code-text">{'>'}</span>
                      {'\n'}
                      <span className="text-code-text">{'}'}</span>
                    </code>
                  </pre>
                  
                  {/* Inline warning */}
                  <div className="mt-4 flex items-start gap-2 p-2 bg-warning/10 rounded border border-warning/20">
                    <span className="text-warning">⚠️</span>
                    <span className="text-xs text-warning">Consider extracting to /components</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Live
            </div>
          </motion.div>

          {/* CTA Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-foreground">
              Get the VS Code Extension
            </h3>
            
            <ul className="space-y-4">
              {features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature.text}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Download for VS Code
              </button>
              <button className="btn-ghost">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on GitHub
              </button>
            </div>

            <p className="text-sm text-muted-foreground pt-2">
              Works with existing projects too—Bob adapts to your structure
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
