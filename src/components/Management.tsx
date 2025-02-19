import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatabaseService } from '../services/DatabaseService';

const Management = () => {
  const [newCategory, setNewCategory] = useState('');
  const [newWord, setNewWord] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [words, setWords] = useState<Array<{ id: number; word: string }>>([]);
  const [dbService, setDbService] = useState<DatabaseService | null>(null);

  useEffect(() => {
    const initDb = async () => {
      const service = await DatabaseService.getInstance();
      setDbService(service);
      loadCategories(service);
    };
    initDb();
  }, []);

  const loadCategories = (service: DatabaseService) => {
    const cats = service.getCategories();
    setCategories(cats);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !dbService) return;

    try {
      await dbService.addCategory(newCategory);
      setNewCategory('');
      loadCategories(dbService);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
    }
  };

  const handleAddWord = async () => {
    if (!newWord.trim() || !selectedCategory || !dbService) return;

    try {
      await dbService.addWord(newWord, parseInt(selectedCategory));
      setNewWord('');
      const words = dbService.getWordsByCategory(parseInt(selectedCategory));
      setWords(words);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du mot:', error);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="category">Nouvelle Catégorie</Label>
                <Input
                  id="category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nom de la catégorie"
                />
              </div>
              <Button onClick={handleAddCategory}>Ajouter</Button>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Catégories existantes :</h3>
              <ul className="list-disc pl-5 space-y-1">
                {categories.map((category) => (
                  <li key={category.id}>{category.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Mots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sélectionner une catégorie</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
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

            {selectedCategory && (
              <div className="space-y-4">
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="word">Nouveau Mot</Label>
                    <Input
                      id="word"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      placeholder="Mot à ajouter"
                    />
                  </div>
                  <Button onClick={handleAddWord}>Ajouter</Button>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Mots dans cette catégorie :</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {words.map((word) => (
                      <li key={word.id}>{word.word}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Management;