import { Button } from '@/components/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import {
  useCreateLicenseAssignmentBulkMutation,
  useCreateLicenseAssignmentMutation
} from '@/features/license-assignment/api/licenseAssignmentApi'
import { LicenseAssignmentType } from '@/features/license-assignment/types/licenseAssignment'
import { goBack } from '@/features/subscription/slice/organizationSubscriptionFormSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { KeyboardEvent, useState } from 'react'
import { toast } from 'sonner'

type ManualEntryTabProps = {
  isStep?: boolean
  openModal?: () => void
  userType?: LicenseAssignmentType
  labelButton?: string
  organizationSubscriptionOrderId?: number
}

export default function ManualEntryTab({
  isStep,
  openModal,
  userType,
  labelButton,
  organizationSubscriptionOrderId
}: ManualEntryTabProps) {
  const to = useTranslations('organization.license')
  const tc = useTranslations('common')

  const dispatch = useAppDispatch()
  const { organizationSubscriptionId } = useAppSelector((state) => state.organizationSubscriptionForm)
  const [emailList, setEmailList] = useState<string[]>([])
  const [input, setInput] = useState('')
  const { subscriptionId, organizationId } = useParams()
  const [type, setType] = useState<LicenseAssignmentType>(userType ?? LicenseAssignmentType.STUDENT)

  const [createLicenseAssignmentBulk] = useCreateLicenseAssignmentBulkMutation()

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ' ', ',', ';'].includes(e.key)) {
      e.preventDefault()
      const value = input.trim()
      if (value) {
        const newEmails = value
          .split(/[\s,;]+/) // tách theo khoảng trắng, dấu phẩy, chấm phẩy
          .map((v) => v.trim())
          .filter((v) => /\S+@\S+\.\S+/.test(v))

        const uniqueEmails = [...new Set([...emailList, ...newEmails])]
        setEmailList(uniqueEmails)
        setInput('')
      }
    } else if (e.key === 'Backspace' && !input && emailList.length > 0) {
      setEmailList(emailList.slice(0, -1))
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text')
    const newEmails = pasted
      .split(/[\s,;]+/)
      .map((v) => v.trim())
      .filter((v) => /\S+@\S+\.\S+/.test(v))

    if (newEmails.length > 0) {
      const uniqueEmails = [...new Set([...emailList, ...newEmails])]
      setEmailList(uniqueEmails)
    }
  }

  const removeEmail = (email: string) => {
    setEmailList(emailList.filter((e) => e !== email))
  }

  const clearAll = () => {
    setEmailList([])
    setInput('')
  }

  const handleSubmit = async () => {
    const inviteUserItems = emailList.map((email) => ({
      email: email,
      role: type,
      subscription_order_id: String(organizationSubscriptionOrderId) ?? String(organizationSubscriptionId)
    }))
    await createLicenseAssignmentBulk({
      organization_id: String(organizationId),
      users: inviteUserItems
    }).unwrap()

    toast.success(to('uploadSuccess'))
    openModal?.()
  }

  return (
    <div className='space-y-4'>
      {/* Select user type */}
      {userType ? (
        <div className='rounded-lg border border-blue-100 bg-blue-50/60 p-5 shadow-sm transition-all hover:shadow-md'>
          <h3 className='flex items-center gap-2 text-base font-semibold text-blue-700'>
            <span className='inline-flex h-2 w-2 rounded-full bg-blue-500' />
            Create {userType} Account
          </h3>

          <p className='mt-1 text-sm leading-relaxed text-slate-600'>
            A new <span className='font-semibold text-blue-700'>{userType}</span> account will be created for this
            organization. The account will automatically be assigned a valid license from this subscription.
          </p>
        </div>
      ) : (
        <div className='space-y-1'>
          <label className='block text-sm font-medium'>{to('userType')}</label>
          <Select value={type} onValueChange={(val) => setType(val as LicenseAssignmentType)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select user type' />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LicenseAssignmentType).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {tc(`accountType.${key.toLowerCase()}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            placeholder='Enter email...'
            className='min-w-[140px] flex-1 bg-transparent text-sm outline-none'
          />
        </div>
      </div>

      {/* Submit */}
      <div className='flex justify-between'>
        {isStep ? (
          <Button variant='outline' onClick={() => dispatch(goBack())}>
            {tc('button.back')}
          </Button>
        ) : null}
        <div className='flex w-full justify-end gap-2'>
          <Button
            variant='outline'
            onClick={clearAll}
            disabled={emailList.length === 0}
            className='border-gray-300 text-gray-700 hover:bg-gray-100'
          >
            {tc('button.clearAll')}
          </Button>

          <Button onClick={handleSubmit} disabled={emailList.length === 0} className='bg-sky-500 hover:bg-sky-600'>
            {labelButton || tc('button.sendInvitations')}
          </Button>
        </div>
      </div>
    </div>
  )
}
