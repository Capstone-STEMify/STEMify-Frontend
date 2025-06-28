import { cva } from 'class-variance-authority'

export const textVariants = cva('', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl'
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      primary: 'text-primary',
      yellow: 'text-amber-500',
      green: 'text-green-500',
      red: 'text-red-500',
      blue: 'text-blue-500'
    }
  },
  defaultVariants: {
    size: 'md',
    weight: 'normal',
    color: 'default'
  }
})
