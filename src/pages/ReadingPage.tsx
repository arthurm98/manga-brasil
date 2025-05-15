
import React from 'react';
import { useManga } from '../context/MangaContext';
import CollectionPage from '../components/CollectionPage';

const ReadingPage: React.FC = () => {
  const { currentlyReading } = useManga();

  return (
    <CollectionPage
      title="Lendo Atualmente"
      subtitle={`Você está lendo ${currentlyReading.length} mangás`}
      mangas={currentlyReading}
      emptyMessage="Você não está lendo nenhum mangá no momento"
    />
  );
};

export default ReadingPage;
