import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../lib/ui/button';
import { SimulationData } from '../SimulatorWizard';

type ProjectionParamsFormProps = {
  data: SimulationData;
  onUpdate: (data: Partial<SimulationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
};

// Définition des profils de placement
const INVESTMENT_PROFILES = {
  conservative: {
    name: "Conservateur",
    description: "Privilégie la sécurité avec des rendements stables mais modérés",
    returns: 2.0,
  },
  balanced: {
    name: "Équilibré",
    description: "Balance entre sécurité et performance",
    returns: 3.5,
  },
  dynamic: {
    name: "Dynamique",
    description: "Vise des rendements plus élevés avec plus de risques",
    returns: 5.0,
  },
};

const ProjectionParamsForm: React.FC<ProjectionParamsFormProps> = ({ 
  data, 
  onUpdate, 
  onNext,
  onPrevious
}) => {
  // État pour le profil sélectionné
  const [selectedProfile, setSelectedProfile] = React.useState('balanced');

  // Fonction pour appliquer un profil
  const applyProfile = (profileKey: keyof typeof INVESTMENT_PROFILES) => {
    const profile = INVESTMENT_PROFILES[profileKey];
    setSelectedProfile(profileKey);
    onUpdate({
      expectedReturns: profile.returns,
    });
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Profil d'investissement</h2>
        <p className="text-muted-foreground">
          Choisissez le profil qui correspond le mieux à votre stratégie d'investissement.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(INVESTMENT_PROFILES).map(([key, profile]) => (
            <div 
              key={key}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedProfile === key 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => applyProfile(key as keyof typeof INVESTMENT_PROFILES)}
            >
              <h3 className="font-semibold mb-2">{profile.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{profile.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Rendement attendu:</span>
                  <span className="font-medium">{profile.returns}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informations contextuelles */}
        <div className="bg-muted p-4 rounded-md text-sm">
          <h3 className="font-medium mb-2">À propos des profils d'investissement</h3>
          <p className="mb-2">
            Le choix de votre profil d'investissement détermine le potentiel de rendement et le niveau de risque de votre stratégie.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Profil conservateur : Adapté si vous privilégiez la sécurité</li>
            <li>Profil équilibré : Recommandé pour la plupart des épargnants</li>
            <li>Profil dynamique : Pour ceux qui acceptent plus de risques</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevious}
          >
            Retour
          </Button>
          <Button type="submit">
            Voir les résultats
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectionParamsForm; 