import React from 'react';
import { Button } from '../../lib/ui/button';
import { SimulationData } from '../SimulatorWizard';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { Info } from 'lucide-react';

interface IncomeAndSavingsFormProps {
  data: SimulationData;
  onUpdate: (updates: Partial<SimulationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const IncomeAndSavingsForm: React.FC<IncomeAndSavingsFormProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="annualIncome" className="block text-sm font-medium text-foreground">
              Revenu annuel brut (CHF)
            </label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Votre revenu annuel avant impôts et déductions</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <input
            id="annualIncome"
            type="number"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={data.annualIncome}
            onChange={(e) => onUpdate({ annualIncome: Number(e.target.value) })}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="monthlyContribution" className="block text-sm font-medium text-foreground">
              Contribution mensuelle au 3ème pilier (CHF)
            </label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Montant total que vous souhaitez épargner chaque mois pour votre retraite</p>
                <p className="mt-1">Maximum déductible 3a : CHF 588/mois (7'056/an)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <input
            id="monthlyContribution"
            type="number"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={data.monthlyContribution}
            onChange={(e) => onUpdate({ monthlyContribution: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Informations importantes</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Le montant maximum déductible pour le pilier 3a est de CHF 7'056 par an (2024)</li>
          <li>Il n'y a pas de limite pour le pilier 3b, mais il n'offre pas d'avantages fiscaux</li>
          <li>Une épargne régulière est la clé d'une retraite confortable</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          Retour
        </Button>
        <Button onClick={onNext}>
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default IncomeAndSavingsForm; 