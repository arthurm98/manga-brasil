
import React, { useState, useEffect } from 'react';
import { UserManga } from '../types/manga';
import { useManga } from '../context/MangaContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChapterProgressProps {
  manga: UserManga;
  className?: string;
}

const ChapterProgress: React.FC<ChapterProgressProps> = ({ manga, className }) => {
  const { updateReadChapter } = useManga();
  const [inputChapter, setInputChapter] = useState<number>(manga.lastReadChapter);
  const [inputError, setInputError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  
  const totalChapters = manga.totalChapters || 0;
  const progressPercentage = totalChapters > 0 
    ? Math.round((manga.lastReadChapter / totalChapters) * 100)
    : 0;

  useEffect(() => {
    // Reset state when manga changes
    setInputChapter(manga.lastReadChapter);
    setInputError(null);
  }, [manga.lastReadChapter, manga.id]);

  const validateInput = (value: number): boolean => {
    if (isNaN(value) || value < 0) {
      setInputError("O número do capítulo deve ser um valor positivo");
      return false;
    }
    
    if (totalChapters && value > totalChapters) {
      setInputError(`O número do capítulo não pode exceder o total de ${totalChapters} capítulos`);
      return false;
    }
    
    setInputError(null);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setInputChapter(isNaN(value) ? 0 : value);
    if (value !== manga.lastReadChapter) {
      validateInput(value);
    } else {
      setInputError(null);
    }
  };

  const handleUpdate = async () => {
    if (!validateInput(inputChapter)) {
      return;
    }
    
    try {
      setIsUpdating(true);
      updateReadChapter(manga.id, inputChapter);
      toast.success("Progresso atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar capítulo:", error);
      toast.error("Erro ao atualizar o progresso. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkNext = () => {
    const nextChapter = manga.lastReadChapter + 1;
    
    if (!validateInput(nextChapter)) {
      return;
    }
    
    try {
      setIsUpdating(true);
      updateReadChapter(manga.id, nextChapter);
      setInputChapter(nextChapter);
      toast.success(`Capítulo ${nextChapter} marcado como lido!`);
    } catch (error) {
      console.error("Erro ao marcar próximo capítulo:", error);
      toast.error("Erro ao atualizar o progresso. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={className}>
      {inputError && (
        <Alert className="mb-3">
          <AlertDescription>{inputError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row items-center justify-between mb-2">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Input
            type="number"
            min="0"
            max={totalChapters || undefined}
            value={inputChapter}
            onChange={handleInputChange}
            className="w-20"
            aria-label="Número do capítulo"
          />
          <span className="text-muted-foreground">
            {totalChapters ? `/ ${totalChapters}` : ''}
          </span>
          <Button 
            onClick={handleUpdate} 
            size="sm" 
            variant="outline"
            disabled={isUpdating || inputChapter === manga.lastReadChapter}
          >
            Atualizar
          </Button>
        </div>
        
        <Button 
          onClick={handleMarkNext} 
          variant="default" 
          className="bg-manga hover:bg-manga-dark"
          disabled={isUpdating || (totalChapters && manga.lastReadChapter >= totalChapters)}
        >
          Marcar Próximo Capítulo
        </Button>
      </div>
      
      <div className="space-y-1">
        <Progress value={progressPercentage} className="h-2" />
        <p className="text-sm text-right text-muted-foreground">{progressPercentage}% completo</p>
      </div>
    </div>
  );
};

export default ChapterProgress;
