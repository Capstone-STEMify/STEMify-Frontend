export type Kit = {
    id: number
    name: string
    description?: string
    kitImages: KitImage[]
}

export type KitImage = {
    id: number
    url?: string
    alt?: string
}