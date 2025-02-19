import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Generator = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [generatedWord, setGeneratedWord] = useState<string>('');
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);

  const generateWord = async () => {
    if (!selectedCategory) return;
    
    try {
      // TODO: Implémenter la génération de mot avec SQLite
      setGeneratedWord('Mot généré');
    } catch (error) {
      console.error('Erreur lors de la génération du mot:', error);
      setGeneratedWord('Erreur lors de la génération');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Générateur de Mots</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label>Catégorie</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateWord} 
            disabled={!selectedCategory}
            className="w-full"
          >
            Générer un mot
          </Button>
          
          {generatedWord && (
            <div className="p-4 bg-secondary rounded-lg mt-4">
              <p className="text-2xl font-bold text-center">{generatedWord}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Generator;