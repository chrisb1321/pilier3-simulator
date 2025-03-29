import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../lib/ui/button';
import { SimulationData } from '../SimulatorWizard';

type ProjectionParamsFormProps = {
  data: SimulationData;
  onUpdate: (data: Partial<SimulationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
};

const ProjectionParamsForm: React.FC<ProjectionParamsFormProps> = ({ 
  data, 
  onUpdate, 
  onNext,
  onPrevious
}) => {
  // Définition du schéma de validation avec accès à data
  const projectionParamsSchema = z.object({
    expectedReturns3a: z.number()
      .min(0, { message: "Le rendement ne peut pas être négatif" })
      .max(10, { message: "Le rendement maximum est de 10%" }),
    expectedReturns3b: z.number()
      .min(0, { message: "Le rendement ne peut pas être négatif" })
      .max(15, { message: "Le rendement maximum est de 15%" }),
    inflationRate: z.number()
      .min(0, { message: "L'inflation ne peut pas être négative" })
      .max(10, { message: "L'inflation maximum est de 10%" }),
    lifeExpectancy: z.number()
      .min(data.retirementAge + 1, { message: `L'espérance de vie doit être supérieure à l'âge de retraite` })
      .max(120, { message: "L'espérance de vie maximum est de 120 ans" }),
  });

  // Initialisation du formulaire avec React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm<z.infer<typeof projectionParamsSchema>>({
    resolver: zodResolver(projectionParamsSchema),
    defaultValues: {
      expectedReturns3a: data.expectedReturns3a,
      expectedReturns3b: data.expectedReturns3b,
      inflationRate: data.inflationRate,
      lifeExpectancy: data.lifeExpectancy,
    },
  });

  // Soumission du formulaire
  const onSubmit = (formData: z.infer<typeof projectionParamsSchema>) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Paramètres de projection</h2>
        <p className="text-muted-foreground">
          Ajustez les paramètres pour affiner votre simulation financière.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rendements attendus */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 3e pilier A */}
          <div className="space-y-2">
            <label htmlFor="expectedReturns3a" className="block text-sm font-medium text-foreground">
              Rendement attendu 3e pilier A (%)
            </label>
            <div className="relative">
              <input
                id="expectedReturns3a"
                type="number"
                step="0.1"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-8"
                {...register('expectedReturns3a', { valueAsNumber: true })}
              />
              <span className="absolute right-3 top-2 text-sm text-muted-foreground">%</span>
            </div>
            {errors.expectedReturns3a && (
              <p className="text-sm text-destructive mt-1">{errors.expectedReturns3a.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Rendement moyen historique: 1.5% - 2.5%
            </p>
          </div>

          {/* 3e pilier B */}
          <div className="space-y-2">
            <label htmlFor="expectedReturns3b" className="block text-sm font-medium text-foreground">
              Rendement attendu 3e pilier B (%)
            </label>
            <div className="relative">
              <input
                id="expectedReturns3b"
                type="number"
                step="0.1"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-8"
                {...register('expectedReturns3b', { valueAsNumber: true })}
              />
              <span className="absolute right-3 top-2 text-sm text-muted-foreground">%</span>
            </div>
            {errors.expectedReturns3b && (
              <p className="text-sm text-destructive mt-1">{errors.expectedReturns3b.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Rendement moyen historique: 3% - 6%
            </p>
          </div>
        </div>

        {/* Taux d'inflation */}
        <div className="space-y-2">
          <label htmlFor="inflationRate" className="block text-sm font-medium text-foreground">
            Taux d'inflation annuel attendu (%)
          </label>
          <div className="relative">
            <input
              id="inflationRate"
              type="number"
              step="0.1"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-8"
              {...register('inflationRate', { valueAsNumber: true })}
            />
            <span className="absolute right-3 top-2 text-sm text-muted-foreground">%</span>
          </div>
          {errors.inflationRate && (
            <p className="text-sm text-destructive mt-1">{errors.inflationRate.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Inflation moyenne en Suisse: 0.5% - 1.5%
          </p>
        </div>

        {/* Espérance de vie */}
        <div className="space-y-2">
          <label htmlFor="lifeExpectancy" className="block text-sm font-medium text-foreground">
            Espérance de vie (ans)
          </label>
          <input
            id="lifeExpectancy"
            type="number"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('lifeExpectancy', { valueAsNumber: true })}
          />
          {errors.lifeExpectancy && (
            <p className="text-sm text-destructive mt-1">{errors.lifeExpectancy.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Espérance de vie moyenne en Suisse: 84 ans pour les femmes, 80 ans pour les hommes
          </p>
        </div>

        {/* Informations contextuelles */}
        <div className="bg-muted p-4 rounded-md text-sm">
          <h3 className="font-medium mb-2">À propos des paramètres</h3>
          <p className="mb-2">
            Ces paramètres influencent directement la projection de votre épargne retraite. 
            Des rendements plus élevés augmenteront le capital final, mais comportent plus de risques.
          </p>
          <p>
            Le 3ème pilier A offre généralement des rendements plus faibles mais stables, 
            tandis que le 3ème pilier B permet d'investir dans des actifs à rendement potentiellement plus élevé.
          </p>
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
            Voir les résultats
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectionParamsForm; 