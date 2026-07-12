export interface FeedbackQuestionCreateDto {
    question: string;
    isActive: boolean;
}

export interface FeedbackQuestionUpdateDto {
    question: string;
    isActive: boolean;
}

export interface FeedbackQuestionDto {
    id: number;
    question: string;
    isActive: boolean;
}