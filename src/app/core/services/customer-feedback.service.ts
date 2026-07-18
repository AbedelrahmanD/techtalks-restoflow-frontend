import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CustomerFeedbackQuestion,
  FeedbackSessionCreateDto,
  FeedbackSubmissionResponse
} from '../models/customer-feedback.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerFeedbackService {
  private readonly http = inject(HttpClient);

  getActiveQuestions(): Observable<CustomerFeedbackQuestion[]> {
    return this.http.get<CustomerFeedbackQuestion[]>(
      '/api/customer-feedback/questions'
    );
  }

  submitFeedback(
    payload: FeedbackSessionCreateDto
  ): Observable<FeedbackSubmissionResponse> {
    return this.http.post<FeedbackSubmissionResponse>(
      '/api/FeedbackSession',
      payload
    );
  }
}