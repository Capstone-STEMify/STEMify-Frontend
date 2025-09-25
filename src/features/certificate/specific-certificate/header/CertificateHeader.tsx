'use client'
import { CheckCircle, Download, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Course } from '../../mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { useState } from 'react';

interface CertificateHeaderProps {
  studentName: string;
  completionDate: string;
  studyDuration: string;
  specializationName: string;
  specializationUrl: string;
  courses: Course[];
}

const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-white bg-[#0077B5] rounded-full p-2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-white bg-gray-500 rounded-full p-2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-white bg-[#25D366] rounded-full p-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-white bg-[#1877F2] rounded-full p-2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-white bg-black rounded-full p-2"><path d="M18 4H6l-4 8 4 8h12l4-8z"></path><path d="m9.09 9 5.82 6M14.91 9l-5.82 6"></path></svg>;

const CertificateHeader = ({
  studentName,
  completionDate,
  studyDuration,
  specializationName,
  specializationUrl,
  courses,
}: CertificateHeaderProps) => {
  const [copyButtonText, setCopyButtonText] = useState("COPY");

    const shareUrl = "https://coursera.org/share/36284ba25812eb1d4203c";
    const shareText = `I just completed the ${specializationName} specialization on Coursera!`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopyButtonText("COPIED!");
            setTimeout(() => {
                setCopyButtonText("COPY");
            }, 2000);
        });
    };
    
    const socialPlatforms = [
      { name: 'LinkedIn', icon: <LinkedInIcon />, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
      { name: 'Email', icon: <EmailIcon />, url: `mailto:?subject=Check out my Coursera Certificate&body=${encodeURIComponent(shareText + ' ' + shareUrl)}` },
      { name: 'WhatsApp', icon: <WhatsAppIcon />, url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` },
      { name: 'Facebook', icon: <FacebookIcon />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
      { name: 'X', icon: <XIcon />, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
    ];

  return (
    <Dialog>
      <section className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Image src={'/images/Rosie.jpg'} width={64} height={64} alt='User Image' className='rounded-full'></Image>
                </div>
                <CheckCircle className="absolute -bottom-1 -right-1 h-7 w-7 text-white bg-blue-600 rounded-full border-2 border-white" />
              </div>
              <div className="pt-1">
                <p className="text-lg text-gray-700">Completed by <span className="font-bold text-gray-900">{studentName}</span></p>
                <h1 className="text-3xl font-bold text-gray-900 mt-1">{completionDate}</h1>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3 ml-20">{studyDuration}</p>
            <p className="mt-6 text-base text-gray-700">
              {studentName}'s account is verified. Coursera certifies their successful completion of University of California, Irvine{' '}
              <Link href={specializationUrl} className="text-blue-600 hover:underline font-semibold">{specializationName}</Link> Specialization.
            </p>
            <div className="mt-6">
              <h3 className="font-bold text-gray-800">Course Certificates Completed</h3>
              <div className="mt-2 text-gray-700 space-y-1">
                {courses.map((course) => (<p key={course.title}>{course.title}</p>))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end w-full lg:w-auto lg:max-w-md">
            <div className="w-full border rounded-md p-2 bg-gray-50 shadow-sm">
              <Image src="/certificate-placeholder.png" alt="Certificate Thumbnail" width={500} height={350} className="rounded" />
            </div>
            <div className="flex gap-4 mt-4 w-full">
              <DialogTrigger asChild>
                <Button className="flex-1 flex items-center justify-center gap-2 bg-blue-500" size="lg">
                  <Share2 size={18} />
                  Share Certificate
                </Button>
              </DialogTrigger>
              <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 border-blue-600 text-blue-600 hover:text-blue-600 hover:bg-blue-50" size="lg">
                <Download size={18} />
                Download
              </Button>
            </div>
          </div>
        </div>
      </section>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Share this page</DialogTitle>
          <DialogDescription>
            Show your friends what they can learn on Coursera
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-around items-center py-4">
          {socialPlatforms.map((platform) => (
            <a href={platform.url} key={platform.name} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 text-xs text-gray-600 hover:text-blue-600">
              {platform.icon}
              <span>{platform.name}</span>
            </a>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Input id="link" defaultValue={shareUrl} readOnly />
          <Button type="submit" size="sm" className="px-3 bg-blue-500" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            {copyButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateHeader;