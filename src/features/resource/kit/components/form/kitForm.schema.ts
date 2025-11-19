import z from 'zod'

export const buildKitSchema = (tv: (key: string, values?: any) => string) =>
  z.object({
    name: z.string().min(3, tv('kit.name', { length: 3 })),
    description: z.string().min(5, tv('kit.description', { length: 5 })),
    images: z.array(z.instanceof(File)).max(10, tv('kit.images', { count: 10 })),
    ageRangeId: z.string().min(1, tv('course.ageRangeId')),
    weight: z.number().min(0, tv('kit.weight', { min: 0 })),
    dimensions: z.string().optional()
  })

export type KitFormData = z.infer<ReturnType<typeof buildKitSchema>>
