import React, { useState } from 'react';
import SimulatorWizard from './components/SimulatorWizard';

function App() {
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);

  const handleStartSimulation = () => {
    setIsSimulationStarted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Simulateur de retraite 3ème pilier</h1>
          <p className="text-sm opacity-80">
            Planifiez votre avenir financier avec notre outil de simulation
          </p>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        {!isSimulationStarted ? (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-6">
            <h2 className="text-xl font-semibold mb-4">Bienvenue dans le simulateur</h2>
            <p className="mb-4">
              Cette application vous permet de simuler votre épargne pour la retraite avec le 3ème pilier suisse.
            </p>
            <p className="mb-4">
              Suivez les étapes pour obtenir une projection personnalisée de votre situation financière à la retraite.
            </p>
            <div className="mt-6">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleStartSimulation}
              >
                Démarrer la simulation
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <SimulatorWizard />
          </div>
        )}
      </main>
      
      <footer className="py-6 border-t bg-gray-200">
        <div className="container mx-auto text-center text-sm text-gray-600 px-4">
          <p>© {new Date().getFullYear()} Simulateur de retraite 3ème pilier - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 