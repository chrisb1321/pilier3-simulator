import React from 'react';
import { Button } from '../../lib/ui/button';
import { SimulationData } from '../SimulatorWizard';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

    let projectionData = [];
    let totalSavings = 0;

    for (let year = 0; year <= yearsUntilRetirement; year++) {
      // Ajouter les contributions de l'année
      if (year > 0) {
        totalSavings += annualContribution;
        // Appliquer les rendements
        totalSavings *= (1 + expectedReturns);
      }
      
      projectionData.push({
        age: data.age + year,
        savings: Math.round(totalSavings)
      });
    }

    return projectionData;
  };

  const projectionData = calculateProjection(data);
  const finalAmount = projectionData[projectionData.length - 1].savings;

  const formattedTotal = new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0
  }).format(finalAmount);

  const monthlyTotal = data.monthlyContribution;
  const formattedMonthly = new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0
  }).format(monthlyTotal);

  // Configuration du graphique
  const chartData = {
    labels: projectionData.map(d => d.age),
    datasets: [
      {
        label: 'Capital projeté',
        data: projectionData.map(d => d.savings),
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = new Intl.NumberFormat('fr-CH', {
              style: 'currency',
              currency: 'CHF',
              maximumFractionDigits: 0
            }).format(context.raw);
            return `Capital: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            return new Intl.NumberFormat('fr-CH', {
              style: 'currency',
              currency: 'CHF',
              maximumFractionDigits: 0
            }).format(value);
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Âge',
        },
      },
    },
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
          <h3 className="text-2xl font-semibold mb-4">Capital final</h3>
          <p className="text-4xl font-bold text-primary mb-2">{formattedTotal}</p>
          <p className="text-sm text-muted-foreground">
            À l'âge de {data.retirementAge} ans
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
          <h3 className="text-2xl font-semibold mb-4">Contribution mensuelle</h3>
          <p className="text-4xl font-bold text-primary mb-2">{formattedMonthly}</p>
          <p className="text-sm text-muted-foreground">
            Épargne mensuelle totale
          </p>
        </div>
      </div>

      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
        <h3 className="text-2xl font-semibold mb-4">Évolution du capital</h3>
        <div className="h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Paramètres utilisés</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Âge actuel : {data.age} ans</li>
          <li>Âge de retraite : {data.retirementAge} ans</li>
          <li>Rendement attendu : {data.expectedReturns}%</li>
        </ul>
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