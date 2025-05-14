
import React, { useState } from 'react';
import { BookOpen, User } from 'lucide-react';
import NotesUploader from '@/components/notes/NotesUploader';
import NotesList from '@/components/notes/NotesList';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

const Notes = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 animate-[scale-in_0.5s_ease-out]">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 hover:from-pink-500 hover:via-purple-600 hover:to-indigo-600 transition-all duration-500">Computer Architecture Notes</span>
            </h1>
            <p className="text-muted-foreground mt-1 animate-[fade-in_0.8s_ease-out]">
              Browse, search and download educational materials for your Computer Organization and Architecture studies
            </p>
          </div>
          <div className="animate-[scale-in_0.7s_ease-out]">
            <NotesUploader />
          </div>
        </div>
        
        {!activeTab.includes("my-notes") && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-100 dark:border-purple-900/50 rounded-lg p-6 my-4 animate-[fade-in_1s_ease-out] shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">Welcome to Decode COA Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className={cn(
                "bg-white dark:bg-slate-900 p-4 rounded-md shadow-sm transform transition-all duration-300",
                "hover:shadow-md hover:-translate-y-1 border-l-4 border-purple-400 animate-[fade-in_0.5s_ease-out]"
              )}>
                <h3 className="font-medium mb-1 text-purple-600">What is Computer Architecture?</h3>
                <p className="text-muted-foreground">Computer architecture is the design of computers, including instruction sets, hardware, and software.</p>
              </div>
              <div className={cn(
                "bg-white dark:bg-slate-900 p-4 rounded-md shadow-sm transform transition-all duration-300",
                "hover:shadow-md hover:-translate-y-1 border-l-4 border-indigo-400 animate-[fade-in_0.8s_ease-out]"
              )}>
                <h3 className="font-medium mb-1 text-indigo-600">Why Study COA?</h3>
                <p className="text-muted-foreground">Understanding COA helps with efficient programming, system design, and performance optimization.</p>
              </div>
              <div className={cn(
                "bg-white dark:bg-slate-900 p-4 rounded-md shadow-sm transform transition-all duration-300",
                "hover:shadow-md hover:-translate-y-1 border-l-4 border-blue-400 animate-[fade-in_1.1s_ease-out]"
              )}>
                <h3 className="font-medium mb-1 text-blue-600">How to Use This Platform</h3>
                <p className="text-muted-foreground">Browse notes, search for topics, upload and share your own study materials with others.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isAuthenticated && (
        <Tabs 
          defaultValue="all"
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full animate-[fade-in_1.3s_ease-out]"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="transition-all duration-300">All Notes</TabsTrigger>
            <TabsTrigger value="my-notes" className="flex items-center gap-1 transition-all duration-300">
              <User className="h-4 w-4" />
              My Uploads
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <NotesList 
              filterByUserId={null}
            />
          </TabsContent>
          <TabsContent value="my-notes" className="mt-0">
            <NotesList 
              filterByUserId={user?.id}
            />
          </TabsContent>
        </Tabs>
      )}
      
      {!isAuthenticated && (
        <div className="animate-[fade-in_1.3s_ease-out]">
          <NotesList 
            filterByUserId={null}
          />
        </div>
      )}
    </div>
  );
};

export default Notes;
