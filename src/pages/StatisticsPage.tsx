
import React, { Suspense } from 'react';
import MangaStatistics from '../components/MangaStatistics';
import ErrorBoundary from '../components/ErrorBoundary';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const ErrorFallback = () => {
  const navigate = useNavigate();
  
  return (
    <Alert className="my-4">
      <AlertDescription className="flex flex-col gap-4">
        <p>Não foi possível carregar as estatísticas. Pode haver um problema com seus dados.</p>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/')}>Voltar para a página inicial</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Recarregar página
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

const LoadingFallback = () => (
  <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
    <Loader className="h-8 w-8 animate-spin text-manga" />
    <p className="text-muted-foreground">Carregando estatísticas...</p>
  </div>
);

const StatisticsPage: React.FC = () => {
  return (
    <div className="page-container animate-fade-in bg-black/90 rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-6">Estatísticas</h1>
      
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<LoadingFallback />}>
          <MangaStatistics />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default StatisticsPage;
