import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../lib/ui/button';
import { SimulationData } from '../SimulatorWizard';
import { formatCurrency } from '../../lib/utils';

// Définition du schéma de validation
const incomeAndSavingsSchema = z.object({
  annualIncome: z.number()
    .min(0, { message: "Le revenu ne peut pas être négatif" })
    .max(1000000, { message: "Le revenu maximum est de 1'000'000 CHF" }),
  currentSavings3a: z.number()
    .min(0, { message: "L'épargne ne peut pas être négative" }),
  currentSavings3b: z.number()
    .min(0, { message: "L'épargne ne peut pas être négative" }),
  monthlyContribution3a: z.number()
    .min(0, { message: "La contribution ne peut pas être négative" })
    .max(7056, { message: "La cotisation maximum 3a est de 7'056 CHF par an (588 CHF par mois)" }),
  monthlyContribution3b: z.number()
    .min(0, { message: "La contribution ne peut pas être négative" }),
});

type IncomeAndSavingsFormProps = {
  data: SimulationData;
  onUpdate: (data: Partial<SimulationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
};

const IncomeAndSavingsForm: React.FC<IncomeAndSavingsFormProps> = ({ 
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
    watch
  } = useForm<z.infer<typeof incomeAndSavingsSchema>>({
    resolver: zodResolver(incomeAndSavingsSchema),
    defaultValues: {
      annualIncome: data.annualIncome,
      currentSavings3a: data.currentSavings3a,
      currentSavings3b: data.currentSavings3b,
      monthlyContribution3a: data.monthlyContribution3a,
      monthlyContribution3b: data.monthlyContribution3b,
    },
  });

  // Surveiller les valeurs du formulaire pour les calculs
  const annualIncome = watch('annualIncome');
  const monthlyContribution3a = watch('monthlyContribution3a');
  const monthlyContribution3b = watch('monthlyContribution3b');

  // Calculer les totaux
  const totalMonthlyContribution = monthlyContribution3a + monthlyContribution3b;
  const totalYearlyContribution = totalMonthlyContribution * 12;
  const savingsRatio = annualIncome > 0 ? (totalYearlyContribution / annualIncome) * 100 : 0;

  // Soumission du formulaire
  const onSubmit = (formData: z.infer<typeof incomeAndSavingsSchema>) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Revenus et épargne actuelle</h2>
        <p className="text-muted-foreground">
          Entrez vos informations financières pour établir votre situation actuelle.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Revenu annuel */}
        <div className="space-y-2">
          <label htmlFor="annualIncome" className="block text-sm font-medium text-foreground">
            Revenu annuel brut (CHF)
          </label>
          <input
            id="annualIncome"
            type="number"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('annualIncome', { valueAsNumber: true })}
          />
          {errors.annualIncome && (
            <p className="text-sm text-destructive mt-1">{errors.annualIncome.message}</p>
          )}
        </div>

        {/* Épargne actuelle */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 3e pilier A */}
          <div className="space-y-2">
            <label htmlFor="currentSavings3a" className="block text-sm font-medium text-foreground">
              Épargne actuelle 3e pilier A (CHF)
            </label>
            <input
              id="currentSavings3a"
              type="number"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register('currentSavings3a', { valueAsNumber: true })}
            />
            {errors.currentSavings3a && (
              <p className="text-sm text-destructive mt-1">{errors.currentSavings3a.message}</p>
            )}
          </div>

          {/* 3e pilier B */}
          <div className="space-y-2">
            <label htmlFor="currentSavings3b" className="block text-sm font-medium text-foreground">
              Épargne actuelle 3e pilier B (CHF)
            </label>
            <input
              id="currentSavings3b"
              type="number"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register('currentSavings3b', { valueAsNumber: true })}
            />
            {errors.currentSavings3b && (
              <p className="text-sm text-destructive mt-1">{errors.currentSavings3b.message}</p>
            )}
          </div>
        </div>

        {/* Contributions mensuelles */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 3e pilier A */}
          <div className="space-y-2">
            <label htmlFor="monthlyContribution3a" className="block text-sm font-medium text-foreground">
              Contribution mensuelle 3e pilier A (CHF)
            </label>
            <input
              id="monthlyContribution3a"
              type="number"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register('monthlyContribution3a', { valueAsNumber: true })}
            />
            {errors.monthlyContribution3a && (
              <p className="text-sm text-destructive mt-1">{errors.monthlyContribution3a.message}</p>
            )}
          </div>

          {/* 3e pilier B */}
          <div className="space-y-2">
            <label htmlFor="monthlyContribution3b" className="block text-sm font-medium text-foreground">
              Contribution mensuelle 3e pilier B (CHF)
            </label>
            <input
              id="monthlyContribution3b"
              type="number"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register('monthlyContribution3b', { valueAsNumber: true })}
            />
            {errors.monthlyContribution3b && (
              <p className="text-sm text-destructive mt-1">{errors.monthlyContribution3b.message}</p>
            )}
          </div>
        </div>

        {/* Résumé des contributions */}
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">Résumé de votre épargne</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Contribution mensuelle totale:</span>
              <span className="font-medium">{formatCurrency(totalMonthlyContribution)}</span>
            </div>
            <div className="flex justify-between">
              <span>Contribution annuelle totale:</span>
              <span className="font-medium">{formatCurrency(totalYearlyContribution)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pourcentage du revenu:</span>
              <span className="font-medium">{savingsRatio.toFixed(1)}%</span>
            </div>
          </div>
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
            Continuer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default IncomeAndSavingsForm; 