import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Database, HardDrive, Layers, Clock } from 'lucide-react';

const ComputerArchitectureNotes = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            <CardTitle>Basic Computer Organization</CardTitle>
          </div>
          <CardDescription>Fundamental components and structure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Computer Block Diagram</h3>
            <p>A computer system consists of several key components that work together:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><span className="font-medium">CPU (Central Processing Unit):</span> Controls the operation of the computer and performs data processing.</li>
              <li><span className="font-medium">ALU (Arithmetic Logic Unit):</span> Performs mathematical calculations and logical operations.</li>
              <li><span className="font-medium">Control Unit:</span> Manages and coordinates the activities of all parts of the computer.</li>
              <li><span className="font-medium">Registers:</span> Small, high-speed memory units within the CPU.</li>
              <li><span className="font-medium">Memory (RAM):</span> Temporarily stores data and instructions being used by the CPU.</li>
              <li><span className="font-medium">Input Devices:</span> Provide data to the computer (keyboard, mouse, etc.).</li>
              <li><span className="font-medium">Output Devices:</span> Display or provide results (monitor, printer, etc.).</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-1">Instruction Cycle</h3>
            <p>The basic operation of a computer follows a cycle known as the instruction cycle:</p>
            <ol className="list-decimal pl-6 space-y-1 mt-2">
              <li><span className="font-medium">Fetch:</span> The CPU retrieves an instruction from memory using the address in the program counter (PC).</li>
              <li><span className="font-medium">Decode:</span> The control unit interprets the instruction to determine what operation to perform.</li>
              <li><span className="font-medium">Execute:</span> The CPU carries out the instruction, which might involve arithmetic operations, data transfers, or control flow changes.</li>
            </ol>
            <p className="mt-2">This cycle repeats continuously as the computer runs through a program's instructions.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Number Systems & Data Representation</CardTitle>
          </div>
          <CardDescription>How data is represented and processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Number Systems</h3>
            <p>Computers use different number systems to represent data:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><span className="font-medium">Binary (Base 2):</span> Uses only 0 and 1, fundamental to all computer operations.</li>
              <li><span className="font-medium">Decimal (Base 10):</span> Our standard number system using digits 0-9.</li>
              <li><span className="font-medium">Octal (Base 8):</span> Uses digits 0-7, useful for grouping binary digits.</li>
              <li><span className="font-medium">Hexadecimal (Base 16):</span> Uses digits 0-9 and letters A-F, commonly used to represent binary data concisely.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-1">Signed Number Representations</h3>
            <p>Computers represent negative numbers using several methods:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><span className="font-medium">Sign-Magnitude:</span> The leftmost bit represents the sign (0 for positive, 1 for negative).</li>
              <li><span className="font-medium">One's Complement:</span> To negate a number, flip all its bits.</li>
              <li><span className="font-medium">Two's Complement:</span> The most common method; flip all bits and add 1 to negate a number.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            <CardTitle>Processor Architecture</CardTitle>
          </div>
          <CardDescription>Structure and operation of the processor</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The processor architecture defines how the CPU functions and executes instructions. Modern processors use complex designs to maximize performance.</p>
          <p className="mt-2">Key concepts include pipelining (executing different parts of multiple instructions simultaneously), superscalar execution, and branch prediction.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Timing & Control</CardTitle>
          </div>
          <CardDescription>Coordination of computer operations</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The control unit orchestrates all computer operations according to precise timing. It generates control signals that activate components at the right moment.</p>
          <p className="mt-2">Modern computers use sophisticated control techniques including hardwired control (using fixed logic circuits) and microprogramming (using a sequence of microinstructions).</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle>Memory Organization</CardTitle>
          </div>
          <CardDescription>Storage hierarchy and organization</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Computer memory is organized in a hierarchy based on speed, cost, and capacity:</p>
          <ol className="list-decimal pl-6 space-y-1 mt-2">
            <li><span className="font-medium">Registers:</span> Fastest, smallest, most expensive - located in the CPU.</li>
            <li><span className="font-medium">Cache:</span> Very fast SRAM memory that stores frequently used data.</li>
            <li><span className="font-medium">Main Memory (RAM):</span> Moderate speed and cost, larger capacity.</li>
            <li><span className="font-medium">Secondary Storage:</span> Slow but inexpensive and non-volatile (hard drives, SSDs).</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComputerArchitectureNotes;
