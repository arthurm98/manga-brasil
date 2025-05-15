import { render, screen } from '@testing-library/react';
import MangaCard from '../MangaCard';

describe('MangaCard', () => {
  const manga = {
    id: '1',
    title: 'Naruto',
    description: 'Ninja shounen',
    lastReadChapter: 10,
    totalChapters: 100,
    readingStatus: 'reading',
    type: 'manga',
  };

  it('exibe o título do mangá', () => {
    render(<MangaCard manga={manga} />);
    expect(screen.getByText('Naruto')).toBeInTheDocument();
  });

  it('exibe a descrição', () => {
    render(<MangaCard manga={manga} />);
    expect(screen.getByText('Ninja shounen')).toBeInTheDocument();
  });
});
