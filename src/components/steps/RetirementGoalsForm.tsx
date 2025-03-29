import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../lib/ui/button';
import { SimulationData } from '../SimulatorWizard';
import { formatCurrency } from '../../lib/utils';

// Définition du schéma de validation
const retirementGoalsSchema = z.object({
  targetRetirementIncome: z.number()
    .min(1000, { message: "Le revenu mensuel visé doit être d'au moins 1'000 CHF" })
    .max(50000, { message: "Le revenu mensuel visé ne peut pas dépasser 50'000 CHF" }),
  targetLifestyle: z.enum(['basic', 'moderate', 'comfortable', 'luxury'], {
    required_error: "Veuillez sélectionner un style de vie visé",
  }),
});

// Définition des modes de vie
const lifestyleOptions = [
  { value: 'basic', label: 'Basique', description: 'Couvre les besoins essentiels sans extra' },
  { value: 'moderate', label: 'Modéré', description: 'Mode de vie confortable avec quelques loisirs' },
  { value: 'comfortable', label: 'Confortable', description: 'Confort complet avec voyages et activités régulières' },
  { value: 'luxury', label: 'Luxueux', description: 'Style de vie privilégié sans restrictions financières' },
];

type RetirementGoalsFormProps = {
  data: SimulationData;
  onUpdate: (data: Partial<SimulationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
};

const RetirementGoalsForm: React.FC<RetirementGoalsFormProps> = ({ 
  data, 
  onUpdate, 
  onNext,
  onPrevious
}) => {
  // Initialisation du formulaire avec React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    watch
  } = useForm<z.infer<typeof retirementGoalsSchema>>({
    resolver: zodResolver(retirementGoalsSchema),
    defaultValues: {
      targetRetirementIncome: data.targetRetirementIncome,
      targetLifestyle: data.targetLifestyle,
    },
  });

  // Surveiller les valeurs du formulaire
  const targetLifestyle = watch('targetLifestyle');
  const targetRetirementIncome = watch('targetRetirementIncome');

  // Calculer les recommandations basées sur le revenu actuel
  const recommendedIncome = data.annualIncome * 0.7 / 12;
  
  // Déterminer les recommandations basées sur le style de vie
  const lifestyleIncomeMap = {
    'basic': data.annualIncome * 0.5 / 12, // 50% du revenu actuel
    'moderate': data.annualIncome * 0.7 / 12, // 70% du revenu actuel
    'comfortable': data.annualIncome * 0.85 / 12, // 85% du revenu actuel
    'luxury': data.annualIncome * 1.0 / 12, // 100% du revenu actuel
  };

  // Gérer la sélection du style de vie
  const handleLifestyleSelect = (lifestyle: 'basic' | 'moderate' | 'comfortable' | 'luxury') => {
    setValue('targetLifestyle', lifestyle);
    setValue('targetRetirementIncome', lifestyleIncomeMap[lifestyle]);
  };

  // Soumission du formulaire
  const onSubmit = (formData: z.infer<typeof retirementGoalsSchema>) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Objectifs de retraite</h2>
        <p className="text-muted-foreground">
          Définissez le style de vie et le revenu que vous souhaitez avoir à la retraite.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Style de vie visé */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            Style de vie souhaité à la retraite
          </label>
          
          <div className="grid gap-4 md:grid-cols-2">
            {lifestyleOptions.map((option) => (
              <div 
                key={option.value}
                className={`
                  p-4 rounded-md border cursor-pointer transition-colors
                  ${targetLifestyle === option.value 
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:border-primary/50'}
                `}
                onClick={() => handleLifestyleSelect(option.value as any)}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`lifestyle-${option.value}`}
                    value={option.value}
                    className="h-4 w-4"
                    checked={targetLifestyle === option.value}
                    {...register('targetLifestyle')}
                    onChange={() => handleLifestyleSelect(option.value as any)}
                  />
                  <label htmlFor={`lifestyle-${option.value}`} className="font-medium">
                    {option.label}
                  </label>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {option.description}
                </p>
                <p className="text-sm font-medium mt-2">
                  ~{formatCurrency(lifestyleIncomeMap[option.value as keyof typeof lifestyleIncomeMap])}/mois
                </p>
              </div>
            ))}
          </div>
          
          {errors.targetLifestyle && (
            <p className="text-sm text-destructive mt-1">{errors.targetLifestyle.message}</p>
          )}
        </div>

        {/* Revenu cible */}
        <div className="space-y-2">
          <label htmlFor="targetRetirementIncome" className="block text-sm font-medium text-foreground">
            Revenu mensuel souhaité à la retraite (CHF)
          </label>
          <input
            id="targetRetirementIncome"
            type="number"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('targetRetirementIncome', { valueAsNumber: true })}
          />
          {errors.targetRetirementIncome && (
            <p className="text-sm text-destructive mt-1">{errors.targetRetirementIncome.message}</p>
          )}
          
          <div className="text-sm text-muted-foreground mt-2">
            <p>Revenu mensuel recommandé: {formatCurrency(recommendedIncome)}</p>
            <p className="mt-1">Revenu annuel actuel: {formatCurrency(data.annualIncome)}</p>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevious}
          >
            Retour
          </Button>
          <Button type="submit">
            Continuer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RetirementGoalsForm; 