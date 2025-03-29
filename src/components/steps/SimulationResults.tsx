import React from 'react';
import { Button } from '../../lib/ui/button';
import { SimulationData } from '../SimulatorWizard';

interface SimulationResultsProps {
  data: SimulationData;
  onPrevious: () => void;
  onNext: () => void;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({
  data,
  onPrevious,
  onNext,
}) => {
  const calculateProjection = (data: SimulationData) => {
    const yearsUntilRetirement = data.retirementAge - data.age;
    const monthlyContribution = data.monthlyContribution;
    const annualContribution = monthlyContribution * 12;
    const expectedReturns = data.expectedReturns / 100;

    let totalSavings = 0;
    for (let year = 1; year <= yearsUntilRetirement; year++) {
      // Ajouter les contributions de l'année
      totalSavings += annualContribution;
      
      // Appliquer les rendements
      totalSavings *= (1 + expectedReturns);
    }

    return Math.round(totalSavings);
  };

  const totalProjection = calculateProjection(data);
  const formattedTotal = new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0
  }).format(totalProjection);

  const monthlyTotal = data.monthlyContribution;
  const formattedMonthly = new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0
  }).format(monthlyTotal);

  return (
    <div className="space-y-6">
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
        <h3 className="text-2xl font-semibold mb-4">Résultats de la simulation</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Capital projeté à la retraite</p>
            <p className="text-4xl font-bold">{formattedTotal}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Contribution mensuelle totale</p>
            <p className="text-2xl font-semibold">{formattedMonthly}</p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground">Paramètres utilisés :</p>
            <ul className="list-disc list-inside space-y-1 text-sm pl-4 mt-2">
              <li>Âge actuel : {data.age} ans</li>
              <li>Âge de retraite : {data.retirementAge} ans</li>
              <li>Rendement attendu : {data.expectedReturns}%</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          Retour
        </Button>
        <Button onClick={onNext}>
          Terminer
        </Button>
      </div>
    </div>
  );
};

export default SimulationResults; 