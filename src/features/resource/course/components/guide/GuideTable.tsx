import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './GuideTableCustom';

interface SyllabusSection {
  section: string;
  duration: string;
  objectives: string;
  instructions: string;
}

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const GuideTable: React.FC = () => {
  const syllabusData: SyllabusSection[] = [
    {
      section: "Overview and Objectives",
      duration: "05:00",
      objectives: "Facilitators set the groundwork for students to understand the purpose and components of the project with a well-defined set of learning objectives. By delving into the lesson's fundamentals, students gain the confidence and insight to craft their unique renditions of the project.",
      instructions: "Assign this lesson as a student resource. Have students read and watch the video.\n\nThis section prepares students to engage the lesson. Throughout the teaching of this entire lesson, the facilitator provides an opportunity for students to collaborate with each other and provide feedback on their individual or group project."
    },
    {
      section: "Preparation",
      duration: "30:00",
      objectives: "Equip students for before starting the lesson by familiarizing them with frequently used vocabulary words, enhancing their writing skills, and engaging in constructive building exercises.",
      instructions: "Get familiar with the Platonic Solids guide and vocabulary. Assign this lesson as student resources. Have students read the list and watch the video."
    },
    {
      section: "Imagine",
      duration: "10:00",
      objectives: "Learn about the properties of the tetrahedron as one of the Platonic solids.",
      instructions: "Imagine section is a critical phase where students are encouraged to conceptualize, and visualize their ideas before diving into the building and prototyping stage in Build section. Pause to have a short group reflection.\n\nCommon Core Mathematics\n\nFor CCSS MATH CONTENT 3.G.A.1, introduce the icosahedron, characterized by having 20 equilateral"
    }
  ];

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border overflow-hidden"
      variants={itemVariants}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-yellow-100">
              <TableHead className="font-bold text-gray-800 text-center py-4">
                SECTION
              </TableHead>
              <TableHead className="font-bold text-gray-800 text-center py-4">
                DURATION
              </TableHead>
              <TableHead className="font-bold text-gray-800 text-center py-4">
                STUDENT & FACILITATOR - LEARNING OBJECTIVES
              </TableHead>
              <TableHead className="font-bold text-gray-800 text-center py-4">
                FACILITATION INSTRUCTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {syllabusData.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b transition-colors hover:bg-muted/50`}
              >
                <td className="font-medium text-gray-800 py-6 px-4 align-top">
                  {row.section}
                </td>
                <td className="text-center py-6 px-4 align-top font-mono">
                  {row.duration}
                </td>
                <td className="py-6 px-4 align-top max-w-md">
                  <p className="text-gray-700 leading-relaxed">{row.objectives}</p>
                </td>
                <td className="py-6 px-4 align-top max-w-md">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {row.instructions}
                  </div>
                </td>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default GuideTable;