import React from 'react';
import { motion } from 'framer-motion';
import { User, Calculator, LineChart, Target } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  icon?: React.ReactNode;
}

const defaultIcons = [
  <User className="w-5 h-5" />,
  <Calculator className="w-5 h-5" />,
  <Target className="w-5 h-5" />,
  <LineChart className="w-5 h-5" />,
];

interface ProgressBarProps {
  currentStep: number;
  steps: Step[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-4">
      <div className="flex justify-between relative">
        {/* Ligne de progression */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted-foreground/20" />
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* Étapes */}
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex flex-col items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: index === currentStep ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {step.icon || defaultIcons[index]}
            </motion.div>
            <motion.p
              className={`mt-2 text-sm ${
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {step.title}
            </motion.p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar; 