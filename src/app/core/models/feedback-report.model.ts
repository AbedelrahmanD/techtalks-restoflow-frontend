export interface FeedbackReport {
  totalSessions: number;
  overallAverageRating: number;
  questions: FeedbackQuestionReport[];
  recentFeedback: RecentFeedback[];
}

export interface FeedbackQuestionReport {
  questionId: number;
  question: string;
  averageRating: number;
  responseCount: number;
  ratingDistribution: Record<string, number>;
}

export interface RecentFeedback {
  sessionId: number;
  customerPhone: string | null;
  customerNote: string | null;
  createdAt: string;
  averageRating: number;
}