import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PersonalInfoForm from './steps/PersonalInfoForm';
import IncomeAndSavingsForm from './steps/IncomeAndSavingsForm';
import ProjectionParamsForm from './steps/ProjectionParamsForm';
import SimulationResults from './steps/SimulationResults';
import ProgressBar from './ProgressBar';
import { TooltipProvider } from './ui/tooltip';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationData, setSimulationData] = useState<SimulationData>(DEFAULT_SIMULATION_DATA);

  const handleUpdate = (updates: Partial<SimulationData>) => {
    setSimulationData(prev => ({ ...prev, ...updates }));
  };

  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    const commonProps = {
      data: simulationData,
      onUpdate: handleUpdate,
      onNext: goToNextStep,
      onPrevious: goToPreviousStep,
    };

    switch (currentStep) {
      case 0:
        return <PersonalInfoForm {...commonProps} />;
      case 1:
        return <IncomeAndSavingsForm {...commonProps} />;
      case 2:
        return <ProjectionParamsForm {...commonProps} />;
      case 3:
        return <SimulationResults {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto p-4">
        <ProgressBar currentStep={currentStep} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default SimulatorWizard; 