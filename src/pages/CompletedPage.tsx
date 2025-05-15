
import React from 'react';
import { useManga } from '../context/MangaContext';
import CollectionPage from '../components/CollectionPage';

const CompletedPage: React.FC = () => {
  const { completed } = useManga();

  return (
    <CollectionPage
      title="Mangás Completos"
      subtitle={`Você completou a leitura de ${completed.length} mangás`}
      mangas={completed}
      emptyMessage="Você não completou nenhum mangá ainda"
    />
  );
};

export default CompletedPage;
