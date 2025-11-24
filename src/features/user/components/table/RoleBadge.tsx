import { UserRole } from '@/types/userRole'
import React from 'react'

interface RoleBadgeProps {
  role: UserRole
}

const roleColors = {
  admin: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  },
  staff: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  teacher: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  student: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200'
  },
  Guest: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  }
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const normalizedRole = role.toLowerCase() as keyof typeof roleColors
  const colors = roleColors[normalizedRole] || roleColors.Guest

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {role}
    </span>
  )
}
