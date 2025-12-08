'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { useModal } from '@/providers/ModalProvider'
import { useParams } from 'next/navigation'
import { useBulkAdd } from '@/hooks/useBulkAdd'
import { useAddClassroomStudentsMutation } from '@/features/classroom/api/classroomApi'
import { useSearchUserQuery, useSearchUserV2Query } from '@/features/user/api/userApi'
import useDebounce from '@/hooks/useDebounce'
import { Loader2, X, Search, UserPlus, Check } from 'lucide-react'
import { UserRole } from '@/types/userRole'
import { cn } from '@/utils/shadcn/utils'
import { LicenseAssignmentType } from '@/features/license-assignment/types/licenseAssignment'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'

// 🎨 Hàm tạo màu avatar từ email
const getAvatarColor = (email: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500'
  ]
  const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

// 🎨 Component Avatar
const UserAvatar = ({ email, userName }: { email: string; userName: string }) => {
  const initial = (userName || email).charAt(0).toUpperCase()
  const colorClass = getAvatarColor(email)

  return (
    <div
      className={cn(
        'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-medium text-white',
        colorClass
      )}
    >
      {initial}
    </div>
  )
}

export default function AddPeopleModal() {
  const tClassroom = useTranslations('classroom')
  const tc = useTranslations('common')

  const { closeModal } = useModal()
  const { classroomId } = useParams()
  const [addStudents, { isLoading }] = useAddClassroomStudentsMutation()

  const [keyword, setKeyword] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedKeyword = useDebounce(keyword, 300)
  const selectedSubscriptionId = useAppSelector((state) => state.selectedOrganization.selectedSubscriptionOrderId)
  const { data: studentData, isLoading: isSearching } = useSearchUserV2Query(
    {
      keyword: debouncedKeyword,
      license_type: LicenseAssignmentType.STUDENT,
      subscription_order_id: selectedSubscriptionId,
      pageNumber: 1,
      pageSize: 10
    },
    { skip: !debouncedKeyword.trim() || !showDropdown }
  )

  const {
    items: studentEmails,
    input,
    setInput,
    handleKeyDown: originalHandleKeyDown,
    handlePaste,
    removeItem,
    clearAll
  } = useBulkAdd({
    validateItem: (v) => /\S+@\S+\.\S+/.test(v.trim())
  })

  const students = studentData?.data?.items || []

  const handleSelectStudent = (email: string) => {
    if (!studentEmails.includes(email)) {
      studentEmails.push(email)
    }
    setInput('')
    setKeyword('')
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  // ⌨️ Xử lý phím điều hướng dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown && students.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < students.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault()
        handleSelectStudent(students[highlightedIndex].email)
        return
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setShowDropdown(false)
        setHighlightedIndex(-1)
        return
      }
    }

    // Xử lý logic thêm email gốc
    originalHandleKeyDown(e)
  }

  // 📤 Submit
  const handleSubmit = async () => {
    if (studentEmails.length === 0) return
    try {
      await addStudents({
        classroomId: Number(classroomId),
        studentEmails
      }).unwrap()

      closeModal()
    } catch (err) {
      console.error('Failed to add students:', err)
    }
  }

  // 🧱 Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset highlighted index khi danh sách thay đổi
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [students])

  // Hiển thị dropdown khi có debounced keyword
  useEffect(() => {
    if (debouncedKeyword.trim()) {
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }, [debouncedKeyword])

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <UserPlus className='h-5 w-5' />
            {tClassroom('update.students.addStudents')}
          </DialogTitle>
        </DialogHeader>

        <div className='min-w-[450px] space-y-2'>
          <label className='text-sm font-medium text-gray-700'>{tClassroom('update.students.studentEmail')}</label>
          <p className='text-xs text-gray-500'>{tClassroom('update.students.studentEmailSubtext')}</p>

          <div className='relative' ref={dropdownRef}>
            {/* Input Container */}
            <div
              className={cn(
                'flex min-h-[42px] flex-wrap items-center gap-2 rounded-lg border bg-white p-2 transition-all',
                showDropdown && 'border-blue-500 ring-2 ring-blue-500',
                'hover:border-gray-400'
              )}
              onClick={() => inputRef.current?.focus()}
            >
              {/* Selected Email Tags */}
              {studentEmails.map((email) => (
                <div
                  key={email}
                  className='flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-100'
                >
                  <span className='max-w-[200px] truncate'>{email}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeItem(email)
                    }}
                    className='text-blue-500 transition-colors hover:text-blue-700'
                    aria-label={`Remove ${email}`}
                  >
                    <X className='h-3.5 w-3.5' />
                  </button>
                </div>
              ))}

              {/* Input Field */}
              <div className='flex min-w-[200px] flex-1 items-center gap-2'>
                {/* Chỉ hiện icon search khi chưa có email nào */}
                {studentEmails.length === 0 && <Search className='h-4 w-4 text-gray-400' />}
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    setKeyword(e.target.value)
                  }}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder={studentEmails.length === 0 ? tClassroom('update.students.searchStudent') : ''}
                  className='h-auto flex-1 border-none p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'
                />
              </div>
            </div>

            {/* Dropdown Search Results */}
            {showDropdown && (
              <div className='absolute top-[calc(100%+4px)] left-0 z-50 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl'>
                {isSearching ? (
                  <div className='flex items-center justify-center p-8 text-sm text-gray-500'>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {tClassroom('update.students.searchingStudents')}
                  </div>
                ) : students.length > 0 ? (
                  <ul className='py-1'>
                    {students.map((user: any, index: number) => {
                      const isSelected = studentEmails.includes(user.email)
                      const isHighlighted = index === highlightedIndex

                      return (
                        <li
                          key={user.userId}
                          onClick={() => handleSelectStudent(user.email)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          className={cn(
                            'cursor-pointer px-4 py-3 transition-colors',
                            isHighlighted && 'bg-gray-50',
                            !isHighlighted && 'hover:bg-gray-50'
                          )}
                        >
                          <div className='flex items-center gap-3'>
                            {/* Avatar */}
                            <UserAvatar email={user.email} userName={user.userName} />

                            {/* User Info */}
                            <div className='min-w-0 flex-1'>
                              <div className='flex items-center gap-2'>
                                <span className='truncate text-sm font-medium text-gray-900'>
                                  {user.userName || user.email.split('@')[0]}
                                </span>
                                {isSelected && <Check className='h-4 w-4 flex-shrink-0 text-green-600' />}
                              </div>
                              <div className='truncate text-xs text-gray-500'>{user.email}</div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : debouncedKeyword.trim() ? (
                  <div className='p-8 text-center'>
                    <div className='text-sm text-gray-500'>
                      {tClassroom('update.students.noStudentFound')} "{debouncedKeyword}"
                    </div>
                    <div className='mt-1 text-xs text-gray-400'>{tClassroom('update.students.noStudentFoundSubtext')}</div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Counter */}
          {studentEmails.length > 0 && (
            <div className='text-xs text-gray-500'>
              {studentEmails.length} {tClassroom('update.students.students')} {tClassroom('update.students.selected')}
            </div>
          )}
        </div>

        <DialogFooter className='mt-6 flex justify-between sm:justify-between'>
          <Button variant='outline' onClick={clearAll} disabled={!studentEmails.length} className='gap-2'>
            <X className='h-4 w-4' />
            {tc('button.clearAll')}
          </Button>
          <Button onClick={handleSubmit} disabled={!studentEmails.length || isLoading} className='gap-2'>
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                {tc('button.submitting')}...
              </>
            ) : (
              <>
                <UserPlus className='h-4 w-4' />
                {tc('button.add')} {studentEmails.length} {tClassroom('update.students.students')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
