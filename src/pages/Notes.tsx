import React, { useState } from 'react';
import { BookOpen, User, Upload, Search, Star, TrendingUp, Users } from 'lucide-react';
import NotesUploader from '@/components/notes/NotesUploader';
import NotesList from '@/components/notes/NotesList';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

const Notes = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 lg:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-32 -translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3 animate-[scale-in_0.5s_ease-out]">
                  <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
                    Computer Architecture
                    <span className="block text-2xl lg:text-4xl font-medium opacity-90">Notes Hub</span>
                  </h1>
                </div>
                <p className="text-lg lg:text-xl text-white/90 max-w-2xl animate-[fade-in_0.8s_ease-out]">
                  Your comprehensive resource for Computer Organization and Architecture studies. 
                  Browse, search, and share educational materials with fellow students.
                </p>
                
                {/* Stats */}
                {/* <div className="flex flex-wrap gap-6 pt-4 animate-[fade-in_1s_ease-out]">
                  <div className="flex items-center gap-2 text-white/80">
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-medium">1,200+ Students</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-sm font-medium">500+ Notes</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm font-medium">95% Success Rate</span>
                  </div>
                </div> */}
              </div>
              
              <div className="animate-[scale-in_0.7s_ease-out] w-full lg:w-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <NotesUploader />
                </div>
              </div>
            </div>
          </div>
        </div>

        
        
        {/* Navigation Tabs */}
        {isAuthenticated && (
          <div className="animate-[fade-in_1.3s_ease-out]">
            <Tabs 
              defaultValue="all"
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center mb-8">
                <TabsList className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-1 rounded-2xl shadow-lg">
                  <TabsTrigger 
                    value="all" 
                    className={cn(
                      "px-6 py-3 rounded-xl font-medium transition-all duration-300",
                      "data-[state=active]:bg-white data-[state=active]:shadow-md",
                      "data-[state=active]:text-slate-900 text-slate-600 dark:text-slate-400",
                      "hover:text-slate-800 dark:hover:text-slate-200"
                    )}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    All Notes
                  </TabsTrigger>
                  <TabsTrigger 
                    value="my-notes" 
                    className={cn(
                      "px-6 py-3 rounded-xl font-medium transition-all duration-300",
                      "data-[state=active]:bg-white data-[state=active]:shadow-md",
                      "data-[state=active]:text-slate-900 text-slate-600 dark:text-slate-400",
                      "hover:text-slate-800 dark:hover:text-slate-200"
                    )}
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Uploads
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
                  <NotesList filterByUserId={null} />
                </div>
              </TabsContent>
              
              <TabsContent value="my-notes" className="mt-0">
                <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                      <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Your Contributions</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Notes you've shared with the community</p>
                    </div>
                  </div>
                  <NotesList filterByUserId={user?.id} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Non-authenticated view */}
        {!isAuthenticated && (
          <div className="animate-[fade-in_1.3s_ease-out]">
            <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Explore All Notes</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Browse our comprehensive collection of study materials</p>
                </div>
              </div>
              <NotesList filterByUserId={null} />
            </div>
          </div>
        )}
        {/* Welcome Cards - Only show when not viewing personal notes */}
        {!activeTab.includes("my-notes") && (
          <div className="animate-[fade-in_1s_ease-out]">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 text-slate-800 dark:text-slate-200">
              Why Choose Our Platform?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className={cn(
                "group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/50 p-6 lg:p-8",
                "shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2",
                "border border-purple-100 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-700",
                "animate-[fade-in_0.5s_ease-out]"
              )}>
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 -translate-y-10 translate-x-10"></div>
                <div className="relative z-10">
                  <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-300">What is Computer Architecture?</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Computer architecture encompasses the design of computers, including instruction sets, 
                    hardware components, and software interfaces that work together seamlessly.
                  </p>
                </div>
              </div>

              <div className={cn(
                "group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/50 p-6 lg:p-8",
                "shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2",
                "border border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700",
                "animate-[fade-in_0.8s_ease-out]"
              )}>
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400/20 to-blue-400/20 -translate-y-10 translate-x-10"></div>
                <div className="relative z-10">
                  <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-indigo-700 dark:text-indigo-300">Why Study COA?</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Master efficient programming, system design, and performance optimization. 
                    Essential knowledge for software engineers and computer scientists.
                  </p>
                </div>
              </div>

              <div className={cn(
                "group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/50 p-6 lg:p-8",
                "shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2",
                "border border-blue-100 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700",
                "animate-[fade-in_1.1s_ease-out] md:col-span-2 lg:col-span-1"
              )}>
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 -translate-y-10 translate-x-10"></div>
                <div className="relative z-10">
                  <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-300">How to Use This Platform</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Browse curated notes, search for specific topics, upload your study materials, 
                    and collaborate with a community of learners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;