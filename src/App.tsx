
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Editor from "./pages/Editor";
import NotFound from "./pages/NotFound";
import { setupStorageBucket } from "./services/supabaseService";

const queryClient = new QueryClient();

const App = () => {
  // Initialize Supabase storage when the app starts
  useEffect(() => {
    // Set up the Supabase storage bucket
    setupStorageBucket().catch(error => {
      console.error("Failed to set up storage bucket:", error);
      // This is a background setup task, so we don't want to block the app
      // if it fails. The app can still function without it, although
      // images might not be saved permanently.
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/editor" element={<Editor />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
