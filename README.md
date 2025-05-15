
# MangaTrack - Rastreador de Mangás

<div align="left">
  <h3>Acompanhe e organize sua coleção de mangás, manhwas e webtoons</h3>
</div>

## 📖 Visão Geral

O **MangaTrack** é uma aplicação web moderna para gerenciar, acompanhar e descobrir mangás, manhwas e webtoons. Focada em experiência do usuário, flexibilidade e robustez, foi criada para quem deseja controle total da coleção, estatísticas detalhadas e integração com múltiplas APIs.

---

## 🚩 Funcionalidades Principais

- ✅ **Catalogação Completa**: Organize todos os seus títulos favoritos em um só lugar
- 📚 **Acompanhamento de Progresso**: Registre seu progresso de leitura por capítulos
- 🏷️ **Edição de Tipo/Tag**: Altere facilmente o tipo de cada obra (Mangá, Manhwa, Webtoon) a qualquer momento
- 🔄 **Fallback Automático de APIs**: Busca online inteligente, alternando entre Kitsu, Jikan, MangaDex e AniList para garantir resultados mesmo se uma API estiver fora do ar
- ⭐ **Favoritos e Avaliações**: Marque favoritos e avalie cada título
- 🔍 **Busca Avançada**: Pesquise por nome, autor, gênero ou descrição, tanto localmente quanto online
- 📊 **Estatísticas Detalhadas**: Visualize gráficos de progresso, gêneros, tipos e status
- 💾 **Coleção 100% Local**: Seus dados ficam apenas no navegador, com persistência via LocalStorage
- 🌑 **Dark Mode**: Interface responsiva e com suporte a tema escuro

---

## 🏷️ Edição de Tipo/Tag

- **Onde**: Na tela de detalhes de cada mangá, há um seletor para alterar o tipo (Mangá, Manhwa, Webtoon).
- **Como funciona**: A alteração é instantânea, persistida localmente e reflete imediatamente na interface.
- **Motivo**: Permite organizar e filtrar a coleção por tipo, além de influenciar a escolha da melhor API para busca de dados.

---

## 🔄 Fallback Automático de APIs

- **Lógica**: O MangaTrack utiliza a função utilitária `getBestApiForType` para determinar a ordem ideal de APIs conforme o tipo do título.
- **Fluxo**:
  1. O usuário busca um título ou atualiza dados.
  2. O sistema tenta a API mais indicada para o tipo (ex: MangaDex para Webtoon, Kitsu para Mangá).
  3. Se não houver resultado, faz fallback para as próximas APIs na ordem.
  4. Sempre retorna o melhor dado disponível.
