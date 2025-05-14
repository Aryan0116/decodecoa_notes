
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComputerBlockDiagram from '@/components/simulations/ComputerBlockDiagram';
import InstructionCycleSimulation from '@/components/simulations/InstructionCycleSimulation';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Computer Architecture Learning Platform</h1>
        <p className="text-muted-foreground">Explore interactive simulations of computer organization and architecture</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-semibold mb-4">Simulations</h2>
          
          <Tabs defaultValue="block-diagram" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="block-diagram">Computer Block Diagram</TabsTrigger>
              <TabsTrigger value="instruction-cycle">Instruction Cycle</TabsTrigger>
            </TabsList>
            <TabsContent value="block-diagram" className="mt-4">
              <ComputerBlockDiagram />
            </TabsContent>
            <TabsContent value="instruction-cycle" className="mt-4">
              <InstructionCycleSimulation />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-muted rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> 
              Quick Notes
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Computer Architecture</h3>
                <p className="text-sm text-muted-foreground">Focuses on the design and organization of computer systems at a hardware level.</p>
              </div>
              <div>
                <h3 className="font-medium">Computer Block Diagram</h3>
                <p className="text-sm text-muted-foreground">Shows the main components of a computer system and how they interconnect.</p>
              </div>
              <div>
                <h3 className="font-medium">Instruction Cycle</h3>
                <p className="text-sm text-muted-foreground">The sequence of steps the CPU follows to execute a single instruction.</p>
              </div>
              <div className="pt-2">
                <Link to="/notes" className="text-primary hover:underline text-sm flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> View Full Notes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
