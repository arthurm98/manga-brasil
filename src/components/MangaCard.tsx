
import React, { useState } from 'react';
import { UserManga } from '../types/manga';
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { calcularProgresso } from '@/lib/mangaUtils';
import { useManga } from '@/context/MangaContext';
import { Button } from '@/components/ui/button';

interface MangaCardProps {
  manga: UserManga;
  onDoubleClick?: () => void;
  className?: string;
  showProgress?: boolean;
  onAddToLibrary?: (() => void) | null;
  isInLibrary?: boolean;
}

import { toast } from "sonner";

const MangaCard: React.FC<MangaCardProps> = ({ manga, onDoubleClick, className, showProgress = true, onAddToLibrary = null, isInLibrary = true }) => {
  const { removeManga, updateSynopsis, updateCover } = useManga();
  const [editing, setEditing] = useState(false);
  const [synopsis, setSynopsis] = useState(manga.description || '');
  const [saving, setSaving] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const progressPercentage = calcularProgresso(manga.lastReadChapter, manga.totalChapters);
  const [showEditCover, setShowEditCover] = useState(false);
  const [editCoverUrl, setEditCoverUrl] = useState('');

  // Atualiza sinopse local quando manga.description mudar (após updateSynopsis)
  React.useEffect(() => {
    setSynopsis(manga.description || '');
  }, [manga.description]);
    
  const typeLabels = {
    manga: "Mangá",
    manhwa: "Manhwa",
    webtoon: "Webtoon"
  };
  
  const statusBadgeColor = {
    lendo: "bg-manga-dark",
    planejo_ler: "bg-blue-600",
    completo: "bg-green-600",
    abandonado: "bg-gray-500",
    
  };
  
  const statusLabel = {
    lendo: "Lendo",
    planejo_ler: "Planejo Ler",
    completo: "Completo",
    abandonado: "Abandonado",
    
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja remover este mangá da sua biblioteca?')) {
      removeManga(manga.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleSaveEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (synopsis.trim().length === 0) {
      toast.error('A sinopse não pode ser vazia.');
      return;
    }
    setSaving(true);
    try {
      await updateSynopsis(manga.id, synopsis.trim());
      toast.success('Sinopse atualizada com sucesso!');
      setEditing(false);
    } catch {
      toast.error('Erro ao atualizar sinopse.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSynopsis(manga.description || '');
    setEditing(false);
  };

  // Salvar nova URL da capa
  const handleSaveCover = async () => {
    if (!editCoverUrl.trim()) {
      toast.error('Informe uma URL válida para a capa.');
      return;
    }
    try {
      await updateCover(manga.id, editCoverUrl.trim());
      toast.success('Capa atualizada!');
      setShowEditCover(false);
    } catch {
      toast.error('Erro ao atualizar capa.');
    }
  };

  return (
    <Card 
      className={cn(
        "manga-card group cursor-pointer hover:scale-105", 
        className
      )} 
      onDoubleClick={onDoubleClick}
    >
      <div className="relative overflow-hidden">
        {!showEditCover ? (
  <img 
    src={manga.cover} 
    alt={manga.title}
    className="manga-image group-hover:scale-110"
    loading="lazy"
    onError={() => setShowEditCover(true)}
  />
) : (
  <div className="flex items-center justify-center bg-gray-900 text-white w-full h-[220px] min-h-[180px] max-h-[260px] text-center px-2">
    <span className="w-full text-base font-semibold line-clamp-3">{manga.title}</span>
  </div>
)}
{showEditCover && isInLibrary && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
            <label className="text-white text-xs mb-2">URL da nova capa:</label>
            <input
              type="text"
              className="rounded p-1 text-xs w-40 mb-2"
              value={editCoverUrl}
              onChange={e => setEditCoverUrl(e.target.value)}
              placeholder="Cole a URL da imagem..."
            />
            <div className="flex gap-2">
              <Button size="sm" variant="default" onClick={handleSaveCover}>Salvar</Button>
              <Button size="sm" variant="outline" onClick={() => setShowEditCover(false)}>Cancelar</Button>
            </div>
          </div>
        )}
        <Badge 
          className={`absolute top-2 left-2 ${statusBadgeColor[manga.readingStatus]}`}
        >
          {statusLabel[manga.readingStatus]}
        </Badge>
        <Badge 
          className="absolute top-2 right-2 bg-manga-dark opacity-90"
        >
          {typeLabels[manga.type]}
        </Badge>
        
        {showProgress && manga.totalChapters && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div 
              className="h-1 bg-manga-accent"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
          <p className="text-white text-sm font-medium truncate">
            Cap. {manga.lastReadChapter}{manga.totalChapters ? `/${manga.totalChapters}` : ''}
          </p>
        </div>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-semibold text-base truncate">{manga.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{manga.author}</p>
        {editing ? (
          <div className="my-2">
            <textarea
              ref={textareaRef}
              className="w-full border rounded p-2 text-xs resize-none focus:ring-2 focus:ring-manga-accent bg-card"
              value={synopsis}
              onChange={e => {
                if (e.target.value.length <= 400) setSynopsis(e.target.value);
              }}
              rows={4}
              maxLength={400}
              disabled={saving}
              placeholder="Digite uma sinopse curta (até 400 caracteres)"
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-muted-foreground">{synopsis.length}/400 caracteres</span>
              <div className="flex gap-2">
                <Button size="sm" variant="default" onClick={handleSaveEdit} disabled={saving}>Salvar</Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit} disabled={saving}>Cancelar</Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs mt-1 line-clamp-3 min-h-[2.5em]">{manga.description || <span className="italic text-muted-foreground">Sem sinopse cadastrada</span>}</p>
            {isInLibrary && (
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={handleEdit}>Editar</Button>
                <Button size="sm" variant="destructive" onClick={handleRemove}>Remover</Button>
              </div>
            )}
          </>
        )}
        {onAddToLibrary && !isInLibrary && (
          <button
            className="mt-2 w-full bg-manga-accent text-white py-1 px-2 rounded hover:bg-manga-accent/90 transition"
            onClick={e => {
              e.stopPropagation();
              onAddToLibrary();
            }}
          >
            Adicionar à Biblioteca
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default MangaCard;