- **APIs suportadas**:
  - [Kitsu](https://kitsu.docs.apiary.io/)
  - [Jikan](https://docs.api.jikan.moe/)
  - [MangaDex](https://api.mangadex.org/docs/)
  - [AniList](https://docs.anilist.co/)

---

## 🚀 Tecnologias Utilizadas

O MangaTrack foi construído com um conjunto moderno de tecnologias para garantir performance, segurança e uma excelente experiência de usuário:

### Front-end
- **Vite**: Build tool extremamente rápida para desenvolvimento eficiente
- **TypeScript**: Linguagem tipada para maior segurança e manutenibilidade
- **React 18**: Biblioteca para construção de interfaces modernas e reativas
- **React Router 6**: Sistema de roteamento para aplicações SPA
- **Tailwind CSS**: Framework CSS utilitário para estilização flexível
- **shadcn/ui**: Componentes de interface reutilizáveis e acessíveis
- **Recharts**: Biblioteca para criação de visualizações e gráficos interativos
- **Lucide React**: Conjunto de ícones modernos e minimalistas

### Gerenciamento de Estado e Dados
- **React Context API**: Gerenciamento de estado global da aplicação
- **Zod**: Validação de dados com esquemas tipados
- **LocalStorage**: Persistência local dos dados do usuário, sem sincronização em nuvem

### Back-end e Armazenamento

- **API RESTful**: Integração com diversas APIs externas para dados de mangá

---

## 🏗️ Arquitetura do Projeto

O MangaTrack segue princípios de **Clean Architecture** e **Separation of Concerns**, promovendo organização, testabilidade e facilidade de manutenção.

```
mangatrack/
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── ui/          # Componentes básicos de interface (shadcn)
│   │   ├── stats/       # Componentes para estatísticas
│   ├── context/         # Contextos React para estado global
│   ├── data/            # Dados estáticos e mocks
│   ├── hooks/           # Custom hooks reutilizáveis

│   ├── lib/             # Funções utilitárias, helpers e lógica de fallback de API
│   ├── pages/           # Páginas principais (rotas)
│   ├── services/        # Serviços de comunicação com APIs externas
│   └── types/           # Tipos e contratos TypeScript
├── public/              # Arquivos estáticos
```

### Padrões e Diretrizes
- **DRY**: Evite duplicidade de código. Use funções utilitárias e hooks.
- **Eliminação de Dead Code**: Remova funções, imports e estados não utilizados.
- **Funções Concisas**: Cada função deve ter responsabilidade única e ser curta.
- **Nomenclatura Clara**: Nomes explicativos e consistentes para variáveis, funções e arquivos.
- **Componentização**: Separe UI, lógica e serviços. Use barrel exports (`index.ts`) para simplificar imports.
- **Tratamento de Erros**: Sempre trate e logue erros, fornecendo feedback amigável ao usuário.
- **Documentação**: Comente funções públicas e explique o "porquê" das decisões.

---

## 🧑‍💻 Exemplos de Uso

### Edição de Tipo/Tag
```tsx
// Na tela de detalhes:
<Select value={manga.type} onValueChange={handleTypeChange}>
  <SelectTrigger className="w-[120px]">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="manga">Mangá</SelectItem>
    <SelectItem value="manhwa">Manhwa</SelectItem>
    <SelectItem value="webtoon">Webtoon</SelectItem>
  </SelectContent>
</Select>
```

### Fallback Automático de API
```ts
import { getBestApiForType } from '@/lib/apiUtils';
const apis = getBestApiForType(manga.type);
for (const api of apis) {
  // tente buscar dados nesta API
}
```

---

## 🏆 Checklist de Contribuição

- [ ] Não há código duplicado
- [ ] Não há código morto/sem uso
- [ ] Funções são concisas e bem nomeadas
- [ ] Imports organizados e necessários
- [ ] UI responsiva e acessível
- [ ] Testes para novas funcionalidades
- [ ] Cobertura de erros e feedback para o usuário
- [ ] Documentação clara de funções, hooks e serviços
- [ ] Padrão ESLint/Prettier seguido

---

- **API Fallbacks**: Sistema de fallbacks para APIs para garantir disponibilidade
- **Typed Data Contracts**: Contratos de dados tipados em toda a aplicação

## 📊 Funcionalidades de Estatísticas

O MangaTrack oferece visualizações detalhadas sobre sua coleção:

- **Resumo da Coleção**: Visão geral com contagem total, capítulos lidos e avaliações
- **Status da Coleção**: Gráficos mostrando distribuição por status de leitura
- **Top Gêneros**: Visualização dos gêneros mais frequentes em sua coleção
- **Distribuição por Tipo**: Gráfico de pizza mostrando proporção entre mangás, manhwas e webtoons
- **Análise Detalhada**: Estatísticas avançadas com porcentagens e métricas

## 🔍 Sistema de Busca

O MangaTrack possui um sistema de busca completo com três modos:

1. **Busca na Coleção**: Pesquise dentro dos mangás que você já adicionou
2. **Busca Online**: Encontre novos mangás usando APIs externas (Kitsu, Jikan)
3. **Títulos Populares**: Descubra os mangás mais populares segundo as APIs

## 💾 Persistência de Dados

Os dados são armazenados de duas formas:

- **Local**: Para desenvolvimento e uso offline




## 🔄 Integração com APIs

O MangaTrack integra-se com diversas APIs para fornecer dados abrangentes:

- **[Kitsu](https://kitsu.docs.apiary.io/)**: API primária para busca de mangás
- **[Jikan](https://docs.api.jikan.moe/)**: API alternativa (fallback) e para mangás populares
- **[MangaDex](https://api.mangadex.org/docs/)**: Suporte adicional para dados específicos
- **[AniList](https://docs.anilist.co/)**: Integração planejada
- **[MyAnimeList](https://myanimelist.net/apiconfig/)**: Integração planejada

## 📱 Compatibilidade

O MangaTrack é uma aplicação web responsiva otimizada para:

- 💻 **Desktop**: Chrome, Firefox, Safari, Edge (últimas 2 versões)
- 📱 **Mobile**: Android e iOS (navegadores móveis modernos)
- 🔄 **PWA**: Suporte planejado para instalação como aplicativo

## 🚀 Como Executar
### Executando Localmente

Se você deseja trabalhar localmente usando sua própria IDE, siga estas etapas:

```sh
# Passo 1: Clone o repositório
git clone <URL_DO_REPOSITÓRIO>

# Passo 2: Navegue até o diretório do projeto
cd mangatrack

# Passo 3: Instale as dependências
npm install

# Passo 4: Inicie o servidor de desenvolvimento
npm run dev
```

## 👥 Contribuições

Contribuições são bem-vindas! Para contribuir com o MangaTrack:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Envie para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Diretrizes de Código

- Siga o padrão ESLint/Prettier do projeto
- Escreva testes para novas funcionalidades
- Documente componentes e funções públicas
- Mantenha a compatibilidade com os navegadores suportados

## 🚀 Como Executar Localmente

1. **Clone o repositório:**
   ```sh
   git clone <URL_DO_REPOSITORIO>
   cd mangatrack
   ```
2. **Instale as dependências:**
   ```sh
   npm install
   ```
4. **Inicie o servidor de desenvolvimento:**
   ```sh
   npm run dev
   ```

---

## 👥 Contribuição

Contribuições são bem-vindas! Para colaborar:
1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Faça commit das suas mudanças
4. Envie para o seu fork (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

Siga o checklist de contribuição acima para manter a qualidade do projeto.

---

## 📜 Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

- **Criador**: ArthurM98

---

<div align="center">
  <p>Feito com ❤️ para amantes de mangás</p>
</div>
