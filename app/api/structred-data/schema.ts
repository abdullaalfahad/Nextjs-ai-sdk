import { z } from "zod";

export const recipeSchema = z.object({
  name: z.string().min(1),
  ingredients: z.array(
    z.object({
      name: z.string().min(1),
      amount: z.number().positive(),
      unit: z.string().min(1),
    })
  ),
  steps: z.array(
    z.object({
      step: z.number().min(1),
      description: z.string().min(1),
    })
  ),
});
