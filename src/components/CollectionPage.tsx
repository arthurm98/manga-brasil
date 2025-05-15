
import React from 'react';
import { UserManga } from '../types/manga';
import MangaGrid from './MangaGrid';
import SectionHeader from './SectionHeader';

interface CollectionPageProps {
  title: string;
  subtitle: string;
  mangas: UserManga[];
  emptyMessage: string;
}

const CollectionPage: React.FC<CollectionPageProps> = ({
  title,
  subtitle,
  mangas,
  emptyMessage
}) => {
  return (
    <div className="page-container animate-fade-in">
      <SectionHeader 
        title={title} 
        subtitle={subtitle}
      />
      
      <MangaGrid 
        mangas={mangas} 
        emptyMessage={emptyMessage} 
      />
    </div>
  );
};

export default CollectionPage;
