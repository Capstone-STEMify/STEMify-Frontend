'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/shadcn/dialog'
import { useGetOrganizationUserDetailQuery } from '@/features/user/api/userApi'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Badge } from '@/components/shadcn/badge'
import { Mail, User, BookOpen, Briefcase, Hash, Clock, ShieldCheck, XCircle } from 'lucide-react'
import { formatDate } from '@/utils/index'
import { useLocale, useTranslations } from 'next-intl'
import { Separator } from '@/components/shadcn/separator'

interface OrganizationUserDetailModalProps {
  organizationUserId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrganizationUserDetailModal({
  organizationUserId,
  open,
  onOpenChange,
}: OrganizationUserDetailModalProps) {
  const locale = useLocale()
  const t = useTranslations('organization.userDetail')

  const { data: response, isLoading } = useGetOrganizationUserDetailQuery(
    { organizationUserId: organizationUserId! },
    { skip: !organizationUserId || !open }
  )

  const user = response?.data

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'organizationadmin':
        return 'destructive'
      case 'teacher':
        return 'default'
      case 'student':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
           <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <LoadingComponent />
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Avatar className="h-20 w-20 border-2 border-slate-100 shadow-sm">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h3 className="text-2xl font-bold text-slate-900">{user.fullName}</h3>
                <div className="flex items-center justify-center gap-2 sm:justify-start text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-sm">@{user.userName}</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start pt-1">
                   {user.subscriptions?.map((sub, idx) => (
                      <Badge key={idx} variant={getRoleBadgeVariant(sub.licenseType)} className="rounded-md">
                        {sub.licenseType}
                      </Badge>
                   ))}
                    <Badge variant={user.isActive ? 'success' : 'secondary'} className="rounded-md flex items-center gap-1">
                        {user.isActive ? <ShieldCheck className="h-3 w-3"/> : <XCircle className="h-3 w-3"/>}
                        {user.isActive ? t('status.active') : t('status.inactive')}
                    </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Detailed Info Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              
              {/* Contact Info */}
              <div className="space-y-3">
                 <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500"/>
                    {t('contactInfo')}
                 </h4>
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-muted-foreground">{t('email')}</p>
                    <p className="text-sm font-medium break-all">{user.email}</p>
                 </div>
              </div>

               {/* Activity Info */}
               <div className="space-y-3">
                 <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500"/>
                    {t('activity')}
                 </h4>
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                    <div>
                        <p className="text-xs text-muted-foreground">{t('joinedAt')}</p>
                        <p className="text-sm font-medium">{formatDate(user.joinedAt, { locale })}</p>
                    </div>
                     <div>
                        <p className="text-xs text-muted-foreground">{t('lastLogin')}</p>
                        <p className="text-sm font-medium">
                            {user.lastLoginAt ? formatDate(user.lastLoginAt, { locale }) : t('never')}
                        </p>
                    </div>
                 </div>
              </div>

              {/* Academic / Professional Info */}
              {(user.groupName || user.studentMajor || user.teacherSpecialization || user.bio) && (
                  <div className="col-span-1 sm:col-span-2 space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-purple-500"/>
                        {t('professionalDetails')}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {user.groupName && (
                            <div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Hash className="h-3 w-3"/> {t('groupName')}
                                </p>
                                <p className="text-sm font-medium">{user.groupName}</p>
                            </div>
                        )}
                        {user.groupCode && (
                            <div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Hash className="h-3 w-3"/> {t('groupCode')}
                                </p>
                                <p className="text-sm font-medium">{user.groupCode}</p>
                            </div>
                        )}
                        {user.teacherSpecialization && (
                             <div className="sm:col-span-2">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <BookOpen className="h-3 w-3"/> {t('specialization')}
                                </p>
                                <p className="text-sm font-medium">{user.teacherSpecialization}</p>
                            </div>
                        )}
                        {user.studentMajor && (
                             <div className="sm:col-span-2">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <BookOpen className="h-3 w-3"/> {t('major')}
                                </p>
                                <p className="text-sm font-medium">{user.studentMajor}</p>
                            </div>
                        )}
                         {user.bio && (
                             <div className="sm:col-span-2 mt-1">
                                <p className="text-xs text-muted-foreground mb-1">{t('bio')}</p>
                                <p className="text-sm italic text-slate-600 bg-white p-2 rounded border border-slate-200">
                                    "{user.bio}"
                                </p>
                            </div>
                        )}
                    </div>
                  </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
             {t('noData')}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}