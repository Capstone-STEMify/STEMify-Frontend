'use client'
import { Card, CardContent } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { useTranslations } from 'next-intl'

interface ContractSectionProps {
  contractName: string
  contractDescription: string
  onContractNameChange: (value: string) => void
  onContractDescriptionChange: (value: string) => void
  onContractFileChange: (file: File | null) => void
}

export default function ContractSection({
  contractName,
  contractDescription,
  onContractNameChange,
  onContractDescriptionChange,
  onContractFileChange
}: ContractSectionProps) {
  const to = useTranslations('organization.subscription.create')
  return (
    <Card className='border-2 border-slate-200'>
      <CardContent className='space-y-5 p-6'>
        <div className='space-y-1'>
          <h3 className='text-lg font-semibold text-slate-900'>{to('contract.header')}</h3>
          <p className='text-sm text-slate-500'>{to('contract.headerDescription')}</p>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {/* Contract Name */}
          <div className='md:col-span-2'>
            <Label className='text-sm font-medium text-slate-700'>{to('contract.name.label')}</Label>
            <Input
              value={contractName}
              onChange={(e) => onContractNameChange(e.target.value)}
              placeholder={to('contract.name.placeholder')}
              className='mt-1'
            />
          </div>

          {/* Contract File Upload */}
          <div>
            <Label className='text-sm font-medium text-slate-700'>{to('contract.contractFile.label')}</Label>
            <input
              type='file'
              accept='.pdf, .docx, .doc'
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onContractFileChange(file)
              }}
              className='mt-1 block w-full cursor-pointer rounded-md border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-blue-100 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-blue-600 hover:bg-slate-100'
            />
            <p className='mt-1 text-[11px] text-slate-500'>{to('contract.contractFile.description')}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label className='text-sm font-medium text-slate-700'>{to('contract.description.label')}</Label>
          <textarea
            value={contractDescription}
            onChange={(e) => onContractDescriptionChange(e.target.value)}
            placeholder={to('contract.description.placeholder')}
            rows={3}
            className='mt-1 w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none'
          />
        </div>
      </CardContent>
    </Card>
  )
}
