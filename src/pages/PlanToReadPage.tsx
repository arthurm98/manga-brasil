
import React from 'react';
import { useManga } from '../context/MangaContext';
import MangaGrid from '../components/MangaGrid';
import SectionHeader from '../components/SectionHeader';

const PlanToReadPage: React.FC = () => {
  const { planToRead } = useManga();

  return (
    <div className="page-container animate-fade-in">
      <SectionHeader 
        title="Planejo Ler" 
        subtitle={`Você tem ${planToRead.length} mangás na sua lista de leitura futura`}
      />
      
      <MangaGrid 
        mangas={planToRead} 
        emptyMessage="Você não tem mangás na lista para ler" 
      />
    </div>
  );
};

export default PlanToReadPage;
