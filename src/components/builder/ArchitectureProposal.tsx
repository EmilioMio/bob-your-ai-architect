import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  FolderTree,
  FileCode,
  Download,
  Copy,
  ExternalLink,
  ArrowLeft,
  Check,
  Lightbulb,
  Scale,
  Target,
  Loader2,
  X,
  Database,
  Server,
  Code2,
  RefreshCw,
  Save,
  FolderOpen,
  FileSearch,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ProjectFormData, Agent, ChatMessage, GeneratedArchitecture, ArchitectureFile } from "./types";
import { generateArchitecture } from "@/lib/bob-ai";
import { DatabaseERDiagram } from "./DatabaseERDiagram";
import { Badge } from "@/components/ui/badge";
import {
  generateBlueprint,
  generateReadme,
  generateArchitectureDocs,
  generateDatabaseDocs,
  generateApiDocs,
  Blueprint,
} from "@/lib/blueprint-generator";
import { saveProject } from "@/lib/project-storage";
import { ComplianceChecker } from "./ComplianceChecker";
import { ProjectWorkspace } from "./ProjectWorkspace";
import { SavedProject } from "@/lib/project-storage";

interface ArchitectureProposalProps {
  formData: ProjectFormData;
  onLoadProject?: (project: SavedProject) => void;
  agents: Agent[];
  conversationHistory: ChatMessage[];
  onBack: () => void;
}

