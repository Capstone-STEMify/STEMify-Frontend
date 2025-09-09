import React from 'react'
interface UpsertKitProps {
  kitId?: number
  onSuccess?: () => void
}

export default function UpsertKit({ kitId, onSuccess }: UpsertKitProps) {
  return <div>UpsertKit</div>
}
