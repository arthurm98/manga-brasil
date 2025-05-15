
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MangaProvider } from "./context/MangaContext";
import ErrorBoundary from "./components/ErrorBoundary";

import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import MangaDetail from "./pages/MangaDetail";
import ReadingPage from "./pages/ReadingPage";
import PlanToReadPage from "./pages/PlanToReadPage";
import CompletedPage from "./pages/CompletedPage";

import StatisticsPage from "./pages/StatisticsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <MangaProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/manga/:id" element={
                    <ErrorBoundary>
                      <MangaDetail />
                    </ErrorBoundary>
                  } />
                  <Route path="/reading" element={<ReadingPage />} />
                  <Route path="/plan-to-read" element={<PlanToReadPage />} />
                  <Route path="/completed" element={<CompletedPage />} />
                  
                  <Route path="/statistics" element={<StatisticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </MangaProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
