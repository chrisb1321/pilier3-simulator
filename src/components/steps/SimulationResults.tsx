import React, { useState } from 'react';
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
import { motion } from 'framer-motion';

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
  const [contactInfo, setContactInfo] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  // Calcul de l'économie fiscale
  const annualContribution = monthlyTotal * 12;
  const taxSavings = annualContribution * 0.25; // 25% d'économie d'impôt
  const formattedTaxSavings = new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    maximumFractionDigits: 0
  }).format(taxSavings);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const webhookData = {
      informationsPersonnelles: {
        ...contactInfo,
        age: data.age,
        ageRetraite: data.retirementAge,
      },
      resultatsSimulation: {
        capitalProjete: calculateProjection(data),
        contributionMensuelle: data.monthlyContribution,
        rendementAttendu: data.expectedReturns
      },
      metadata: {
        dateSimulation: new Date().toISOString(),
        source: 'simulateur-web',
        consentementRGPD: true
      }
    };

    try {
      const response = await fetch('https://hooks.zapier.com/hooks/catch/15007154/2c40qr9/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        onNext();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
        <h3 className="text-2xl font-semibold mb-4">Recevez vos offres 3ème piliers par mail</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium mb-1">Prénom</label>
              <input
                id="prenom"
                type="text"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={contactInfo.prenom}
                onChange={(e) => setContactInfo(prev => ({ ...prev, prenom: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium mb-1">Nom</label>
              <input
                id="nom"
                type="text"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={contactInfo.nom}
                onChange={(e) => setContactInfo(prev => ({ ...prev, nom: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateNaissance" className="block text-sm font-medium mb-1">Date de naissance</label>
              <input
                id="dateNaissance"
                type="date"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={contactInfo.dateNaissance}
                onChange={(e) => setContactInfo(prev => ({ ...prev, dateNaissance: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium mb-1">Téléphone</label>
              <input
                id="telephone"
                type="tel"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={contactInfo.telephone}
                onChange={(e) => setContactInfo(prev => ({ ...prev, telephone: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={contactInfo.email}
              onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              id="rgpd"
              required
              className="mt-1"
            />
            <label htmlFor="rgpd" className="ml-2 text-sm">
              J'accepte que mes données soient utilisées pour recevoir les résultats de ma simulation et être contacté à ce sujet.
            </label>
          </div>
          <div className="flex justify-between items-center">
            <Button type="button" onClick={onPrevious} variant="outline">
              Retour
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi en cours...' : 'Recevoir mes résultats'}
            </Button>
          </div>
        </form>
        {submitStatus === 'success' && (
          <p className="mt-4 text-green-600">Vos résultats ont été envoyés avec succès !</p>
        )}
        {submitStatus === 'error' && (
          <p className="mt-4 text-red-600">Une erreur est survenue. Veuillez réessayer.</p>
        )}
      </div>

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

        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
          <h3 className="text-2xl font-semibold mb-4">Économie fiscale annuelle</h3>
          <p className="text-4xl font-bold text-green-600 mb-2">{formattedTaxSavings}</p>
          <p className="text-sm text-muted-foreground">
            Basé sur un taux moyen de 25% d'économie d'impôt
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
          <h3 className="text-2xl font-semibold mb-4">Contribution annuelle</h3>
          <p className="text-4xl font-bold text-primary mb-2">{new Intl.NumberFormat('fr-CH', {
            style: 'currency',
            currency: 'CHF',
            maximumFractionDigits: 0
          }).format(annualContribution)}</p>
          <p className="text-sm text-muted-foreground">
            Montant total investi par année
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
    </div>
  );
};

export default SimulationResults; 