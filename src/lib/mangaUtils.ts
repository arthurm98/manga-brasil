/**
 * Calcula o progresso de leitura de um mangá em porcentagem.
 * @param lastRead Número do último capítulo lido
 * @param totalChapters Total de capítulos do mangá
 * @returns Progresso em %
 */
export function calcularProgresso(lastRead: number, totalChapters: number): number {
  if (!totalChapters) return 0;
  return Math.round((lastRead / totalChapters) * 100);
}

/**
 * Valida se o capítulo informado é válido para o mangá.
 * @param input Número do capítulo
 * @param totalChapters Total de capítulos
 * @returns true se válido, false caso contrário
 */
export function validarCapitulo(input: number, totalChapters: number): boolean {
  return input > 0 && input <= totalChapters;
}

/**
 * Retorna o nome amigável do status de leitura.
 * @param status Status interno
 * @returns Label amigável
 */
export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    reading: 'Lendo',
    completed: 'Completo',
    planned: 'Planeja Ler',
    dropped: 'Abandonado',
    
  };
  return labels[status] || 'Desconhecido';
}
