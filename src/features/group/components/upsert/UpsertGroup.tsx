'use client'

import { useState } from 'react'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Button } from '@/components/shadcn/button'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/shadcn/select'
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from '@/components/shadcn/table'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/shadcn/avatar'
import { ScrollArea } from '@/components/shadcn/scroll-area'

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@gmail.com', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: 'Jane Smith', email: 'jane@gmail.com', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: 'David Brown', email: 'david@gmail.com', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 4, name: 'Emma Wilson', email: 'emma@gmail.com', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' }
]

export default function UpsertGroup() {
  const [groupName, setGroupName] = useState('')
  const [numberOfStudents, setNumberOfStudents] = useState('')
  const [grade, setGrade] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleSubmit = () => {
    console.log({ groupName, numberOfStudents, grade, selectedUsers })
    alert('Submit Success - Check Console Log')
  }

  return (
    <div className='space-y-6'>
      {/* FORM */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label>Group Name</Label>
          <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder='Enter group name' />
        </div>

        <div>
          <Label>Number of Students</Label>
          <Input type='number' value={numberOfStudents} onChange={(e) => setNumberOfStudents(e.target.value)} />
        </div>

        <div>
          <Label>Grade Level</Label>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger>
              <SelectValue placeholder='Select grade...' />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((x) => (
                <SelectItem key={x} value={x.toString()}>
                  Grade {x}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* STUDENT TABLE */}
      <Label className='text-md mb-1 block font-semibold'>Student List</Label>
      <ScrollArea className='h-48 rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox checked={selectedUsers.includes(user.id)} onCheckedChange={() => toggleUser(user.id)} />
                </TableCell>

                <TableCell className='flex items-center gap-2'>
                  <Avatar className='h-7 w-7'>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  {user.name}
                </TableCell>

                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* ACTION */}
      <div className='flex justify-end gap-3'>
        <Button variant='secondary'>Cancel</Button>
        <Button onClick={handleSubmit}>Save Group</Button>
      </div>
    </div>
  )
}
