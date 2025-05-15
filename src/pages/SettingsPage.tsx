
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useManga } from '@/context/MangaContext';

interface NotificationSettings {
  updates: boolean;
  reminders: boolean;
}

const getInitialNotificationSettings = (): NotificationSettings => {
  try {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { updates: false, reminders: false };
};

const SettingsPage: React.FC = () => {
  const { exportCollection, importCollection } = useManga();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notificationSettings, setNotificationSettings] = React.useState<NotificationSettings>(getInitialNotificationSettings);

  const handleSaveSettings = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const handleExport = () => {
    try {
      const json = exportCollection();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `manga-colecao-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Coleção exportada com sucesso!');
    } catch {
      toast.error('Erro ao exportar coleção.');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const ok = importCollection(text);
        if (ok) {
          toast.success('Coleção importada com sucesso!');
        } else {
          toast.error('Arquivo inválido ou formato incorreto.');
        }
      } catch {
        toast.error('Erro ao importar coleção.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="page-container animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Exibição</CardTitle>
            <CardDescription>Configure como você deseja ver seu conteúdo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mostrar progresso de leitura nos cards</Label>
                <p className="text-sm text-muted-foreground">
                  Exibe a barra de progresso nos cards de mangá
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mostrar estatísticas no dashboard</Label>
                <p className="text-sm text-muted-foreground">
                  Exibe estatísticas de leitura na página inicial
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure suas preferências de notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Atualizações de mangá</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações quando novos capítulos forem lançados
                </p>
              </div>
              <Switch
                checked={notificationSettings.updates}
                onCheckedChange={(checked) => {
                  setNotificationSettings((prev) => {
                    const updated = { ...prev, updates: checked };
                    localStorage.setItem('notificationSettings', JSON.stringify(updated));
                    toast.success(
                      checked
                        ? 'Notificações de atualizações ativadas!'
                        : 'Notificações de atualizações desativadas.'
                    );
                    return updated;
                  });
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lembretes de leitura</Label>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes para continuar a leitura de mangás em andamento
                </p>
              </div>
              <Switch
                checked={notificationSettings.reminders}
                onCheckedChange={(checked) => {
                  setNotificationSettings((prev) => {
                    const updated = { ...prev, reminders: checked };
                    localStorage.setItem('notificationSettings', JSON.stringify(updated));
                    toast.success(
                      checked
                        ? 'Lembretes de leitura ativados!'
                        : 'Lembretes de leitura desativados.'
                    );
                    return updated;
                  });
                }}
              />
            </div>
          </CardContent>
        </Card>
        

        <Card>
          <CardHeader>
            <CardTitle>Backup da Coleção</CardTitle>
            <CardDescription>Exporte ou importe sua coleção de mangás como arquivo JSON</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={handleExport} type="button">
                Exportar coleção (JSON)
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={handleImport}
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} type="button">
                Importar coleção (JSON)
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              A exportação gera um arquivo com todos os seus mangás salvos. A importação substitui sua coleção atual.
            </p>
          </CardContent>
        </Card>

        <Button className="bg-manga hover:bg-manga-dark w-full" onClick={handleSaveSettings}>
          Salvar configurações
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
