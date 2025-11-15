"use client";

import * as React from "react";
import {
  Download,
  MoreVertical,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn/collapsible";

const students = [{ id: "1", name: "dat se" }];
const lesson2SubLessons = Array.from({ length: 12 }, (_, i) => `2.${i + 1}`);

export function StudentProgressStatistic() {
  const [isLesson2Open, setIsLesson2Open] = React.useState(true);

  return (
    <div className="p-4 md:p-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Students</h2>
          <div className="flex items-center gap-2 text-sm">
            <span>Lessons in</span>
            <Select defaultValue="course-a">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course-a">Course A (2025)</SelectItem>
                <SelectItem value="course-b">Course B (2025)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="border rounded-lg overflow-x-auto">
        <Table className="min-w-[1200px]">
          {" "}
          <TableHeader>
            <TableRow className="border-b-0">
              <TableHead
                rowSpan={2}
                className="sticky left-0 bg-background z-10 w-[250px] min-w-[250px] border-b"
              >
                <div className="flex flex-col gap-2 py-4">
                  <label htmlFor="sort-by" className="text-sm font-medium">
                    Sort by:
                  </label>
                  <Select defaultValue="display-name">
                    <SelectTrigger id="sort-by" className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="display-name">Display name</SelectItem>
                      <SelectItem value="first-name">First name</SelectItem>
                      <SelectItem value="last-name">Last name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>

              <TableHead
                rowSpan={2}
                className="w-[80px] min-w-[80px] text-center align-top p-0 border-b"
              >
                <div className="font-semibold p-4 border-b">1</div>
                <div className="p-4">1.1</div>
              </TableHead>

              <TableHead
                colSpan={isLesson2Open ? 12 : 1}
                className="p-0 align-top"
              >
                <Collapsible open={isLesson2Open} onOpenChange={setIsLesson2Open}>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2 p-4 border-b font-semibold w-full cursor-pointer">
                      {isLesson2Open ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      Lesson 2: Learn to Drag and Drop
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent asChild>
                    <div className="flex">
                      {lesson2SubLessons.map((lesson) => (
                        <div
                          key={lesson}
                          className="p-4 text-center w-[70px] min-w-[70px] flex-shrink-0 border-l"
                        >
                          {lesson}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="sticky left-0 bg-background z-10">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={student.id} className="border-b-0">
                      <AccordionTrigger className="p-0 hover:no-underline">
                        {student.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        More student details can go here.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableCell>

                <TableCell className="text-center h-[70px]">
                </TableCell>

                {isLesson2Open &&
                  lesson2SubLessons.map((lesson) => (
                    <TableCell
                      key={`${student.id}-${lesson}`}
                      className="text-center h-[70px]"
                    >
                    </TableCell>
                  ))}
                
                {!isLesson2Open && (
                  <TableCell className="text-center h-[70px] bg-muted/30">
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}