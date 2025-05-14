
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

type ComponentInfo = {
  id: string;
  name: string;
  description: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const ComputerBlockDiagram = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null);
  const [activeDataFlow, setActiveDataFlow] = useState<string | null>(null);

  // Define computer components
  const components: ComponentInfo[] = [
    {
      id: 'cpu',
      name: 'CPU (Central Processing Unit)',
      description: 'The brain of the computer that executes instructions of a computer program.',
      color: 'comp-cpu',
      x: 150,
      y: 50,
      width: 300,
      height: 200
    },
    {
      id: 'alu',
      name: 'ALU (Arithmetic Logic Unit)',
      description: 'Performs arithmetic and logical operations like addition, subtraction, AND, OR.',
      color: 'comp-alu',
      x: 170,
      y: 90,
      width: 120,
      height: 70
    },
    {
      id: 'cu',
      name: 'CU (Control Unit)',
      description: 'Directs operation of the processor, tells the memory, ALU and I/O devices how to respond to program instructions.',
      color: 'comp-cu',
      x: 310,
      y: 90,
      width: 120,
      height: 70
    },
    {
      id: 'registers',
      name: 'Registers',
      description: 'Small, fast storage locations within the CPU that hold data being processed.',
      color: 'comp-cu',
      x: 240,
      y: 170,
      width: 120,
      height: 50
    },
    {
      id: 'memory',
      name: 'Memory (RAM)',
      description: 'Temporary storage that holds data and program instructions currently being used.',
      color: 'comp-memory',
      x: 500,
      y: 100,
      width: 100,
      height: 100
    },
    {
      id: 'input',
      name: 'Input Devices',
      description: 'Hardware that sends data to the computer, like keyboards, mice, and scanners.',
      color: 'comp-input',
      x: 150,
      y: 300,
      width: 120,
      height: 80
    },
    {
      id: 'output',
      name: 'Output Devices',
      description: 'Hardware that receives data from the computer, like monitors, printers, and speakers.',
      color: 'comp-output',
      x: 330,
      y: 300,
      width: 120,
      height: 80
    }
  ];

  // Define data flow paths
  const dataFlows = [
    { id: 'input-cpu', from: 'input', to: 'cpu', path: 'M210,300 L210,250' },
    { id: 'cpu-output', from: 'cpu', to: 'output', path: 'M390,250 L390,300' },
    { id: 'cpu-memory', from: 'cpu', to: 'memory', path: 'M450,150 L500,150' },
    { id: 'memory-cpu', from: 'memory', to: 'cpu', path: 'M500,170 L450,170' },
    { id: 'cu-alu', from: 'cu', to: 'alu', path: 'M310,125 L290,125' },
    { id: 'alu-registers', from: 'alu', to: 'registers', path: 'M230,160 L240,170' },
    { id: 'registers-cu', from: 'registers', to: 'cu', path: 'M360,170 L370,160' }
  ];

  const handleComponentClick = (component: ComponentInfo) => {
    setSelectedComponent(component);
    
    // Find data flows related to this component
    const relatedFlows = dataFlows.filter(
      flow => flow.from === component.id || flow.to === component.id
    );
    
    if (relatedFlows.length > 0) {
      // Cycle through related flows one by one
      const nextFlowIndex = relatedFlows.findIndex(flow => flow.id === activeDataFlow) + 1;
      const nextFlow = nextFlowIndex < relatedFlows.length ? relatedFlows[nextFlowIndex].id : relatedFlows[0].id;
      setActiveDataFlow(nextFlow);
    }
  };

  const resetSelection = () => {
    setSelectedComponent(null);
    setActiveDataFlow(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Computer Block Diagram</CardTitle>
        <CardDescription>
          Click on any component to learn more about its function
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-x-auto" style={{ minHeight: '420px' }}>
          <svg width="650" height="420" viewBox="0 0 650 420" className="mx-auto">
            {/* Data flow paths */}
            {dataFlows.map((flow) => (
              <path
                key={flow.id}
                d={flow.path}
                fill="none"
                stroke={activeDataFlow === flow.id ? "#3B82F6" : "#94A3B8"}
                strokeWidth="3"
                strokeDasharray={activeDataFlow === flow.id ? "10" : "0"}
                className={activeDataFlow === flow.id ? "animate-data-flow" : ""}
                markerEnd="url(#arrowhead)"
              />
            ))}
            
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
              </marker>
            </defs>
            
            {/* Components */}
            {components.map((comp) => (
              <g key={comp.id} onClick={() => handleComponentClick(comp)}>
                <rect
                  x={comp.x}
                  y={comp.y}
                  width={comp.width}
                  height={comp.height}
                  rx="5"
                  ry="5"
                  className={`fill-${comp.color} cursor-pointer hover:opacity-90 ${
                    selectedComponent?.id === comp.id ? 'stroke-blue-600 stroke-2 animate-pulse-opacity' : ''
                  }`}
                />
                <text
                  x={comp.x + comp.width / 2}
                  y={comp.y + comp.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  className="font-medium text-sm pointer-events-none"
                >
                  {comp.name.split(' ')[0]}
                </text>
              </g>
            ))}
          </svg>
        </div>
        
        {/* Component information display */}
        {selectedComponent && (
          <div className="mt-4 p-4 bg-muted rounded-md animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{selectedComponent.name}</h3>
              <Button variant="ghost" size="sm" onClick={resetSelection}>Close</Button>
            </div>
            <p className="mt-2">{selectedComponent.description}</p>
            {dataFlows.some(flow => flow.from === selectedComponent.id || flow.to === selectedComponent.id) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => handleComponentClick(selectedComponent)}
              >
                Show Data Flow <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComputerBlockDiagram;
