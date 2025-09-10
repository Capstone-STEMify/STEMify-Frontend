import z from 'zod'

export const buildKitSchema = (tv: (key: string, values?: any) => string) =>
  z.object({
    name: z.string().min(3, tv('kit.name', { length: 3 })),
    description: z.string().min(10, tv('kit.description', { length: 10 })),
    images: z.array(z.instanceof(File)).max(5, tv('kit.images', { count: 5 }))
  })

export type KitFormData = z.infer<ReturnType<typeof buildKitSchema>>
