/**
 * Centraliza variantes e mensagens padrão para feedback ao usuário
 */
export const toastVariants = {
  success: {
    variant: 'success',
    duration: 3000,
    description: 'Operação realizada com sucesso!'
  },
  error: {
    variant: 'error',
    duration: 4000,
    description: 'Ocorreu um erro. Tente novamente.'
  },
  info: {
    variant: 'info',
    duration: 2500,
    description: 'Ação informativa.'
  },
};

export function getToastMessage(type: keyof typeof toastVariants, customMsg?: string) {
  return {
    ...toastVariants[type],
    description: customMsg || toastVariants[type].description
  };
}
