import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FolderArchive, Github, AlertTriangle, CheckCircle, 
  Info, X, Loader2, FileCode, ChevronDown, ChevronRight,
  Lightbulb
} from 'lucide-react';
import JSZip from 'jszip';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Blueprint } from '@/lib/blueprint-generator';

interface Violation {
  severity: 'error' | 'warning' | 'info';
  rule: string;
  category: string;
  message: string;
  file?: string;
  suggestion: string;
}

interface AnalysisResult {
  complianceScore: number;
  violations: Violation[];
  suggestions: string[];
  summary: string;
}

interface ComplianceCheckerProps {
  blueprint?: Blueprint;
  isOpen: boolean;
  onClose: () => void;
}

export function ComplianceChecker({ blueprint, isOpen, onClose }: ComplianceCheckerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'zip' | 'github' | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleZipUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const zip = await JSZip.loadAsync(file);
      const files: string[] = [];
      const fileContents: Record<string, string> = {};
      let foundBlueprint: Blueprint | null = blueprint || null;

      // Extract files from ZIP
      for (const [path, zipEntry] of Object.entries(zip.files)) {
        if (!zipEntry.dir) {
          files.push(path);
          
          // Read text files
          if (path.match(/\.(ts|tsx|js|jsx|json|md|yaml|yml|css|scss|html)$/)) {
            try {
              const content = await zipEntry.async('string');
              fileContents[path] = content;
              
              // Look for blueprint.json
              if (path.endsWith('blueprint.json') && !foundBlueprint) {
                foundBlueprint = JSON.parse(content);
              }
            } catch {
              // Skip binary files
            }
          }
        } else {
          files.push(path);
        }
      }

      if (!foundBlueprint) {
        setError('No blueprint.json found in the uploaded project. Please generate an architecture first.');
        setIsAnalyzing(false);
        return;
      }

      // Call the analysis edge function
      const { data, error: fnError } = await supabase.functions.invoke('analyze-compliance', {
        body: { files, fileContents, blueprint: foundBlueprint }
      });

      if (fnError) throw fnError;

      setAnalysisResult(data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze project');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGithubAnalysis = async () => {
    if (!githubUrl.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Extract owner/repo from GitHub URL
      const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        throw new Error('Invalid GitHub URL. Please use format: https://github.com/owner/repo');
      }

      const [, owner, repo] = match;
      
      // Fetch repository contents via GitHub API
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Repository not found or is private');
        }
        throw new Error('Failed to fetch repository');
      }

      const data = await response.json();
      const files: string[] = data.tree.map((item: { path: string; type: string }) => 
        item.type === 'tree' ? item.path + '/' : item.path
      );

      // Look for blueprint.json
      let foundBlueprint: Blueprint | null = blueprint || null;
      const blueprintPath = files.find(f => f.endsWith('blueprint.json'));
      
      if (blueprintPath) {
        const bpResponse = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/main/${blueprintPath}`
        );
        if (bpResponse.ok) {
          foundBlueprint = await bpResponse.json();
        }
      }

      if (!foundBlueprint) {
        setError('No blueprint.json found in the repository. Please generate an architecture first.');
        setIsAnalyzing(false);
        return;
      }

      // Fetch a sample of file contents for deeper analysis
      const fileContents: Record<string, string> = {};
      const textFiles = files
        .filter(f => f.match(/\.(ts|tsx|js|jsx|json|md)$/))
        .slice(0, 15);

      for (const filePath of textFiles) {
        try {
          const fileResponse = await fetch(
            `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}`
          );
          if (fileResponse.ok) {
            fileContents[filePath] = await fileResponse.text();
          }
        } catch {
          // Skip failed fetches
        }
      }

      // Call the analysis edge function
      const { data: analysisData, error: fnError } = await supabase.functions.invoke('analyze-compliance', {
        body: { files, fileContents, blueprint: foundBlueprint }
      });

      if (fnError) throw fnError;

      setAnalysisResult(analysisData);
    } catch (err) {
      console.error('GitHub analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze repository');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-destructive';
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const groupedViolations = analysisResult?.violations.reduce((acc, v) => {
    if (!acc[v.category]) acc[v.category] = [];
    acc[v.category].push(v);
    return acc;
  }, {} as Record<string, Violation[]>) || {};

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Compliance Checker</h2>
              <p className="text-sm text-muted-foreground">
                Upload your project to check against the architecture blueprint
              </p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[70vh] p-6">
            {!analysisResult && !isAnalyzing && (
              <div className="space-y-6">
                {/* Upload Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ZIP Upload */}
                  <button
                    onClick={() => {
                      setUploadMethod('zip');
                      fileInputRef.current?.click();
                    }}
                    className={`p-6 rounded-xl border-2 border-dashed transition-all ${
                      uploadMethod === 'zip' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <FolderArchive className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">Upload ZIP</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload your project as a .zip file
                    </p>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip"
                    onChange={handleZipUpload}
                    className="hidden"
                  />

                  {/* GitHub URL */}
                  <button
                    onClick={() => setUploadMethod('github')}
                    className={`p-6 rounded-xl border-2 border-dashed transition-all ${
                      uploadMethod === 'github' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Github className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">GitHub Repository</h3>
                    <p className="text-sm text-muted-foreground">
                      Paste a public GitHub repo URL
                    </p>
                  </button>
                </div>

                {/* GitHub URL Input */}
                {uploadMethod === 'github' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="https://github.com/username/repository"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleGithubAnalysis}
                      disabled={!githubUrl.trim()}
                      className="w-full btn-primary disabled:opacity-50"
                    >
                      Analyze Repository
                    </button>
                  </motion.div>
                )}

                {error && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Info */}
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground font-medium mb-1">
                        What does the compliance checker do?
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Reads your blueprint.json to understand the expected architecture</li>
                        <li>• Analyzes your file structure and code patterns</li>
                        <li>• Compares actual implementation against blueprint rules</li>
                        <li>• Provides specific suggestions for improvements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Upload className="w-12 h-12 text-primary" />
                </motion.div>
                <p className="text-lg font-medium text-foreground mt-4">Analyzing your project...</p>
                <p className="text-sm text-muted-foreground">This may take a moment</p>
              </div>
            )}

            {/* Results */}
            {analysisResult && !isAnalyzing && (
              <div className="space-y-6">
                {/* Score */}
                <div className="text-center p-6 rounded-xl bg-muted/30 border border-border">
                  <div className={`text-6xl font-bold ${getScoreColor(analysisResult.complianceScore)}`}>
                    {analysisResult.complianceScore}%
                  </div>
                  <p className="text-lg font-medium text-foreground mt-2">Compliance Score</p>
                  <p className="text-sm text-muted-foreground mt-1">{analysisResult.summary}</p>
                </div>

                {/* Violations by Category */}
                {Object.keys(groupedViolations).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Issues Found ({analysisResult.violations.length})
                    </h3>
                    
                    {Object.entries(groupedViolations).map(([category, violations]) => (
                      <div key={category} className="border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleCategory(category)}
                          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {expandedCategories.includes(category) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                            <span className="font-medium text-foreground">{category}</span>
                            <Badge variant="outline" className="text-xs">
                              {violations.length}
                            </Badge>
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {expandedCategories.includes(category) && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-3 pt-0 space-y-2">
                                {violations.map((v, idx) => (
                                  <div 
                                    key={idx} 
                                    className="p-3 rounded-lg bg-muted/50 border border-border"
                                  >
                                    <div className="flex items-start gap-2">
                                      {getSeverityIcon(v.severity)}
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                          {v.message}
                                        </p>
                                        {v.file && (
                                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            <FileCode className="w-3 h-3" />
                                            {v.file}
                                          </p>
                                        )}
                                        <p className="text-xs text-primary mt-2">
                                          💡 {v.suggestion}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {analysisResult.suggestions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      Improvement Suggestions
                    </h3>
                    <div className="space-y-2">
                      {analysisResult.suggestions.map((suggestion, idx) => (
                        <div 
                          key={idx}
                          className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
                        >
                          <p className="text-sm text-foreground">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Clear */}
                {analysisResult.violations.length === 0 && (
                  <div className="text-center p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <p className="text-lg font-medium text-foreground">
                      Your project follows the architecture blueprint!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      No violations detected. Great job!
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setAnalysisResult(null);
                      setUploadMethod(null);
                      setError(null);
                    }}
                    className="flex-1 btn-ghost"
                  >
                    Analyze Another Project
                  </button>
                  <button onClick={onClose} className="btn-primary">
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
