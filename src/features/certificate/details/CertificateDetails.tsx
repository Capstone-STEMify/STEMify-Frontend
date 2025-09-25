// app/certificate/components/CertificateDetails.tsx
import { Check } from 'lucide-react';
import Image from 'next/image';

interface CertificateDetailsProps {
    specializationName: string;
    rating: number;
    ratingCount: string;
    enrollmentCount: string;
    learningOutcomes: string[];
    skills: string[];
}

const CertificateDetails = ({
    specializationName,
    rating,
    ratingCount,
    enrollmentCount,
    learningOutcomes,
    skills,
}: CertificateDetailsProps) => {
    return (
        <section className="bg-white p-6 md:p-8 rounded-lg shadow-md mt-6">
            <div className="flex items-start gap-4">
                {/* Replace with actual university logo */}
                <Image src="/uci-logo.svg" alt="UCI Logo" width={60} height={60} />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{specializationName}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <span>⭐ {rating}</span>
                        <span>({ratingCount} ratings)</span>
                        <span>{enrollmentCount} already enrolled</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 border-t pt-6">
                {/* WHAT YOU WILL LEARN */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-3">WHAT YOU WILL LEARN</h3>
                    <ul className="space-y-2">
                        {learningOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                                <span className="text-gray-700">{outcome}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* SKILLS YOU WILL GAIN */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-3">SKILLS YOU WILL GAIN</h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CertificateDetails;