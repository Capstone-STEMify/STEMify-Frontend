import React from "react";
import { motion, Variants } from "framer-motion";

type GuideDetailsProps = {
  breadcrumb?: string;
  title?: string;
  author?: string;
  description?: string;
  imageUrl?: string;
  ageRange?: string;
  duration?: string;
  standards?: string;
  grades?: string;
  topics?: string[];
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const CircleIcon = () => (
  <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center shrink-0">
    <div className="w-2 h-2 bg-gray-400 rounded-full" />
  </div>
);

export default function GuideDetails({
  breadcrumb = "LESSON | PACING GUIDE | GRADE: 3RD UNITED STATES",
  title = "Intro: Tetrahedron Platonic Solid",
  author = "Strawbees Team",
  description = `Discover the tetrahedron, 1 of the 5 Platonic solids that have intrigued mathematicians, architects, and philosophers for thousands of years. This three-dimensional shape is formed by only 4 equilateral triangles. Learn to build this basic 3D shape as a starting point for many more future projects.`,
  imageUrl,
  ageRange = "7-14+",
  duration = "1:00:00",
  standards = "Common Core Mathematics, Florida - NGSSS, ISTE Students, TEKS Mathematics, TEKS Technology Applications",
  grades = "United States: 2nd, 3rd, 4th, 5th, 6th, 7th, 8th",
  topics = ["Geometry", "Get Started"]
}: GuideDetailsProps) {
  const fallback =
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1200&auto=format&fit=crop";

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-10 items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {breadcrumb}
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            {title}
          </h1>

          <p className="mt-2 text-sm text-gray-700">
            By <span className="font-semibold">{author}</span>
          </p>

          <p className="mt-4 leading-7 text-gray-700">{description}</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-8">
            <div className="flex items-start gap-3 pl-1 border-l-4 border-l-gray-500">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                  Age Range
                </h3>
                <p className="text-lg font-bold text-gray-900">{ageRange}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pl-1 border-l-4 border-l-gray-500">
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                  Duration
                </h3>
                <p className="text-lg font-bold text-gray-900">{duration}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
              Aligned Standards
            </h3>
            <p className="text-gray-700 leading-relaxed">{standards}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">
              Grades
            </h3>
            <p className="text-gray-700 leading-relaxed">{grades}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
              Topics
            </h3>
            <div className="flex gap-3 flex-wrap">
              {topics.map((t) => (
                <span
                  key={t}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:pl-2">
          <div className="rounded-2xl overflow-hidden shadow-sm bg-slate-100">
            <img
              src={imageUrl || fallback}
              alt="Lesson artwork"
              className="w-full h-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
