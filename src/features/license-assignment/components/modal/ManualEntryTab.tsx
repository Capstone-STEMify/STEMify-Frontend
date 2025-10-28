import { Button } from '@/components/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import {
  useCreateLicenseAssignmentBulkMutation,
  useCreateLicenseAssignmentMutation
} from '@/features/license-assignment/api/licenseAssignmentApi'
import { LicenseAssignmentType } from '@/features/license-assignment/types/licenseAssignment'
import { to } from '@react-spring/core'
import { useParams } from 'next/navigation'
import { KeyboardEvent, useState } from 'react'
import { toast } from 'sonner'

export default function ManualEntryTab() {
  const [emailList, setEmailList] = useState<string[]>([])
  const [input, setInput] = useState('')
  const { subscriptionId } = useParams()
  const [type, setType] = useState<LicenseAssignmentType>(LicenseAssignmentType.STUDENT)

  const [createLicenseAssignmentBulk] = useCreateLicenseAssignmentBulkMutation()

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ' ', ','].includes(e.key)) {
      e.preventDefault()
      const value = input.trim()
      if (value && /\S+@\S+\.\S+/.test(value)) {
        if (!emailList.includes(value)) {
          setEmailList([...emailList, value])
        }
        setInput('')
      }
    } else if (e.key === 'Backspace' && !input && emailList.length > 0) {
      setEmailList(emailList.slice(0, -1))
    }
  }

  const removeEmail = (email: string) => {
    setEmailList(emailList.filter((e) => e !== email))
  }

  const handleSubmit = async () => {
    createLicenseAssignmentBulk({
      licenseAssignmentCreatePayload: emailList.map((email) => ({
        organizationSubscriptionOrderId: Number(subscriptionId),
        userEmail: email,
        type: type
      }))
    })
    toast.success('Send invitations successfully')
  }

  return (
    <div className='space-y-4'>
      {/* Select user type */}
      <div className='space-y-1'>
        <label className='block text-sm font-medium'>User Type</label>
        <Select value={type} onValueChange={(val) => setType(val as LicenseAssignmentType)}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select user type' />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LicenseAssignmentType).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {key
                  .replace(/_/g, ' ')
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Email input */}
      <div className='space-y-1'>
        <label className='block text-sm font-medium'>Emails</label>
        <div className='ring-ring flex min-h-[40px] flex-wrap items-center gap-2 rounded-md border p-2 focus-within:ring-1'>
          {emailList.map((email, idx) => (
            <div key={idx} className='bg-muted flex items-center gap-1 rounded-full border px-2 py-1 text-xs'>
              <span>{email}</span>
              <button onClick={() => removeEmail(email)} className='text-muted-foreground hover:text-destructive'>
                ✕
              </button>
            </div>
          ))}

          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Enter email...'
            className='min-w-[140px] flex-1 bg-transparent text-sm outline-none'
          />
        </div>
      </div>

      {/* Submit */}
      <div className='flex justify-end'>
        <Button onClick={handleSubmit} disabled={emailList.length === 0} className='bg-sky-500'>
          Send Invitations
        </Button>
      </div>
    </div>
  )
}
