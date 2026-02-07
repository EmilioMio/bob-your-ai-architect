import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import mermaid from "mermaid";

const flowchartDefinition = `
graph TD
    subgraph INPUT["📥 INPUT LAYER"]
        direction TB
        UI["<b>User Interface</b><br/>Interaction Hub"]
        API["<b>API Gateway</b><br/>Security & Routing"]
    end

    subgraph CORE["🧠 CORE ENGINE"]
        direction TB
        Parser["<b>Request Parser</b><br/>Context Extraction"]
        Analyzer["<b>Project Analyzer</b><br/>Heuristics Engine"]
        AI["<b>AI Architecture</b><br/>LLM Synthesis"]
        Rules["<b>Rules Engine</b><br/>Validation"]
    end

    subgraph ORCHESTRATION["🤝 MULTI-AGENT"]
        direction TB
        Delegator["<b>Task Delegator</b><br/>Agent Selection"]
        Lovable[("Lovable")]
        Cursor[("Cursor")]
        Copilot[("Copilot")]
    end

    subgraph OUTPUT["📤 OUTPUT LAYER"]
        direction TB
        FileGen["<b>File Generator</b><br/>Template Engine"]
        VSCode["<b>VS Code Extension</b><br/>Live Injection"]
        Enforcement["<b>Enforcement</b><br/>Auto-Formatting"]
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
    Enforcement -.->|Feedback Loop| Rules

    %% Custom Styles
    classDef default font-family:Inter, sans-serif, font-size:12px;
    classDef layer fill:transparent,stroke-width:2px,stroke-dasharray: 5 5;
    
    class INPUT,CORE,ORCHESTRATION,OUTPUT layer;
`;

export function BackendFlowDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        primaryColor: "#3b82f6",
        primaryTextColor: "#f8fafc",
        primaryBorderColor: "#60a5fa",
        lineColor: "#6366f1",
        secondaryColor: "#1e293b",
        tertiaryColor: "#0f172a",
        background: "transparent",
        mainBkg: "#1e293b",
        nodeBorder: "#3b82f6",
        clusterBkg: "rgba(15, 23, 42, 0.4)",
        clusterBorder: "#334155",
        titleColor: "#94a3b8",
        nodeTextColor: "#f1f5f9",
      },
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        padding: 30,
      },
    });

    const renderDiagram = async () => {
      if (containerRef.current) {
        try {
          const id = `backend-flow-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, flowchartDefinition);
          containerRef.current.innerHTML = svg;
        } catch (error) {
          console.error("Mermaid render error:", error);
        }
      }
    };

    renderDiagram();
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#020617]">
      {/* Bakgrunds-effekt (Ambient Light) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Visualizing the <span className="text-blue-500">Core Engine</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Experience how Bob orchestrates complex architectures and multi-agent workflows in milliseconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative group">
            {/* Animerad Border Gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

            <div className="relative p-8 md:p-12 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl overflow-x-auto">
              <div
                ref={containerRef}
                className="flex justify-center min-h-[500px] [&_svg]:max-w-full [&_svg]:h-auto transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 mt-12"
        >
          {[
            { label: "Input", color: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" },
            { label: "Core AI", color: "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" },
            { label: "Agents", color: "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" },
            { label: "Output", color: "bg-slate-500 shadow-[0_0_10px_rgba(148,163,184,0.5)]" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .node rect, .node circle, .node polygon {
          fill: #1e293b !important;
          stroke: #3b82f6 !important;
          stroke-width: 2px !important;
        }
        .edgePath .path {
          stroke: #6366f1 !important;
          stroke-width: 2px !important;
        }
        .label {
          color: #f1f5f9 !important;
        }
        .cluster rect {
          fill: rgba(30, 41, 59, 0.4) !important;
          stroke: #334155 !important;
          rx: 15;
        }
        .cluster-label span {
            color: #64748b !important;
            font-weight: 800 !important;
            letter-spacing: 0.1em;
        }
      `}} />
    </section>
  );
}