export function ArchitectureProposal({
  formData,
  agents,
  conversationHistory,
  onBack,
  onLoadProject,
}: ArchitectureProposalProps) {
  const [architecture, setArchitecture] = useState<GeneratedArchitecture | null>(null);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationStage, setGenerationStage] = useState("Initializing...");
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedAgents, setExpandedAgents] = useState<string[]>([]);
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isGeneratingFiles, setIsGeneratingFiles] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [showComplianceChecker, setShowComplianceChecker] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    loadArchitecture();
  }, []);

  const loadArchitecture = async () => {
    setIsGenerating(true);
    setError(null);

    const stages = [
      { text: "Analyzing project requirements...", agents: ["Structure Agent"] },
      { text: "Consulting specialist agents...", agents: ["Security Agent", "Performance Agent", "Cost Agent"] },
      { text: "Designing file structure...", agents: ["Structure Agent"] },
      { text: "Designing database schema...", agents: ["Database Agent"] },
      { text: "Generating recommendations...", agents: ["All Specialists"] },
      { text: "Finalizing architecture...", agents: [] },
    ];

    let currentStage = 0;
    const stageInterval = setInterval(() => {
      if (currentStage < stages.length) {
        setGenerationStage(stages[currentStage].text);
        setActiveAgents(stages[currentStage].agents);
        currentStage++;
      }
    }, 1200);

    try {
      const generated = await generateArchitecture(formData, conversationHistory);

      clearInterval(stageInterval);

      if (generated && typeof generated === "object") {
        const arch = generated as unknown as GeneratedArchitecture;
        setArchitecture(arch);

        // Generate blueprint
        const bp = generateBlueprint(arch, formData);
        setBlueprint(bp);

        setError(null);
      } else {
        throw new Error("Invalid architecture response");
      }
    } catch (err) {
      clearInterval(stageInterval);
      console.error("Failed to generate architecture:", err);
      setError("Failed to generate architecture. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationStage("");
      setActiveAgents([]);
    }
  };

  const toggleAgent = (id: string) => {
    setExpandedAgents((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const toggleTable = (name: string) => {
    setExpandedTables((prev) => (prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]));
  };

  const handleCopyRules = () => {
    if (!architecture) return;
    const rulesText = architecture.architectureRules
      .map((cat) => `## ${cat.category}\n${cat.rules.map((r) => `- ${r}`).join("\n")}`)
      .join("\n\n");
    navigator.clipboard.writeText(rulesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateFiles = async () => {
    if (!architecture || !blueprint) return;
    setIsGeneratingFiles(true);
    setGenerationProgress(0);

    try {
      const zip = new JSZip();

      // Generate blueprint.json (most important!)
      zip.file("blueprint.json", JSON.stringify(blueprint, null, 2));
      setGenerationProgress(10);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Generate documentation files
      zip.file("README.md", generateReadme(blueprint));
      setGenerationProgress(20);
      await new Promise((resolve) => setTimeout(resolve, 100));

      zip.file("ARCHITECTURE.md", generateArchitectureDocs(blueprint));
      setGenerationProgress(30);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dbDocs = generateDatabaseDocs(blueprint);
      if (dbDocs) {
        zip.file("DATABASE.md", dbDocs);
      }
      setGenerationProgress(40);
      await new Promise((resolve) => setTimeout(resolve, 100));

      const apiDocs = generateApiDocs(blueprint);
      if (apiDocs) {
        zip.file("API.md", apiDocs);
      }
      setGenerationProgress(50);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Generate project structure files
      const files = generateFileContents(architecture, formData);
      const fileEntries = Object.entries(files);

      for (let i = 0; i < fileEntries.length; i++) {
        const [path, content] = fileEntries[i];
        // Skip files we already generated
        if (!["README.md", "ARCHITECTURE.md", "DATABASE.md", "API.md", "blueprint.json"].includes(path)) {
          zip.file(path, content);
        }
        setGenerationProgress(50 + Math.round(((i + 1) / fileEntries.length) * 50));
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const safeName = architecture.projectName.toLowerCase().replace(/\s+/g, "-");
      saveAs(blob, `${safeName}-project.zip`);

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error generating files:", error);
    } finally {
      setIsGeneratingFiles(false);
      setGenerationProgress(0);
    }
  };

  const handleSaveProject = async () => {
    if (!architecture || !blueprint) return;
    setIsSaving(true);

    try {
      const projectId = await saveProject(
        architecture.projectName,
        formData,
        conversationHistory,
        architecture,
        blueprint,
        currentProjectId || undefined,
      );

      if (projectId) {
        setCurrentProjectId(projectId);
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportArchitecture = () => {
    if (!architecture) return;
    const safeName = architecture.projectName.toLowerCase().replace(/\s+/g, "-");

    const jsonBlob = new Blob([JSON.stringify(architecture, null, 2)], { type: "application/json" });
    saveAs(jsonBlob, `bob-blueprint.json`);
  };

  const handleLoadProject = (project: SavedProject) => {
    if (project.architecture) {
      setArchitecture(project.architecture);
      setBlueprint(project.blueprint);
      setCurrentProjectId(project.id);
      setIsGenerating(false);
    }
    if (onLoadProject) {
      onLoadProject(project);
    }
  };

  // Loading state with agent activity
  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[400px] flex flex-col items-center justify-center p-8"
      >
        <div className="relative mb-8">
          <motion.div
            className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 0 0 rgba(var(--primary), 0.2)",
                "0 0 0 20px rgba(var(--primary), 0)",
                "0 0 0 0 rgba(var(--primary), 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">Bob is designing your architecture</h3>
          <p className="text-muted-foreground mb-6">{generationStage}</p>
        </motion.div>

        {activeAgents.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-center gap-2">
            {activeAgents.map((agent) => (
              <motion.div
                key={agent}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
              >
                <span className="text-sm font-medium text-primary">{agent}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Error state
  if (error || !architecture) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[400px] flex flex-col items-center justify-center p-8"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-lg text-foreground mb-4">{error || "Failed to generate architecture"}</p>
          <button onClick={loadArchitecture} className="btn-primary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            {architecture.projectName}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{architecture.summary}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {architecture.projectType}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formData.teamSize} team • {formData.timeline}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowWorkspace(true)} className="btn-ghost text-sm" title="View Projects">
            <FolderOpen className="w-4 h-4 mr-1" />
            Projects
          </button>
          <button onClick={() => setShowComplianceChecker(true)} className="btn-ghost text-sm" title="Check Compliance">
            <FileSearch className="w-4 h-4 mr-1" />
            Compliance
          </button>
          <button onClick={onBack} className="btn-ghost text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Frontend Structure */}
          {architecture.fileStructure.frontend && (
            <div className="card-elevated p-4 max-h-[300px] overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                <Code2 className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground">Frontend Structure</h3>
              </div>
              <div className="overflow-y-auto flex-1 -mr-2 pr-2">
                <FileTreeNode node={architecture.fileStructure.frontend} />
              </div>
            </div>
          )}

          {/* Backend Structure */}
          {architecture.fileStructure.backend && (
            <div className="card-elevated p-4 max-h-[300px] overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                <Server className="w-4 h-4 text-emerald-500" />
                <h3 className="font-semibold text-foreground">Backend Structure</h3>
              </div>
              <div className="overflow-y-auto flex-1 -mr-2 pr-2">
                <FileTreeNode node={architecture.fileStructure.backend} />
              </div>
            </div>
          )}

          {/* API Endpoints */}
          {architecture.apiEndpoints && architecture.apiEndpoints.length > 0 && (
            <div className="card-elevated p-4 max-h-[250px] overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                <ExternalLink className="w-4 h-4 text-purple-500" />
                <h3 className="font-semibold text-foreground">API Endpoints</h3>
              </div>
              <div className="overflow-y-auto flex-1 space-y-2 -mr-2 pr-2">
                {architecture.apiEndpoints.map((endpoint, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          endpoint.method === "GET"
                            ? "bg-emerald-500/20 text-emerald-600"
                            : endpoint.method === "POST"
                              ? "bg-blue-500/20 text-blue-600"
                              : endpoint.method === "PUT"
                                ? "bg-amber-500/20 text-amber-600"
                                : endpoint.method === "DELETE"
                                  ? "bg-red-500/20 text-red-600"
                                  : "bg-purple-500/20 text-purple-600"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="text-xs font-mono text-foreground">{endpoint.path}</code>
                      {endpoint.auth && <span className="text-[10px] text-muted-foreground">🔒</span>}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">{endpoint.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Database Schema */}
          {architecture.database?.required && (
            <div className="card-elevated p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-500" />
                  <h3 className="font-semibold text-foreground">Database Schema</h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  {architecture.database.type}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mb-3">{architecture.database.description}</p>

              {/* ER Diagram */}
              {architecture.database.relationships.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-foreground mb-2">Entity Relationships</p>
                  <DatabaseERDiagram
                    tables={architecture.database.tables}
                    relationships={architecture.database.relationships}
                  />
                </div>
              )}

              {/* Tables List */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {architecture.database.tables.map((table) => (
                  <div key={table.name} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleTable(table.name)}
                      className="w-full flex items-center justify-between p-2 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Database className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{table.name}</span>
                        <span className="text-[10px] text-muted-foreground">({table.columns.length} cols)</span>
                      </div>
                      <ChevronDown
                        className={`w-3 h-3 text-muted-foreground transition-transform ${
                          expandedTables.includes(table.name) ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {expandedTables.includes(table.name) && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-2 pt-0 space-y-1">
                            {table.columns.map((col) => (
                              <div key={col.name} className="flex items-center justify-between text-[11px]">
                                <span className="flex items-center gap-1">
                                  <span className="font-mono text-foreground">{col.name}</span>
                                  {col.primaryKey && <span title="Primary Key">🔑</span>}
                                  {col.unique && <span title="Unique">✨</span>}
                                </span>
                                <span className="text-muted-foreground font-mono">{col.type}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent Decisions */}
          <div className="card-elevated p-4 max-h-[350px] overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-foreground">Agent Decisions</h3>
            </div>
            <div className="overflow-y-auto flex-1 space-y-2 -mr-2 pr-2">
              {architecture.agentDecisions.map((agent) => (
                <div key={agent.id} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleAgent(agent.id)}
                    className="w-full flex items-center justify-between p-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{agent.icon}</span>
                      <span className="text-sm font-medium text-foreground">{agent.name}</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 text-muted-foreground transition-transform ${
                        expandedAgents.includes(agent.id) ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedAgents.includes(agent.id) && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-2 pt-0 space-y-1.5">
                          {agent.summary.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                              <Check className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                          {agent.reasoning && (
                            <p className="text-[10px] text-primary/80 mt-2 pt-2 border-t border-border">
                              💡 {agent.reasoning}
                            </p>
                          )}
                          {agent.estimate && (
                            <p className="text-[11px] text-primary font-medium">Est: {agent.estimate}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Trade-off Resolution */}
              {architecture.tradeoffResolution && (
                <div className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg p-3 mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-sm text-foreground">Trade-off Resolution</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {architecture.tradeoffResolution.conflict}:
                    <span className="text-foreground font-medium"> {architecture.tradeoffResolution.decision}</span>
                    {" — "}
                    {architecture.tradeoffResolution.reasoning}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rules & Tech Stack */}
          <div className="card-elevated p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
              <h3 className="font-semibold text-foreground">Rules & Stack</h3>
              <button
                onClick={handleCopyRules}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Architecture Rules */}
            <div className="space-y-2 mb-4">
              {architecture.architectureRules.slice(0, 3).map((category) => (
                <div key={category.category} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${category.color}`} />
                    <span className="text-xs font-medium text-foreground">{category.category}</span>
                  </div>
                  {category.rules.slice(0, 2).map((rule, idx) => (
                    <p key={idx} className="text-[11px] text-muted-foreground pl-4">
                      ✓ {rule}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="border-t border-border pt-3">
              <h4 className="text-xs font-medium text-foreground mb-2">Tech Stack</h4>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                {architecture.techStack.frontend && (
                  <p>
                    <span className="text-muted-foreground">Frontend:</span> {architecture.techStack.frontend}
                  </p>
                )}
                {architecture.techStack.backend && (
                  <p>
                    <span className="text-muted-foreground">Backend:</span> {architecture.techStack.backend}
                  </p>
                )}
                {architecture.techStack.database && (
                  <p>
                    <span className="text-muted-foreground">DB:</span> {architecture.techStack.database}
                  </p>
                )}
                {architecture.techStack.deployment && (
                  <p>
                    <span className="text-muted-foreground">Deploy:</span> {architecture.techStack.deployment}
                  </p>
                )}
              </div>
            </div>

            {/* Tool Recommendations */}
            {architecture.toolRecommendations.length > 0 && (
              <div className="border-t border-border pt-3 mt-3">
                <h4 className="text-xs font-medium text-foreground mb-2">Recommended Tools</h4>
                <div className="space-y-1.5">
                  {architecture.toolRecommendations.slice(0, 3).map((tool) => (
                    <div key={tool.id} className="flex items-start gap-2">
                      <span>{tool.icon}</span>
                      <div>
                        <span className="text-xs font-medium text-foreground">{tool.name}</span>
                        <p className="text-[10px] text-muted-foreground">{tool.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          className="flex-1 btn-primary py-4 text-lg group disabled:opacity-70"
          whileHover={{ scale: isGeneratingFiles ? 1 : 1.01 }}
          whileTap={{ scale: isGeneratingFiles ? 1 : 0.99 }}
          onClick={handleGenerateFiles}
          disabled={isGeneratingFiles}
        >
          {isGeneratingFiles ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating... {generationProgress}%
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download Project
            </>
          )}
        </motion.button>
        <button className="btn-ghost px-6 disabled:opacity-50" onClick={handleSaveProject} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {currentProjectId ? "Saved" : "Save Project"}
        </button>
        <button className="btn-ghost px-6" onClick={handleExportArchitecture}>
          <ExternalLink className="w-4 h-4 mr-2" />
          Export JSON
        </button>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">✅ Project Generated!</h3>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Your "{architecture.projectName}" project has been downloaded. Push it to GitHub in 3 steps:
              </p>

              <div className="bg-muted/50 rounded-xl p-4 mb-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 font-medium">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Create a new repository</p>
                    <p className="text-xs text-muted-foreground">Click the button below to open GitHub</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 font-medium">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Unzip & drag files</p>
                    <p className="text-xs text-muted-foreground">
                      Unzip the download, then drag all files into the new repo
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 font-medium">
                    3
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Commit changes</p>
                    <p className="text-xs text-muted-foreground">Click "Commit changes" and you're done!</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-4">
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  💡 <strong>Pro tip:</strong> After creating the repo, click "uploading an existing file" on the empty
                  repo page, then drag your unzipped folder contents directly into the browser.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={`https://github.com/new?name=${encodeURIComponent(architecture.projectName.toLowerCase().replace(/\s+/g, "-"))}&description=${encodeURIComponent(formData.project)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-primary flex items-center justify-center gap-2"
                  onClick={() => setShowSuccessModal(false)}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  Create Repository on GitHub
                </a>
                <button onClick={() => setShowSuccessModal(false)} className="w-full btn-ghost text-sm">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Workspace Modal */}
      <ProjectWorkspace
        isOpen={showWorkspace}
        onClose={() => setShowWorkspace(false)}
        onSelectProject={handleLoadProject}
        onNewProject={onBack}
      />

      {/* Compliance Checker Modal */}
      <ComplianceChecker
        blueprint={blueprint || undefined}
        isOpen={showComplianceChecker}
        onClose={() => setShowComplianceChecker(false)}
      />
    </motion.div>
  );
}

// File tree node component
function FileTreeNode({ node, depth = 0 }: { node: ArchitectureFile; depth?: number }) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const hasChildren = node.type === "folder" && node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1.5 py-1 px-1 rounded hover:bg-muted/50 cursor-pointer text-sm ${
          depth === 0 ? "font-medium" : ""
        }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )
        ) : (
          <span className="w-3.5" />
        )}

        {node.type === "folder" ? (
          <FolderTree className="w-4 h-4 text-primary" />
        ) : (
          <FileCode className="w-4 h-4 text-muted-foreground" />
        )}

        <span className="text-foreground">{node.name}</span>

        {node.agentBadge && <span className="text-xs">{node.agentBadge}</span>}
        {node.fileCount && <span className="text-xs text-muted-foreground">({node.fileCount})</span>}
        {node.description && (
          <span className="text-[10px] text-muted-foreground ml-1 hidden sm:inline">{node.description}</span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {node.children!.map((child, idx) => (
              <FileTreeNode key={`${child.name}-${idx}`} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Generate file contents based on AI architecture
function generateFileContents(architecture: GeneratedArchitecture, formData: ProjectFormData): Record<string, string> {
  const safeName = architecture.projectName.toLowerCase().replace(/\s+/g, "-");

  const files: Record<string, string> = {
    "README.md": `# ${architecture.projectName}

## Project Overview
${formData.project}

## Project Type
${architecture.projectType}

## Summary
${architecture.summary}

## Team
- Size: ${formData.teamSize}
- Experience: ${formData.experience}
- Timeline: ${formData.timeline}

## Tech Stack
${Object.entries(architecture.techStack)
  .filter(([_, v]) => v)
  .map(([k, v]) => `- **${k}**: ${v}`)
  .join("\n")}

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

## Architecture
This project follows the architecture designed by Bob AI.
See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed guidelines.
`,
    "ARCHITECTURE.md": `# Architecture Guidelines

## File Structure Rules

${architecture.architectureRules
  .map(
    (cat) => `### ${cat.category}
${cat.rules.map((r) => `- ${r}`).join("\n")}`,
  )
  .join("\n\n")}

## Agent Recommendations

${architecture.agentDecisions
  .map(
    (agent) => `### ${agent.icon} ${agent.name}
${agent.summary.map((s) => `- ${s}`).join("\n")}
${agent.reasoning ? `\n*${agent.reasoning}*` : ""}
${agent.estimate ? `\n**Estimate**: ${agent.estimate}` : ""}`,
  )
  .join("\n\n")}

## Tool Recommendations

${architecture.toolRecommendations
  .map(
    (tool) => `### ${tool.icon} ${tool.name}
- **Purpose**: ${tool.purpose}
- **Why**: ${tool.reason}`,
  )
  .join("\n\n")}

---
*Generated by Bob the Architect on ${new Date().toLocaleDateString()}*
`,
  };

  // Add database schema if required
  if (architecture.database?.required) {
    files["DATABASE.md"] = `# Database Schema

## Type: ${architecture.database.type}

${architecture.database.description}

## Tables

${architecture.database.tables
  .map(
    (table) => `### ${table.name}
| Column | Type | Constraints |
|--------|------|-------------|
${table.columns
  .map(
    (col) =>
      `| ${col.name} | ${col.type} | ${
        [col.primaryKey && "PK", col.unique && "UNIQUE", col.foreignKey && `FK → ${col.foreignKey}`]
          .filter(Boolean)
          .join(", ") || "-"
      } |`,
  )
  .join("\n")}`,
  )
  .join("\n\n")}

## Relationships

${architecture.database.relationships
  .map((rel) => `- **${rel.from}** ${rel.type} **${rel.to}** via \`${rel.foreignKey}\``)
  .join("\n")}
`;
  }

  // Add API docs if endpoints exist
  if (architecture.apiEndpoints && architecture.apiEndpoints.length > 0) {
    files["API.md"] = `# API Documentation

## Endpoints

${architecture.apiEndpoints
  .map(
    (ep) => `### ${ep.method} ${ep.path}
- **Purpose**: ${ep.purpose}
- **Auth Required**: ${ep.auth ? "Yes 🔒" : "No"}`,
  )
  .join("\n\n")}
`;
  }

  // Add package.json
  files["package.json"] = JSON.stringify(
    {
      name: safeName,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "npm run start",
        build: "npm run build",
        start: "npm run start",
        lint: "npm run lint",
      },
      dependencies: {},
      devDependencies: {},
    },
    null,
    2,
  );

  // Add .env.example
  files[".env.example"] = `# Environment Variables
# Copy this file to .env and fill in your values

# Database
DATABASE_URL=

# Authentication
AUTH_SECRET=

# API Keys
`;

  // Add .gitignore
  files[".gitignore"] = `# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
build/
.next/
out/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
`;

  return files;
}
