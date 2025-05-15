
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useManga } from '../context/MangaContext';
import ChapterProgress from '../components/ChapterProgress';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReadingStatus } from '../types/manga';
import { ArrowLeft, Star } from 'lucide-react';
import { toast } from "sonner";

const MangaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = window.location as any;
  // Inclui updateType do contexto
  const { getMangaById, updateReadingStatus, setRating, updateType } = useManga();

  // Buscar primeiro no state da navegação, depois na coleção local
  const manga = (location.state && location.state.manga) ? location.state.manga : getMangaById(id || '');

  if (!manga) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-2xl font-bold mb-4">Mangá não encontrado</h2>
        <Button onClick={() => navigate('/')}>Voltar para a página inicial</Button>
      </div>
    );
  }
  
  const typeLabels = {
    manga: "Mangá",
    manhwa: "Manhwa",
    webtoon: "Webtoon"
  };

  const typeOptions = [
    { value: 'manga', label: 'Mangá' },
    { value: 'manhwa', label: 'Manhwa' },
    { value: 'webtoon', label: 'Webtoon' }
  ];
  
  const statusLabels = {
    em_andamento: "Em andamento",
    completo: "Completo",
    hiato: "Hiato"
  };
  
  const readingStatusOptions: { value: ReadingStatus; label: string }[] = [
    { value: 'lendo', label: 'Lendo' },
    { value: 'planejo_ler', label: 'Planejo Ler' },
    { value: 'completo', label: 'Completo' },
    { value: 'abandonado', label: 'Abandonado' },
    
  ];
  
  const handleStatusChange = (newStatus: string) => {
    updateReadingStatus(manga.id, newStatus as ReadingStatus);
    toast.success(`Status atualizado para ${readingStatusOptions.find(s => s.value === newStatus)?.label}`);
  };

  /**
   * Manipula a alteração do tipo do mangá (manga, manhwa, webtoon)
   * Atualiza no contexto e exibe toast de confirmação.
   */
  const handleTypeChange = (newType: string) => {
    if (newType !== manga.type) {
      updateType(manga.id, newType as 'manga' | 'manhwa' | 'webtoon');
      toast.success(`Tipo atualizado para ${typeLabels[newType as keyof typeof typeLabels]}`);
    }
  };

  const handleSetRating = (rating: number) => {
    setRating(manga.id, rating);
    toast.success(`Avaliação atualizada para ${rating} estrelas`);
  };

  return (
    <div className="page-container animate-fade-in">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden border">
            <img 
              src={manga.cover} 
              alt={manga.title}
              className="w-full object-cover"
            />
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status da Leitura</label>
              <Select 
                value={manga.readingStatus} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  {readingStatusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Sua Avaliação</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button 
                    key={star}
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => handleSetRating(star)}
                  >
                    <Star 
                      className={`h-6 w-6 ${star <= (manga.rating || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} 
                    />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            {/* Seletor de tipo editável */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">Tipo:</label>
              <Select value={manga.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline">{statusLabels[manga.status]}</Badge>
            {manga.genres.map((genre) => (
              <Badge key={genre} variant="secondary">{genre}</Badge>
            ))}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{manga.title}</h1>
          <div className="text-sm text-muted-foreground mb-6">
            <p>
              <span className="font-semibold">Autor:</span> {manga.author}
              {manga.artist && manga.artist !== manga.author && ` (Arte: ${manga.artist})`}
            </p>
            <p>
              <span className="font-semibold">Publicado:</span> {manga.publishYear}
              {manga.publisher && ` por ${manga.publisher}`}
            </p>
            {manga.totalChapters && (
              <p><span className="font-semibold">Capítulos:</span> {manga.totalChapters}</p>
            )}
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Sinopse</h2>
            <p className="text-muted-foreground">{manga.description}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Seu Progresso</h2>
            <ChapterProgress manga={manga} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetail;
