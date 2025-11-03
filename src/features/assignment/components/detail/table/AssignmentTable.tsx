import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import { Badge } from "@/components/shadcn/badge";

type SubmissionStatus = "Not Reviewed" | "Passed" | "Failed" | "Not Submitted";

type Submission = {
  id: string;
  studentName: string;
  imageUrl: string;
  submittedDate: string | null;
  status: SubmissionStatus;
  grade: string | null;
};

const submissions: Submission[] = [
  {
    id: "1",
    studentName: "Nguyễn Văn An",
    imageUrl: "https://github.com/shadcn.png",
    submittedDate: "Oct 25, 2025",
    status: "Passed",
    grade: "95/100",
  },
  {
    id: "2",
    studentName: "Trần Thị Bích",
    imageUrl: "https://github.com/react.png",
    submittedDate: "Oct 26, 2025",
    status: "Not Reviewed",
    grade: null,
  },
  {
    id: "3",
    studentName: "Lê Văn Cường",
    imageUrl: "https://github.com/nextjs.png",
    submittedDate: "Oct 24, 2025",
    status: "Failed",
    grade: "40/100",
  },
  {
    id: "4",
    studentName: "Phạm Dũng",
    imageUrl: "https://github.com/vercel.png",
    submittedDate: null,
    status: "Not Submitted",
    grade: null,
  },
];

const statusVariantMap: Record<SubmissionStatus, "default" | "secondary" | "destructive" | "outline"> = {
  "Passed": "secondary",
  "Failed": "destructive",
  "Not Reviewed": "default",
  "Not Submitted": "outline",
};

export function AssignmentTable() {
  return (
    <div className="border rounded-lg">
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-200">
          <TableHead className="w-[300px]">Student Name</TableHead>
          <TableHead>Submitted Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Grade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={submission.imageUrl} alt={submission.studentName} />
                  <AvatarFallback>
                    {submission.studentName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{submission.studentName}</span>
              </div>
            </TableCell>
            
            <TableCell>
              {submission.submittedDate ? submission.submittedDate : "—"}
            </TableCell>
            
            <TableCell>
              <Badge variant={statusVariantMap[submission.status]}>
                {submission.status}
              </Badge>
            </TableCell>
            
            <TableCell className="text-right">
              {submission.grade ? submission.grade : "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}