import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  FeedbackQuestionReport,
  FeedbackReport,
} from '../../core/models/feedback-report.model';
import { FeedbackReportService } from '../../core/services/feedback-report.service';

@Component({
  selector: 'app-feedback-report',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './feedback-report.html',
  styleUrl: './feedback-report.css',
})
export class FeedbackReportComponent implements OnInit {
  private readonly feedbackReportService = inject(FeedbackReportService);

  report = signal<FeedbackReport | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  readonly ratingValues = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.feedbackReportService.getReport().subscribe({
      next: (report) => {
        this.report.set(report);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('feedbackReportError');
        this.loading.set(false);
      },
    });
  }

  getRatingCount(
    question: FeedbackQuestionReport,
    rating: number,
  ): number {
    return question.ratingDistribution[String(rating)] ?? 0;
  }

  getRatingPercentage(
    question: FeedbackQuestionReport,
    rating: number,
  ): number {
    if (question.responseCount === 0) {
      return 0;
    }

    return (
      (this.getRatingCount(question, rating) / question.responseCount) * 100
    );
  }
}