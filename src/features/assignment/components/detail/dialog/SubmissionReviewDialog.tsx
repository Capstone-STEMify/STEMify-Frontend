import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Textarea } from "@/components/shadcn/textarea";
import { Download, Printer, Share2, HelpCircle } from "lucide-react";
import { Submission } from "../table/AssignmentTable";

interface SubmissionReviewDialogProps {
  submission: Submission;
}

export function SubmissionReviewDialog({ submission }: SubmissionReviewDialogProps) {
  const isReviewed = submission.status === "Passed" || submission.status === "Failed";

  return (
    <div className="max-h-[90vh] overflow-y-auto p-6 md:p-8">
      <header className="flex flex-col sm:flex-row justify-between sm:items-start">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={submission.imageUrl} alt={submission.studentName} />
            <AvatarFallback>
              {submission.studentName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {submission.studentName}
              <Badge variant="outline" className="font-normal text-xs">
                {submission.studentRole.split(' ')[0]}
              </Badge>
            </h2>
            <p className="text-sm text-gray-500">{submission.studentRole}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="ghost" size="icon">
            <Download className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Printer className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="mt-6">
        <h1 className="text-3xl font-bold">{submission.quizTitle}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
          <span>Finished: {submission.quizFinishedDate}</span>
          <span className="flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" />
            {submission.quizQuestionCount} Questions
          </span>
        </div>
      </div>

      {isReviewed && (
        <div className="grid grid-cols-3 gap-4 mt-6 border-b pb-6">
          <div>
            <span className="text-sm text-gray-500">Accuracy</span>
            <p className="text-2xl font-semibold text-green-600">{submission.accuracy}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Point</span>
            <p className="text-2xl font-semibold text-yellow-600">{submission.point}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Answered</span>
            <p className="text-2xl font-semibold">{submission.answered}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 my-10 border rounded-lg">
  <div className="p-6 md:border-r">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
      PROMPT
    </h3>
    <div className="prose prose-sm max-w-none text-gray-700">
      <p>
        Select a public website that you use enough to be familiar with what
        a typical user may want to do. This website should not require
        the peer reviewer to sign up for an account...
      </p>
    </div>
  </div>
  
  <div className="p-6">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
      RUBRIC
    </h3>
    <div className="space-y-6">
      <div>
        <p className="font-medium text-sm">
          Is the quality attribute clearly identified?
        </p>
        <div className="space-y-2 mt-2">
          <label className="flex items-center gap-2 p-3 border rounded-md text-sm">
            <input type="radio" name="rubric1" className="form-radio" disabled />
            <span><b>0 points</b> No</span>
          </label>
          <label className="flex items-center gap-2 p-3 border rounded-md text-sm bg-blue-50 border-blue-300">
            <input type="radio" name="rubric1" className="form-radio" defaultChecked disabled />
            <span><b>1 point</b> Yes</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</div>

      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold">Comments</h3>
        
        {isReviewed ? (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border">
            <p className="text-sm text-gray-700 italic">
              {submission.comment || "No comment left."}
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-3">
              Comments left for the learner are visible only to that learner and
              the person who left the comment.
            </p>
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="Share your thoughts..."
                className="flex-1"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
               <Button variant="outline">Save Draft</Button>
               <Button>Submit Review</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}