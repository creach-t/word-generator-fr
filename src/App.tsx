import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Generator from '@/components/Generator';
import Management from '@/components/Management';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Générateur de Mots</h1>
      
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Générateur</TabsTrigger>
          <TabsTrigger value="management">Gestion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="mt-6">
          <Generator />
        </TabsContent>
        
        <TabsContent value="management" className="mt-6">
          <Management />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;