import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Game {
  id: string;
  title: string;
  image: string;
  isFavorite: boolean;
  fileName?: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGameTitle, setNewGameTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [games, setGames] = useState<Game[]>([
    {
      id: '1',
      title: 'Cyberpunk Warriors',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
      isFavorite: false,
    },
    {
      id: '2',
      title: 'Neon Racers',
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800',
      isFavorite: true,
    },
    {
      id: '3',
      title: 'Space Odyssey',
      image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800',
      isFavorite: false,
    },
    {
      id: '4',
      title: 'Digital Legends',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      isFavorite: false,
    },
  ]);

  const toggleFavorite = (id: string) => {
    setGames(games.map(game => 
      game.id === id ? { ...game, isFavorite: !game.isFavorite } : game
    ));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!newGameTitle) {
        setNewGameTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleAddGame = () => {
    if (!selectedFile || !newGameTitle.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Выберите файл и введите название игры',
        variant: 'destructive',
      });
      return;
    }

    const newGame: Game = {
      id: Date.now().toString(),
      title: newGameTitle,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
      isFavorite: false,
      fileName: selectedFile.name,
    };

    setGames([newGame, ...games]);
    toast({
      title: 'Игра добавлена!',
      description: `${newGameTitle} добавлена в библиотеку`,
    });

    setIsDialogOpen(false);
    setNewGameTitle('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePlayGame = (game: Game) => {
    toast({
      title: '🎮 Запуск игры',
      description: `Запускаем ${game.title}${game.fileName ? ` (${game.fileName})` : ''}...`,
    });
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || game.isFavorite;
    return matchesSearch && matchesFavorites;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <div className="container mx-auto px-6 py-8">
        <header className="mb-12">
          <h1 className="text-6xl font-bold mb-2 neon-glow text-primary">
            GAME LAUNCHER
          </h1>
          <p className="text-muted-foreground text-lg">Твоя библиотека игр</p>
        </header>

        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="relative flex-1 min-w-[300px]">
            <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Поиск игр..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card border-primary/20 focus:border-primary text-foreground"
            />
          </div>
          <Button 
            size="lg"
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={showFavoritesOnly ? "bg-accent hover:bg-accent/90 text-accent-foreground gap-2" : "border-primary/20 hover:bg-card gap-2"}
          >
            <Icon name="Heart" size={20} className={showFavoritesOnly ? "fill-current" : ""} />
            Избранное
          </Button>
          <Button 
            size="lg" 
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 neon-border gap-2"
          >
            <Icon name="Plus" size={20} />
            Добавить игру
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <Card 
              key={game.id} 
              className="bg-card border-border overflow-hidden game-card-hover group"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <button
                  onClick={() => toggleFavorite(game.id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all"
                >
                  <Icon 
                    name={game.isFavorite ? "Heart" : "Heart"} 
                    size={20}
                    className={game.isFavorite ? "text-accent fill-accent" : "text-white"}
                  />
                </button>

                {game.isFavorite && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    Избранное
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-3 text-foreground">{game.title}</h3>
                <Button 
                  onClick={() => handlePlayGame(game)}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold gap-2"
                >
                  <Icon name="Play" size={18} />
                  Играть
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <Icon name="Gamepad2" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-xl">Игры не найдены</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Добавить новую игру</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Выберите исполняемый файл игры и введите название
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="game-file" className="text-foreground mb-2 block">
                Файл игры
              </Label>
              <Input
                id="game-file"
                ref={fileInputRef}
                type="file"
                accept=".exe,.app,.sh,.bat"
                onChange={handleFileSelect}
                className="bg-background border-primary/20 text-foreground"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Выбран: {selectedFile.name}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="game-title" className="text-foreground mb-2 block">
                Название игры
              </Label>
              <Input
                id="game-title"
                placeholder="Введите название..."
                value={newGameTitle}
                onChange={(e) => setNewGameTitle(e.target.value)}
                className="bg-background border-primary/20 text-foreground"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddGame}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 border-primary/20"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;