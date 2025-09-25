'use client'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";
import { BookOpenCheck, CheckCircle, FileText, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Specialization } from "../../api/mockData";

interface SpecializationCardProps {
  specialization: Specialization;
  itemValue: string;
}

export const SpecializationCard = ({ specialization, itemValue }: SpecializationCardProps) => {
  return (
    <AccordionItem value={itemValue} className="border-b-0">
      <Card className="overflow-hidden shadow-sm transition-all hover:shadow-md">
        <AccordionTrigger className="p-4 text-left hover:no-underline [&_svg]:hidden">
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-start gap-4">
              <div>
                <Image src={'/images/cert-specialization.png'} width={64} height={64} alt="Specialization"></Image>
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">{specialization.title}</h3>
                <p className="text-sm text-gray-600">{specialization.university}</p>
              </div>
            </div>
            <Button className="ml-4 flex-shrink-0 bg-blue-500" onClick={(e) => e.stopPropagation()}>Add to LinkedIn</Button>
          </div>
        </AccordionTrigger>

        <AccordionContent>
          <div className="bg-blue-50/70 p-16 flex flex-col sm:flex-row items-center gap-6">
            <div className="sm:w-2/5 lg:w-2/3">
              <Image src={specialization.logoUrl} alt="University Logo" width={40} height={40} className="mb-4" />
              <h4 className="text-4xl font-semibold text-gray-900">
                Congratulations on earning your {specialization.title} Specialization Certificate!
              </h4>
              <div className="mt-4 flex gap-3">
                <Button className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white" variant="outline">View career certificate</Button>
              </div>
            </div>
            <div className="sm:w-2/5 lg:w-2/5 flex justify-center sm:justify-end">
              <Image 
                src={specialization.certificateImageUrl} 
                alt="Certificate" 
                width={280}
                height={200}
                className="rounded-md border bg-white p-1 shadow-md" 
              />
            </div>
          </div>
          <div className="bg-white">
            {specialization.courses.map((course, index) => (
              <div key={index} className="border-t p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-sm text-gray-500">{course.status}</p>
                    <div>
                      <Button className="text-blue-500 bg-white outline-none shadow-none hover:underline">Add to LinkedIn</Button>
                      <Button className="text-blue-500 bg-white outline-none shadow-none hover:underline">View Certificate</Button>
                    </div>
                  </div>
                </div>
                <MoreHorizontal className="h-5 w-5 text-gray-500 cursor-pointer" />
              </div>
            ))}
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};