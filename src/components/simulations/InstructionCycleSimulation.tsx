import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleX, Clock, HardDrive } from 'lucide-react';

type CycleStep = {
  name: string;
  description: string;
  activeComponents: string[];
  diagram: React.ReactNode;
};

const InstructionCycleSimulation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const cycleSteps: CycleStep[] = [
    {
      name: 'Fetch',
      description: 'The CPU retrieves the instruction from memory at the address pointed to by the program counter (PC). The PC is then incremented to point to the next instruction.',
      activeComponents: ['cpu', 'cu', 'memory'],
      diagram: (
        <svg width="500" height="200" className="mx-auto">
          <rect x="100" y="50" width="120" height="80" rx="5" className="fill-comp-cpu stroke-gray-600" />
          <text x="160" y="90" textAnchor="middle" fill="white" className="font-medium">CPU</text>
          
          <rect x="300" y="50" width="100" height="80" rx="5" className="fill-comp-memory stroke-gray-600" />
          <text x="350" y="90" textAnchor="middle" fill="white" className="font-medium">Memory</text>
          
          <path d="M220,70 L300,70" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrowhead)" strokeDasharray="10" className="animate-data-flow" />
          <text x="260" y="60" textAnchor="middle" fill="#3B82F6" className="text-xs font-medium">PC → Memory</text>
          
          <path d="M300,110 L220,110" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrowhead)" strokeDasharray="10" className="animate-data-flow" />
          <text x="260" y="130" textAnchor="middle" fill="#3B82F6" className="text-xs font-medium">Instruction → IR</text>
          
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
        </svg>
      )
    },
    {
      name: 'Decode',
      description: 'The Control Unit decodes the instruction in the Instruction Register (IR) to determine what operation should be performed and what addressing modes are being used.',
      activeComponents: ['cpu', 'cu'],
      diagram: (
        <svg width="500" height="200" className="mx-auto">
          <rect x="100" y="50" width="120" height="80" rx="5" className="fill-comp-cpu stroke-gray-600" />
          <text x="160" y="90" textAnchor="middle" fill="white" className="font-medium">CPU</text>
          
          <rect x="110" y="70" width="100" height="50" rx="5" className="fill-comp-cu stroke-gray-600" />
          <text x="160" y="100" textAnchor="middle" fill="white" className="text-sm">Control Unit</text>
          
          <path d="M160,120 Q160,150 160,170" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrowhead)" strokeDasharray="10" className="animate-data-flow" />
          <text x="180" y="150" textAnchor="start" fill="#3B82F6" className="text-xs font-medium">Decode IR</text>
          
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
        </svg>
      )
    },
    {
      name: 'Execute',
      description: 'The CPU executes the instruction, which might involve performing calculations in the ALU, reading/writing to memory, or updating control flow.',
      activeComponents: ['cpu', 'alu', 'cu', 'memory'],
      diagram: (
        <svg width="500" height="200" className="mx-auto">
          <rect x="100" y="50" width="120" height="80" rx="5" className="fill-comp-cpu stroke-gray-600" />
          <text x="160" y="70" textAnchor="middle" fill="white" className="font-medium">CPU</text>
          
          <rect x="110" y="80" width="45" height="40" rx="5" className="fill-comp-alu stroke-gray-600" />
          <text x="132" y="105" textAnchor="middle" fill="white" className="text-xs">ALU</text>
          
          <rect x="165" y="80" width="45" height="40" rx="5" className="fill-comp-cu stroke-gray-600" />
          <text x="188" y="105" textAnchor="middle" fill="white" className="text-xs">CU</text>
          
          <rect x="300" y="50" width="100" height="80" rx="5" className="fill-comp-memory stroke-gray-600" />
          <text x="350" y="90" textAnchor="middle" fill="white" className="font-medium">Memory</text>
          
          <path d="M220,70 L300,70" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrowhead)" strokeDasharray="10" className="animate-data-flow" />
          <text x="260" y="60" textAnchor="middle" fill="#3B82F6" className="text-xs font-medium">Address → Memory</text>
          
          <path d="M300,110 L220,110" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrowhead)" strokeDasharray="10" className="animate-data-flow" />
          <text x="260" y="130" textAnchor="middle" fill="#3B82F6" className="text-xs font-medium">Data → CPU</text>
          
          <path d="M132,120 Q132,140 132,170" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrowhead)" strokeDasharray="10" className="animate-data-flow" />
          <text x="150" y="150" textAnchor="start" fill="#3B82F6" className="text-xs font-medium">Execute</text>
          
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
        </svg>
      )
    }
  ];
  
  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % cycleSteps.length);
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + cycleSteps.length) % cycleSteps.length);
  };
  
  const resetSimulation = () => {
    setCurrentStep(0);
  };

  const step = cycleSteps[currentStep];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Instruction Cycle Simulation</CardTitle>
        <CardDescription>
          Step through the basic instruction cycle: Fetch, Decode, Execute
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">
                {currentStep + 1}. {step.name} Stage
              </h3>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={prevStep}>Previous</Button>
              <Button variant="outline" size="sm" onClick={nextStep}>Next</Button>
              <Button variant="ghost" size="sm" onClick={resetSimulation}><CircleX className="h-4 w-4 mr-1" /> Reset</Button>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <p>{step.description}</p>
            
            <div className="mt-4 overflow-auto">
              {step.diagram}
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium flex items-center gap-1">
                <HardDrive className="h-4 w-4" /> Active Components:
              </h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {step.activeComponents.map((comp) => (
                  <span 
                    key={comp} 
                    className={`px-2 py-1 rounded text-sm text-white bg-comp-${comp === 'cu' ? 'cu' : comp === 'alu' ? 'alu' : comp === 'memory' ? 'memory' : 'cpu'}`}
                  >
                    {comp.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructionCycleSimulation;
