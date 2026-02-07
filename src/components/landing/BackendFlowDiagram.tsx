import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import mermaid from 'mermaid';

const flowchartDefinition = `
graph TB
    subgraph INPUT["📥 Input Layer"]
        UI[User Interface]
        API[API Gateway]
    end

    subgraph CORE["🧠 Core Engine"]
        Parser[Request Parser]
        Analyzer[Project Analyzer]
        AI[AI Architecture]
        Rules[Rules Engine]
    end

    subgraph ORCHESTRATION["🤝 Multi-Agent"]
        Delegator[Task Delegator]
        Lovable[Lovable]
        Cursor[Cursor]
        Copilot[Copilot]
    end

    subgraph OUTPUT["📤 Output Layer"]
        FileGen[File Generator]
        VSCode[VS Code]
        Enforcement[Enforcement]
    end

    UI --> API
    API --> Parser
    Parser --> Analyzer
    Analyzer --> AI
    AI --> Rules
    Rules --> Delegator
    Delegator --> Lovable
    Delegator --> Cursor
    Delegator --> Copilot
    Lovable --> FileGen
    Cursor --> FileGen
    Copilot --> FileGen
    FileGen --> VSCode
    VSCode --> Enforcement
    Enforcement -.->|Feedback| Rules
`;

export function BackendFlowDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#2563EB',
        primaryTextColor: '#1e293b',
        primaryBorderColor: '#2563EB',
        secondaryColor: '#10B981',
        tertiaryColor: '#f8fafc',
        lineColor: '#64748b',
        textColor: '#334155',
        mainBkg: '#ffffff',
        nodeBorder: '#e2e8f0',
        clusterBkg: '#f8fafc',
        clusterBorder: '#e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    });

    const renderDiagram = async () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        const { svg } = await mermaid.render('backend-flow', flowchartDefinition);
        containerRef.current.innerHTML = svg;
      }
    };

    renderDiagram();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-muted/20">
      <div className="section-container">
        <motion.div
          className="text-center mb-12"
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="card-elevated p-8 bg-background overflow-x-auto">
            <div 
              ref={containerRef} 
              className="flex justify-center min-h-[400px] [&_svg]:max-w-full"
            />
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 mt-8"
        >
          {[
            { label: 'Input', color: 'bg-primary/20 border-primary' },
            { label: 'Processing', color: 'bg-accent/20 border-accent' },
            { label: 'Orchestration', color: 'bg-code-keyword/20 border-code-keyword' },
            { label: 'Output', color: 'bg-muted border-border' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border ${item.color}`} />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
