import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedbackReport } from '../models/feedback-report.model';

@Injectable({
  providedIn: 'root',
})
export class FeedbackReportService {
  private readonly http = inject(HttpClient);

  getReport(): Observable<FeedbackReport> {
    return this.http.get<FeedbackReport>('/api/FeedbackReport');
  }
}