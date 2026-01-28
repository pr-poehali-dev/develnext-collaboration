import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Game {
  id: string;
  title: string;
  image: string;
  isFavorite: boolean;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    </div>
  );
};

export default Index;
