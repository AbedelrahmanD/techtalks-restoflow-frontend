import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    FeedbackQuestionCreateDto,
    FeedbackQuestionDto,
    FeedbackQuestionUpdateDto
} from '../models/feedback-question.model';

@Injectable({
    providedIn: 'root'
})
export class FeedbackQuestionsService {
    private http = inject(HttpClient);

    questions = signal<FeedbackQuestionDto[]>([]);

    listQuestions(): Observable<FeedbackQuestionDto[]> {
        return this.http.get<FeedbackQuestionDto[]>(
            '/api/FeedbackQuestion'
        );
    }

    getQuestion(id: number | string): Observable<FeedbackQuestionDto> {
        return this.http.get<FeedbackQuestionDto>(
            `/api/FeedbackQuestion/${id}`
        );
    }

    createQuestion(
        payload: FeedbackQuestionCreateDto
    ): Observable<FeedbackQuestionDto> {
        return this.http.post<FeedbackQuestionDto>(
            '/api/FeedbackQuestion',
            payload
        );
    }

    updateQuestion(
        id: number | string,
        payload: FeedbackQuestionUpdateDto
    ): Observable<void> {
        return this.http.put<void>(
            `/api/FeedbackQuestion/${id}`,
            payload
        );
    }

    deleteQuestion(id: number | string): Observable<void> {
        return this.http.delete<void>(
            `/api/FeedbackQuestion/${id}`
        );
    }
}