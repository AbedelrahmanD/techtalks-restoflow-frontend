export interface CustomerFeedbackQuestion {
  id: number;
  question: string;
  isActive: boolean;
}

export interface FeedbackResponseCreateDto {
  questionId: number;
  rating: number;
}

export interface FeedbackSessionCreateDto {
  customerPhone?: string | null;
  customerNote?: string | null;
  responses: FeedbackResponseCreateDto[];
}

export interface FeedbackSubmissionResponse {
  id: number;
  message: string;
}