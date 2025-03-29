import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../lib/ui/button';
import { SimulationData } from '../SimulatorWizard';

// Définition du schéma de validation
const personalInfoSchema = z.object({
  age: z.number()
    .min(18, { message: "Vous devez avoir au moins 18 ans" })
    .max(70, { message: "L'âge maximum est de 70 ans" }),
  retirementAge: z.number()
    .min(58, { message: "L'âge de retraite minimum est de 58 ans" })
    .max(75, { message: "L'âge de retraite maximum est de 75 ans" }),
  gender: z.enum(['male', 'female'], {
    required_error: "Veuillez sélectionner votre genre",
  }),
});

type PersonalInfoFormProps = {
  data: SimulationData;
  onUpdate: (data: Partial<SimulationData>) => void;
  onNext: () => void;
};

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  data, 
  onUpdate, 
  onNext 
}) => {
  // Initialisation du formulaire avec React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      age: data.age,
      retirementAge: data.retirementAge,
      gender: data.gender,
    },
  });

  // Soumission du formulaire
  const onSubmit = (formData: z.infer<typeof personalInfoSchema>) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Informations personnelles</h2>
        <p className="text-muted-foreground">
          Partagez quelques informations de base pour personnaliser votre simulation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Âge actuel */}
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-medium text-foreground">
              Âge actuel
            </label>
            <input
              id="age"
              type="number"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register('age', { valueAsNumber: true })}
            />
            {errors.age && (
              <p className="text-sm text-destructive mt-1">{errors.age.message}</p>
            )}
          </div>

          {/* Âge de retraite prévu */}
          <div className="space-y-2">
            <label htmlFor="retirementAge" className="block text-sm font-medium text-foreground">
              Âge de retraite prévu
            </label>
            <input
              id="retirementAge"
              type="number"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register('retirementAge', { valueAsNumber: true })}
            />
            {errors.retirementAge && (
              <p className="text-sm text-destructive mt-1">{errors.retirementAge.message}</p>
            )}
          </div>
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Genre</label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                id="gender-male"
                type="radio"
                value="male"
                className="h-4 w-4"
                {...register('gender')}
              />
              <label htmlFor="gender-male" className="ml-2 text-sm">
                Homme
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="gender-female"
                type="radio"
                value="female"
                className="h-4 w-4"
                {...register('gender')}
              />
              <label htmlFor="gender-female" className="ml-2 text-sm">
                Femme
              </label>
            </div>
          </div>
          {errors.gender && (
            <p className="text-sm text-destructive mt-1">{errors.gender.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            Continuer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm; 