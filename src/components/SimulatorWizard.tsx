import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../lib/ui/tabs';
import { Progress } from '../lib/ui/progress';
import PersonalInfoForm from './steps/PersonalInfoForm';
import IncomeAndSavingsForm from './steps/IncomeAndSavingsForm';
import RetirementGoalsForm from './steps/RetirementGoalsForm';
import ProjectionParamsForm from './steps/ProjectionParamsForm';
import SimulationResults from './steps/SimulationResults';

// Définition des étapes du workflow
const STEPS = [
  { id: "personal-info", title: "Informations personnelles" },
  { id: "income-savings", title: "Revenus et épargne" },
  { id: "retirement-goals", title: "Objectifs de retraite" },
  { id: "projection-params", title: "Paramètres de projection" },
  { id: "results", title: "Résultats" }
];

// Type pour les données de simulation
export type SimulationData = {
  // Informations personnelles
  age: number;
  retirementAge: number;
  gender: 'male' | 'female';
  
  // Revenus et épargne
  annualIncome: number;
  monthlyContribution: number;
  
  // Objectifs de retraite
  targetRetirementIncome: number;
  targetLifestyle: 'basic' | 'moderate' | 'comfortable' | 'luxury';
  
  // Paramètres de projection
  expectedReturns: number;
};

// Valeurs par défaut pour la simulation
const DEFAULT_SIMULATION_DATA: SimulationData = {
  age: 30,
  retirementAge: 65,
  gender: 'male',
  annualIncome: 80000,
  monthlyContribution: 750,
  targetRetirementIncome: 5000,
  targetLifestyle: 'moderate',
  expectedReturns: 3.5,
};

const SimulatorWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>(STEPS[0].id);
  const [simulationData, setSimulationData] = useState<SimulationData>(DEFAULT_SIMULATION_DATA);
  
  // Calculer l'index de l'étape courante
  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep);
  
  // Calculer le pourcentage de progression
  const progressPercentage = ((currentStepIndex + 1) / STEPS.length) * 100;
  
  // Fonction pour naviguer à l'étape suivante
  const goToNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };
  
  // Fonction pour naviguer à l'étape précédente
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };
  
  // Fonction pour mettre à jour les données de simulation
  const updateSimulationData = (data: Partial<SimulationData>) => {
    setSimulationData(prev => ({ ...prev, ...data }));
  };
  
  return (
    <div className="flex flex-col">
      {/* Barre de progression */}
      <div className="px-6 pt-6 pb-2">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Étape {currentStepIndex + 1} sur {STEPS.length}</span>
          <span>{STEPS[currentStepIndex].title}</span>
        </div>
      </div>
      
      {/* Contenu du simulateur */}
      <Tabs value={currentStep} className="flex-1">
        <TabsList className="hidden">
          {STEPS.map(step => (
            <TabsTrigger key={step.id} value={step.id}>
              {step.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="personal-info" className="m-0">
          <PersonalInfoForm 
            data={simulationData} 
            onUpdate={updateSimulationData}
            onNext={goToNextStep}
          />
        </TabsContent>
        
        <TabsContent value="income-savings" className="m-0">
          <IncomeAndSavingsForm 
            data={simulationData} 
            onUpdate={updateSimulationData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        </TabsContent>
        
        <TabsContent value="retirement-goals" className="m-0">
          <RetirementGoalsForm 
            data={simulationData} 
            onUpdate={updateSimulationData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        </TabsContent>
        
        <TabsContent value="projection-params" className="m-0">
          <ProjectionParamsForm 
            data={simulationData} 
            onUpdate={updateSimulationData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        </TabsContent>
        
        <TabsContent value="results" className="m-0">
          <SimulationResults 
            data={simulationData}
            onPrevious={goToPreviousStep}
            onNext={goToNextStep}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimulatorWizard; 