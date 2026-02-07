import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { DatabaseTable, DatabaseRelationship } from './types';

interface DatabaseERDiagramProps {
  tables: DatabaseTable[];
  relationships: DatabaseRelationship[];
}

export function DatabaseERDiagram({ tables, relationships }: DatabaseERDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || tables.length === 0) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      er: {
        useMaxWidth: true,
        layoutDirection: 'TB',
      },
      securityLevel: 'loose',
    });

    const mermaidCode = generateMermaidER(tables, relationships);
    
    const renderDiagram = async () => {
      try {
        const id = `er-diagram-${Date.now()}`;
        const { svg } = await mermaid.render(id, mermaidCode);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError('Unable to render diagram');
      }
    };

    renderDiagram();
  }, [tables, relationships]);

  if (tables.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        No database tables defined
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="text-sm text-muted-foreground mb-2">Entity Relationships:</div>
        <div className="space-y-2">
          {relationships.map((rel, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="font-mono bg-background px-2 py-1 rounded">{rel.from}</span>
              <span className="text-muted-foreground">
                {rel.type === 'one-to-one' && '1:1'}
                {rel.type === 'one-to-many' && '1:N'}
                {rel.type === 'many-to-one' && 'N:1'}
                {rel.type === 'many-to-many' && 'N:N'}
              </span>
              <span className="font-mono bg-background px-2 py-1 rounded">{rel.to}</span>
              <span className="text-muted-foreground">via {rel.foreignKey}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full overflow-x-auto bg-muted/30 rounded-lg p-4 min-h-[150px] flex items-center justify-center"
    />
  );
}

function generateMermaidER(tables: DatabaseTable[], relationships: DatabaseRelationship[]): string {
  let mermaid = 'erDiagram\n';

  // Add tables with their columns
  tables.forEach(table => {
    const safeName = table.name.replace(/[^a-zA-Z0-9_]/g, '_');
    mermaid += `    ${safeName} {\n`;
    
    table.columns.slice(0, 6).forEach(col => { // Limit to 6 columns for readability
      const safeColName = col.name.replace(/[^a-zA-Z0-9_]/g, '_');
      const type = simplifyType(col.type);
      const key = col.primaryKey ? ' PK' : col.unique ? ' UK' : col.foreignKey ? ' FK' : '';
      mermaid += `        ${type} ${safeColName}${key}\n`;
    });
    
    if (table.columns.length > 6) {
      mermaid += `        string more_fields\n`;
    }
    
    mermaid += '    }\n';
  });

  // Add relationships
  relationships.forEach(rel => {
    const safeFrom = rel.from.replace(/[^a-zA-Z0-9_]/g, '_');
    const safeTo = rel.to.replace(/[^a-zA-Z0-9_]/g, '_');
    const safeForeignKey = rel.foreignKey.replace(/[^a-zA-Z0-9_]/g, '_');
    
    // Only add relationship if both tables exist
    const fromExists = tables.some(t => t.name.replace(/[^a-zA-Z0-9_]/g, '_') === safeFrom);
    const toExists = tables.some(t => t.name.replace(/[^a-zA-Z0-9_]/g, '_') === safeTo);
    
    if (fromExists && toExists) {
      const symbol = 
        rel.type === 'one-to-one' ? '||--||' :
        rel.type === 'one-to-many' ? '||--o{' :
        rel.type === 'many-to-one' ? '}o--||' :
        '}o--o{';
      
      mermaid += `    ${safeFrom} ${symbol} ${safeTo} : "${safeForeignKey}"\n`;
    }
  });

  return mermaid;
}

function simplifyType(type: string): string {
  const upper = type.toUpperCase();
  if (upper.includes('UUID') || upper.includes('SERIAL')) return 'uuid';
  if (upper.includes('VARCHAR') || upper.includes('TEXT') || upper.includes('CHAR')) return 'string';
  if (upper.includes('INT') || upper.includes('SERIAL')) return 'int';
  if (upper.includes('DECIMAL') || upper.includes('FLOAT') || upper.includes('DOUBLE') || upper.includes('NUMERIC')) return 'float';
  if (upper.includes('BOOL')) return 'bool';
  if (upper.includes('TIMESTAMP') || upper.includes('DATE') || upper.includes('TIME')) return 'datetime';
  if (upper.includes('JSON')) return 'json';
  return 'string';
}
