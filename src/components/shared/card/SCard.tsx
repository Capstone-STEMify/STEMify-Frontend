import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/shadcn/card'

type SCardProps = {
  className?: string
  title?: string
  titleClassName?: string
  description?: string
  action?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
  footerClassName?: string
}

export function SCard({
  className,
  footerClassName,
  title,
  titleClassName,
  description,
  action,
  content,
  footer
}: SCardProps) {
  return (
    <Card className={`py-4 ${className}`}>
      {title && (
        <CardHeader>
          <CardTitle className={titleClassName}>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
          <CardAction>{action}</CardAction>
        </CardHeader>
      )}

      <CardContent>{content}</CardContent>
      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  )
}
