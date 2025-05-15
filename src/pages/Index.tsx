
import React from 'react';
import { useManga } from '../context/MangaContext';
import MangaGrid from '../components/MangaGrid';
import SectionHeader from '../components/SectionHeader';

const Index: React.FC = () => {
  const { recentlyUpdated, currentlyReading } = useManga();
  
  return (
    <div className="page-container animate-fade-in">
      <section className="mb-10">
        <SectionHeader 
          title="Bem-vindo ao MangaTrack" 
          subtitle="Acompanhe e organize suas leituras"
        />
        
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Lendo Atualmente</h2>
          <MangaGrid 
            mangas={currentlyReading.slice(0, 6)} 
            emptyMessage="Adicione mangás à sua lista de leitura" 
            className="mb-10"
          />
          
          <h2 className="text-2xl font-bold mb-4">Atualizados Recentemente</h2>
          <MangaGrid 
            mangas={recentlyUpdated} 
            emptyMessage="Nenhuma atualização recente" 
            className="mb-10"
          />
        </div>
      </section>
    </div>
  );
};

export default Index;
