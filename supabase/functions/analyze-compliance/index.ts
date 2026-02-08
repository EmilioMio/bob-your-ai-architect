import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Blueprint {
  projectName: string;
  projectType: string;
  fileStructure: {
    frontend?: FileNode;
    backend?: FileNode;
  };
  architectureRules: Array<{
    category: string;
    rules: string[];
  }>;
  database?: {
    tables: Array<{ name: string }>;
  };
}

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  children?: FileNode[];
}

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

function extractExpectedPaths(node: FileNode, basePath: string = ''): string[] {
  const paths: string[] = [];
  const currentPath = basePath ? `${basePath}/${node.name}` : node.name;
  
  if (node.type === 'folder') {
    paths.push(currentPath + '/');
    if (node.children) {
      for (const child of node.children) {
        paths.push(...extractExpectedPaths(child, currentPath));
      }
    }
  } else {
    paths.push(currentPath);
  }
  
  return paths;
}

function analyzeStructure(actualFiles: string[], blueprint: Blueprint): Violation[] {
  const violations: Violation[] = [];
  
  // Extract expected folder structure
  const expectedFolders: string[] = [];
  if (blueprint.fileStructure.frontend) {
    expectedFolders.push(...extractExpectedPaths(blueprint.fileStructure.frontend)
      .filter(p => p.endsWith('/')));
  }
  if (blueprint.fileStructure.backend) {
    expectedFolders.push(...extractExpectedPaths(blueprint.fileStructure.backend)
      .filter(p => p.endsWith('/')));
  }
  
  // Check for missing key folders
  const actualFolders = new Set(actualFiles.filter(f => f.endsWith('/')));
  
  for (const expected of expectedFolders) {
    const folderName = expected.replace(/\/$/, '').split('/').pop();
    const hasFolder = Array.from(actualFolders).some(f => f.includes(folderName + '/'));
    
    if (!hasFolder && folderName) {
      violations.push({
        severity: 'warning',
        rule: 'Structure Compliance',
        category: 'File Structure',
        message: `Missing expected folder: ${folderName}`,
        suggestion: `Create the ${folderName}/ directory as defined in the architecture blueprint`
      });
    }
  }
  
  return violations;
}

function analyzeRuleCompliance(actualFiles: string[], fileContents: Record<string, string>, blueprint: Blueprint): Violation[] {
  const violations: Violation[] = [];
  
  for (const ruleCategory of blueprint.architectureRules) {
    for (const rule of ruleCategory.rules) {
      // Check component organization rules
      if (rule.toLowerCase().includes('components') && rule.toLowerCase().includes('/')) {
        const componentPath = rule.match(/\/[\w\/]+\//)?.[0];
        if (componentPath) {
          const hasComponentsInPath = actualFiles.some(f => f.includes(componentPath.slice(1)));
          if (!hasComponentsInPath) {
            violations.push({
              severity: 'info',
              rule: rule,
              category: ruleCategory.category,
              message: `Rule suggests organizing components in specific paths`,
              suggestion: `Consider organizing components according to: ${rule}`
            });
          }
        }
      }
      
      // Check file size rules (max lines per file)
      const maxLinesMatch = rule.match(/max\s+(\d+)\s+lines/i);
      if (maxLinesMatch) {
        const maxLines = parseInt(maxLinesMatch[1]);
        for (const [filePath, content] of Object.entries(fileContents)) {
          const lineCount = content.split('\n').length;
          if (lineCount > maxLines) {
            violations.push({
              severity: 'warning',
              rule: rule,
              category: ruleCategory.category,
              message: `File ${filePath} has ${lineCount} lines, exceeding the ${maxLines} line limit`,
              file: filePath,
              suggestion: `Refactor this file to reduce its size. Consider extracting logic into separate modules.`
            });
          }
        }
      }
    }
  }
  
  return violations;
}

async function analyzeWithAI(
  actualFiles: string[],
  fileContents: Record<string, string>,
  blueprint: Blueprint
): Promise<{ violations: Violation[]; suggestions: string[] }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    return { violations: [], suggestions: [] };
  }
  
  const sampleFiles = Object.entries(fileContents)
    .slice(0, 10)
    .map(([path, content]) => `--- ${path} ---\n${content.slice(0, 500)}...`)
    .join('\n\n');
  
  const prompt = `You are an expert code architecture reviewer. Analyze this project against its architecture blueprint.

BLUEPRINT RULES:
${blueprint.architectureRules.map(cat => `${cat.category}:\n${cat.rules.map(r => `- ${r}`).join('\n')}`).join('\n\n')}

PROJECT TYPE: ${blueprint.projectType}

ACTUAL FILE STRUCTURE:
${actualFiles.slice(0, 50).join('\n')}

SAMPLE CODE FILES:
${sampleFiles}

Analyze the code and return a JSON object with:
1. "violations": Array of rule violations found. Each violation has:
   - severity: "error" | "warning" | "info"
   - rule: The specific rule being violated
   - category: The category of the rule
   - message: Clear description of the violation
   - file: Optional file path where violation occurs
   - suggestion: How to fix it

2. "suggestions": Array of improvement suggestions (strings)

Focus on:
- File organization matching the blueprint
- Code patterns matching the rules
- Missing required structures
- Best practice violations

Return ONLY the JSON object, no markdown.`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a code architecture expert. Return only valid JSON." },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI analysis failed:", response.status);
      return { violations: [], suggestions: [] };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("AI analysis error:", error);
  }
  
  return { violations: [], suggestions: [] };
}

function calculateScore(violations: Violation[]): number {
  let score = 100;
  
  for (const v of violations) {
    if (v.severity === 'error') score -= 15;
    else if (v.severity === 'warning') score -= 5;
    else score -= 1;
  }
  
  return Math.max(0, Math.min(100, score));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { files, fileContents, blueprint } = await req.json();
    
    if (!files || !blueprint) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: files and blueprint" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Analyzing ${files.length} files against blueprint for "${blueprint.projectName}"`);
    
    // Run structural analysis
    const structureViolations = analyzeStructure(files, blueprint);
    
    // Run rule compliance analysis
    const ruleViolations = analyzeRuleCompliance(files, fileContents || {}, blueprint);
    
    // Run AI-powered deep analysis
    const aiAnalysis = await analyzeWithAI(files, fileContents || {}, blueprint);
    
    // Combine all violations
    const allViolations = [
      ...structureViolations,
      ...ruleViolations,
      ...aiAnalysis.violations
    ];
    
    // Calculate compliance score
    const complianceScore = calculateScore(allViolations);
    
    // Generate summary
    const errorCount = allViolations.filter(v => v.severity === 'error').length;
    const warningCount = allViolations.filter(v => v.severity === 'warning').length;
    
    const summary = complianceScore >= 90 
      ? "Excellent! Your project closely follows the architecture blueprint."
      : complianceScore >= 70
      ? `Good structure with some improvements needed. Found ${errorCount} errors and ${warningCount} warnings.`
      : complianceScore >= 50
      ? `Moderate compliance. Consider addressing ${errorCount} errors and ${warningCount} warnings.`
      : `Significant architectural deviations detected. Review the ${allViolations.length} issues found.`;
    
    const result: AnalysisResult = {
      complianceScore,
      violations: allViolations,
      suggestions: aiAnalysis.suggestions || [],
      summary
    };
    
    console.log(`Analysis complete. Score: ${complianceScore}, Violations: ${allViolations.length}`);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Compliance analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
