import React, { useEffect, useState } from 'react';
import { Button } from '../../lib/ui/button';
import { SimulationData } from '../SimulatorWizard';
import { formatCurrency } from '../../lib/utils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Enregistrement des composants Chart.js
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title,
  Filler
);

type SimulationResultsProps = {
  data: SimulationData;
  onRestart: () => void;
  onPrevious: () => void;
};

interface ProjectionResult {
  age: number;
  year: number;
  pillar3a: number;
  pillar3b: number;
  totalCapital: number;
  // Après la retraite
  withdrawals?: number;
  remainingCapital?: number;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ 
  data,
  onRestart,
  onPrevious
}) => {
  const [projectionResults, setProjectionResults] = useState<ProjectionResult[]>([]);
  const [capitalAtRetirement, setCapitalAtRetirement] = useState<number>(0);
  const [monthlyIncomeAtRetirement, setMonthlyIncomeAtRetirement] = useState<number>(0);
  const [retirementDuration, setRetirementDuration] = useState<number>(0);
  const [capitalGap, setCapitalGap] = useState<number>(0);

  // Calcul de la simulation
  useEffect(() => {
    // Résultats de la projection
    const results: ProjectionResult[] = [];
    
    // Calcul du nombre d'années jusqu'à la retraite
    const yearsToRetirement = data.retirementAge - data.age;
    
    // Calcul du nombre d'années de retraite
    const retirementYears = data.lifeExpectancy - data.retirementAge;
    setRetirementDuration(retirementYears);
    
    // Épargne initiale
    let currentPillar3a = data.currentSavings3a;
    let currentPillar3b = data.currentSavings3b;
    
    // Calcul de l'épargne jusqu'à la retraite
    for (let year = 0; year <= yearsToRetirement; year++) {
      const currentAge = data.age + year;
      const currentYear = new Date().getFullYear() + year;
      
      // Ajouter les contributions annuelles (12 mois)
      if (year > 0) {
        currentPillar3a += data.monthlyContribution3a * 12;
        currentPillar3b += data.monthlyContribution3b * 12;
        
        // Ajouter les rendements
        currentPillar3a *= (1 + data.expectedReturns3a / 100);
        currentPillar3b *= (1 + data.expectedReturns3b / 100);
      }
      
      // Calculer le capital total
      const totalCapital = currentPillar3a + currentPillar3b;
      
      // Ajouter les résultats pour cette année
      results.push({
        age: currentAge,
        year: currentYear,
        pillar3a: currentPillar3a,
        pillar3b: currentPillar3b,
        totalCapital: totalCapital,
      });
    }
    
    // Sauvegarder le capital à la retraite
    const capitalAtRetirementValue = results[results.length - 1].totalCapital;
    setCapitalAtRetirement(capitalAtRetirementValue);
    
    // Calculer le revenu mensuel estimé à la retraite
    // Utilisation d'une formule simple: capital / (nombre d'années de retraite * 12) * facteur de sécurité
    const safetyFactor = 0.85; // 85% pour tenir compte de l'inflation et autres risques
    const estimatedMonthlyIncome = (capitalAtRetirementValue / (retirementYears * 12)) * safetyFactor;
    setMonthlyIncomeAtRetirement(estimatedMonthlyIncome);

    // Calculer l'écart entre le revenu souhaité et le revenu estimé
    const gap = data.targetRetirementIncome - estimatedMonthlyIncome;
    setCapitalGap(gap);
    
    // Simulation de la phase de retraite (décaissement)
    let remainingCapital = capitalAtRetirementValue;
    const monthlyWithdrawal = data.targetRetirementIncome;
    const annualWithdrawal = monthlyWithdrawal * 12;
    
    // Pour chaque année de retraite
    for (let year = 1; year <= retirementYears; year++) {
      const currentAge = data.retirementAge + year;
      const currentYear = new Date().getFullYear() + yearsToRetirement + year;
      
      // Diminuer le capital avec les retraits
      remainingCapital -= annualWithdrawal;
      
      // Ajouter du rendement sur le capital restant (moyenne des deux rendements)
      const avgReturn = (data.expectedReturns3a + data.expectedReturns3b) / 2;
      remainingCapital *= (1 + avgReturn / 100);
      
      // Ajuster pour l'inflation
      const inflationAdjustedCapital = remainingCapital / Math.pow(1 + data.inflationRate / 100, year);
      
      // Ajouter les résultats pour cette année
      results.push({
        age: currentAge,
        year: currentYear,
        pillar3a: 0, // Après la retraite, nous ne distinguons plus les piliers
        pillar3b: 0,
        totalCapital: 0,
        withdrawals: annualWithdrawal,
        remainingCapital: Math.max(0, inflationAdjustedCapital), // Ne pas descendre en dessous de 0
      });
    }
    
    setProjectionResults(results);
  }, [data]);

  // Préparation des données pour le graphique circulaire
  const doughnutData = {
    labels: ['3e pilier A', '3e pilier B'],
    datasets: [
      {
        data: [
          projectionResults.length > 0 ? projectionResults[projectionResults.findIndex(r => r.age === data.retirementAge)].pillar3a : 0,
          projectionResults.length > 0 ? projectionResults[projectionResults.findIndex(r => r.age === data.retirementAge)].pillar3b : 0,
        ],
        backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)'],
        borderWidth: 1,
      },
    ],
  };

  // Préparation des données pour le graphique d'évolution du capital
  const lineData = {
    labels: projectionResults.map(r => r.age),
    datasets: [
      {
        label: 'Capital total',
        data: projectionResults.map(r => r.totalCapital || r.remainingCapital || 0),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Résultats de la simulation</h2>
        <p className="text-muted-foreground">
          Voici la projection de votre épargne retraite basée sur vos informations.
        </p>
      </div>

      {/* Résumé de la situation */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <h3 className="font-medium mb-4">Capital estimé à la retraite</h3>
          <div className="text-3xl font-bold text-primary mb-2">
            {formatCurrency(capitalAtRetirement)}
          </div>
          <p className="text-sm text-muted-foreground">
            À l'âge de {data.retirementAge} ans en {new Date().getFullYear() + (data.retirementAge - data.age)}
          </p>
          
          <div className="mt-4">
            <Doughnut 
              data={doughnutData}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
                cutout: '60%',
              }}
            />
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <h3 className="font-medium mb-4">Revenu mensuel estimé</h3>
          <div className="text-3xl font-bold mb-2 flex items-baseline">
            {formatCurrency(monthlyIncomeAtRetirement)}
            <span className="text-sm text-muted-foreground ml-2">/mois</span>
          </div>
          
          <div className="mt-2 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>Revenu souhaité:</span>
              <span className="font-medium">{formatCurrency(data.targetRetirementIncome)}/mois</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Écart:</span>
              <span 
                className={`font-medium ${capitalGap > 0 ? 'text-destructive' : 'text-green-600'}`}
              >
                {capitalGap > 0 ? '-' : '+'}{formatCurrency(Math.abs(capitalGap))}/mois
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span>Durée de retraite estimée:</span>
              <span className="font-medium">{retirementDuration} ans</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 rounded-md bg-muted">
            <p className="text-sm">
              {capitalGap > 0 
                ? `Pour atteindre votre objectif, envisagez d'augmenter votre contribution mensuelle de ${formatCurrency(capitalGap)}.`
                : `Votre plan d'épargne actuel devrait vous permettre d'atteindre votre objectif de revenu à la retraite.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Graphique d'évolution du capital */}
      <div className="bg-card rounded-lg border p-4 shadow-sm mb-8">
        <h3 className="font-medium mb-4">Évolution projetée du capital</h3>
        <div className="h-64">
          <Line 
            data={lineData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value: number | string): string => formatCurrency(Number(value)),
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: (context: { parsed: { y: number } }): string => `Capital: ${formatCurrency(context.parsed.y)}`,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Recommandations */}
      <div className="bg-muted p-4 rounded-md mb-8">
        <h3 className="font-medium mb-2">Recommandations</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            {capitalGap > 0 
              ? "Augmentez vos contributions mensuelles pour combler l'écart avec votre objectif."
              : "Votre plan est bien équilibré. Continuez sur cette voie pour maintenir votre objectif."
            }
          </li>
          <li>
            Diversifiez vos placements entre le 3e pilier A (avantages fiscaux) et le 3e pilier B (rendements potentiellement plus élevés).
          </li>
          <li>
            Réévaluez régulièrement votre stratégie en fonction de l'évolution de votre situation personnelle et du marché.
          </li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
        >
          Modifier les paramètres
        </Button>
        <Button 
          type="button"
          onClick={onRestart}
        >
          Recommencer la simulation
        </Button>
      </div>
    </div>
  );
};

export default SimulationResults; 