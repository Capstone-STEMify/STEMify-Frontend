import { Card } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Plus, Trash2 } from 'lucide-react'
import React from 'react'
type AdminAccount = {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export default function Step4AdminAccounts({ formData, setFormData }: { formData: any; setFormData: any }) {
  const addAdmin = () => {
    setFormData({
      ...formData,
      admins: [...formData.admins, { email: '', firstName: '', lastName: '', phoneNumber: '' }]
    })
  }

  const removeAdmin = (index: number) => {
    const newAdmins = formData.admins.filter((_: any, i: number) => i !== index)
    setFormData({ ...formData, admins: newAdmins })
  }

  const updateAdmin = (index: number, field: keyof AdminAccount, value: string) => {
    const newAdmins = [...formData.admins]
    newAdmins[index] = { ...newAdmins[index], [field]: value }
    setFormData({ ...formData, admins: newAdmins })
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='mb-4 text-2xl font-bold text-slate-900'>Add Admin Accounts</h2>
        <p className='text-slate-600'>Grant access to organization administrators</p>
      </div>

      <div className='space-y-4'>
        {formData.admins.map((admin: AdminAccount, index: number) => (
          <Card key={index} className='border-slate-200 p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='font-semibold text-slate-900'>Admin {index + 1}</h3>
              {formData.admins.length > 1 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => removeAdmin(index)}
                  className='h-8 w-8 p-0 text-slate-500 hover:text-red-600'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              )}
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor={`email-${index}`} className='text-sm font-medium text-slate-700'>
                  Email Address <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id={`email-${index}`}
                  type='email'
                  placeholder='admin@example.com'
                  value={admin.email}
                  onChange={(e) => updateAdmin(index, 'email', e.target.value)}
                  className='border-slate-300'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor={`phone-${index}`} className='text-sm font-medium text-slate-700'>
                  Phone Number
                </Label>
                <Input
                  id={`phone-${index}`}
                  type='tel'
                  placeholder='+1 (555) 000-0000'
                  value={admin.phoneNumber}
                  onChange={(e) => updateAdmin(index, 'phoneNumber', e.target.value)}
                  className='border-slate-300'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor={`firstName-${index}`} className='text-sm font-medium text-slate-700'>
                  First Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id={`firstName-${index}`}
                  placeholder='John'
                  value={admin.firstName}
                  onChange={(e) => updateAdmin(index, 'firstName', e.target.value)}
                  className='border-slate-300'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor={`lastName-${index}`} className='text-sm font-medium text-slate-700'>
                  Last Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id={`lastName-${index}`}
                  placeholder='Doe'
                  value={admin.lastName}
                  onChange={(e) => updateAdmin(index, 'lastName', e.target.value)}
                  className='border-slate-300'
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        type='button'
        variant='outline'
        onClick={addAdmin}
        className='w-full border-dashed border-slate-300 bg-transparent hover:border-slate-400 hover:bg-slate-50'
      >
        <Plus className='mr-2 h-4 w-4' />
        Add Another Admin
      </Button>
    </div>
  )
}
