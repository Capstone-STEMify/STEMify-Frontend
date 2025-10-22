// app/organization-dashboard/components/student-list-table.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Search, Filter, Download } from "lucide-react";
import { Student, studentData } from "../../api/data";

export function StudentListTable() {
  return (
    <Card className="shadow-sm rounded-xl">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
        <CardTitle className="text-lg font-semibold">Total Student List</CardTitle>
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search Student" className="pl-8" />
          </div>
          <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"><Checkbox /></TableHead>
              <TableHead>Student Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentData.map((student: Student) => (
              <TableRow key={student.id}>
                <TableCell><Checkbox /></TableCell>
                <TableCell className="font-medium">{student.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{student.name}</span>
                  </div>
                </TableCell>
                <TableCell>{student.position}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}