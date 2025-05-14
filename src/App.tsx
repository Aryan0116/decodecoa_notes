
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Notes from "./pages/Notes";
import BookmarkedNotes from "./pages/BookmarkedNotes";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Notes />} />
              <Route path="notes" element={<Notes />} />
              <Route path="bookmarks" element={<BookmarkedNotes />} />
            </Route>
            <Route path="/auth" element={
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header />
                <main className="flex-1 animate-fade-in">
                  <Auth />
                </main>
              </div>
            }>
              <Route path="login" element={<Auth />} />
              <Route path="register" element={<Auth />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
