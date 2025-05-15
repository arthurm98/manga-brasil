
import React from 'react';
import StatCard from './stats/StatCard';
import StatusBarChart from './stats/StatusBarChart';
import TopGenres from './stats/TopGenres';
import MangaTypes from './stats/MangaTypes';
import CollectionSummary from './stats/CollectionSummary';
import { useUserStatistics } from '@/hooks/useUserStatistics';
import { Loader, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center gap-4 bg-black/80 rounded-lg border border-gray-800 shadow-sm">
      <AlertCircle className="h-16 w-16 text-muted-foreground mb-2" />
      <h3 className="text-xl font-semibold">Sem dados disponíveis</h3>
      <p className="text-muted-foreground mb-4">
        Você ainda não tem mangás em sua coleção. Adicione alguns mangás para ver estatísticas detalhadas.
      </p>
      <Button variant="default" asChild>
        <a href="/search">Explorar Mangás</a>
      </Button>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
    <Loader className="h-8 w-8 animate-spin text-manga" />
    <p className="text-muted-foreground">Carregando estatísticas...</p>
  </div>
);

const ErrorState = () => {
  const { toast } = useToast();
  
  const handleRetry = () => {
    window.location.reload();
    toast({
      title: "Recarregando dados",
      description: "Tentando buscar suas estatísticas novamente"
    });
  };
  
  return (
    <Alert className="my-4">
      <AlertDescription className="flex flex-col gap-4">
        <p>Não foi possível carregar suas estatísticas. Pode haver um problema com os dados ou com sua conexão.</p>
        <Button onClick={handleRetry}>Tentar novamente</Button>
      </AlertDescription>
    </Alert>
  );
};

const MangaStatistics: React.FC = () => {
  const { data, loading, error } = useUserStatistics();
  
  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!data || data.totalMangas === 0) return <EmptyState />;
  
  // Dados para gráficos e seções
  const chartData = [
    
    { name: 'Lendo', value: data.readingCount, color: '#8B5CF6' },
    { name: 'Planejo Ler', value: data.planToReadCount, color: '#0EA5E9' },
    { name: 'Completos', value: data.completedCount, color: '#10B981' },
  ];

  // Status em porcentagem
  const totalMangas = data.totalMangas;
  const statusPercentage = {
    reading: Math.round((data.readingCount / totalMangas) * 100) || 0,
    planned: Math.round((data.planToReadCount / totalMangas) * 100) || 0,
    completed: Math.round((data.completedCount / totalMangas) * 100) || 0,
    
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Estatísticas da Coleção</h2>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
            <Loader className="mr-2 h-4 w-4" /> Atualizar Dados
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="resumo" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resumo" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total de Títulos" 
              value={data.totalMangas} 
              description="Mangás na sua coleção"
            />
            <StatCard 
              title="Capítulos Lidos" 
              value={data.totalChapters} 
            />
            <StatCard 
              title="Avaliação Média" 
              value={data.avgRating || 'N/A'} 
              description="De todos os títulos avaliados"
            />
            <StatCard 
              title="Títulos Completados" 
              value={`${statusPercentage.completed}%`} 
              description={`${data.completedCount} mangás completos`}
            />
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Status da Coleção</h3>
            <StatusBarChart chartData={chartData} />
          </div>
          
          <CollectionSummary 
            totalMangas={data.totalMangas}
            currentlyReading={data.readingCount}
            completed={data.completedCount}
            
            planToRead={data.planToReadCount}
            statusPercentage={statusPercentage}
            avgRating={data.avgRating}
          />
        </TabsContent>
        
        <TabsContent value="graficos" className="space-y-8">
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-4">Distribuição por Status</h3>
            <StatusBarChart chartData={chartData} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Top Gêneros</h3>
              <TopGenres genres={data.genres} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Por Tipo</h3>
              <MangaTypes types={data.types} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="detalhes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/80 p-6 rounded-lg border border-gray-800 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Detalhes da Coleção</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Mangás:</span>
                  <span className="font-medium">{data.totalMangas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lendo Atualmente:</span>
                  <span className="font-medium">{data.readingCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completos:</span>
                  <span className="font-medium">{data.completedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planejo Ler:</span>
                  <span className="font-medium">{data.planToReadCount}</span>
                </div>
                <div className="flex justify-between">
                  
                  
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Capítulos Lidos:</span>
                  <span className="font-medium">{data.totalChapters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avaliação Média:</span>
                  <span className="font-medium">{data.avgRating || 'N/A'}/5</span>
                </div>
              </div>
            </div>
            
            <div className="bg-black/80 p-6 rounded-lg border border-gray-800 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Distribuição por Tipo</h3>
              <MangaTypes types={data.types} />
              
              <h3 className="text-xl font-bold mt-6 mb-4">Proporção da Coleção</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Em Leitura:</span>
                  <span className="font-medium">{statusPercentage.reading}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completos:</span>
                  <span className="font-medium">{statusPercentage.completed}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planejados:</span>
                  <span className="font-medium">{statusPercentage.planned}%</span>
                </div>
                <div className="flex justify-between">
                  
                  
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MangaStatistics;
