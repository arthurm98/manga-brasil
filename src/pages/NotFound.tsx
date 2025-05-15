
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Tentativa de acesso a uma rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-6xl font-bold text-manga">404</h1>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Página não encontrada</AlertTitle>
          <AlertDescription>
            A página que você está procurando não existe ou foi movida.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Verifique se o endereço está correto ou retorne à página inicial.
          </p>
          <Button 
            variant="default" 
            className="bg-manga hover:bg-manga-dark" 
            onClick={() => window.location.href = '/'}
          >
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
