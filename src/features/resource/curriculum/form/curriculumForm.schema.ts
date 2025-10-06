import z from 'zod'

/**
 * Upsert curriculum basic schema used for both create and update operations.
 */
export const buildCurriculumSchema = (tv: (key: string, values?: any) => string) =>
  z.object({
    code: z.string().min(3, tv('curriculum.code', { length: 3 })),
    title: z.string().min(10, tv('curriculum.title', { length: 10 })),
    description: z.string().min(50, tv('curriculum.description', { length: 50 })),
    imageUrl: z
      .instanceof(File)
      .refine((file) => file.size > 0, tv('curriculum.imageUrl'))
      .refine((file) => file.size < 5 * 1024 * 1024, tv('curriculum.imageSize', { size: 5 }))
      .optional(),
    imagePreviewUrl: z.string().optional(),
    price: z.number().min(1000, tv('curriculum.price', { min: 1000 }))
  })

/**
 * Type for curriculum form data based on the create curriculum schema.
 */
export type CurriculumFormData = z.infer<ReturnType<typeof buildCurriculumSchema>>
