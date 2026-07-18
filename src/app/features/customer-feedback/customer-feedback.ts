import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { CustomerFeedbackQuestion } from '../../core/models/customer-feedback.model';
import { RestaurantSettingsDto } from '../../core/models/menu.model';
import { CustomerFeedbackService } from '../../core/services/customer-feedback.service';
import { MenuService } from '../../core/services/menu.service';
import { MenuItemImagePipe } from '../../shared/pipes/menu-item-image.pipe';

@Component({
  selector: 'app-customer-feedback',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    MenuItemImagePipe
  ],
  templateUrl: './customer-feedback.html',
  styleUrl: './customer-feedback.css'
})
export class CustomerFeedback implements OnInit {
  private readonly feedbackService = inject(CustomerFeedbackService);
  private readonly menuService = inject(MenuService);
  private readonly translate = inject(TranslateService);

  loading = signal(true);
  submitting = signal(false);
  submittedSuccessfully = signal(false);

  errorMessage = signal<string | null>(null);
  validationMessage = signal<string | null>(null);

  settings = signal<RestaurantSettingsDto | null>(null);
  questions = signal<CustomerFeedbackQuestion[]>([]);

  ratings = signal<Record<number, number>>({});

  customerPhone = '';
  customerNote = '';

  readonly ratingValues = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.loadRestaurantSettings();
    this.loadQuestions();
  }

  loadRestaurantSettings(): void {
    this.menuService.getMenu().subscribe({
      next: (response) => {
        this.settings.set(response.settings);
      },
      error: () => {
        // The feedback page can still work if restaurant settings fail.
      }
    });
  }

  loadQuestions(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.feedbackService.getActiveQuestions().subscribe({
      next: (questions) => {
        this.questions.set(questions);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          this.translate.instant('feedbackLoadError')
        );

        this.loading.set(false);
      }
    });
  }

  setRating(questionId: number, rating: number): void {
    this.ratings.update((currentRatings) => ({
      ...currentRatings,
      [questionId]: rating
    }));

    this.validationMessage.set(null);
  }

  getRating(questionId: number): number {
    return this.ratings()[questionId] ?? 0;
  }

  isRatingSelected(questionId: number, rating: number): boolean {
    return this.getRating(questionId) >= rating;
  }

  areAllQuestionsRated(): boolean {
    return this.questions().every(
      (question) => this.getRating(question.id) > 0
    );
  }

  submitFeedback(): void {
    if (this.submitting()) {
      return;
    }

    if (!this.areAllQuestionsRated()) {
      this.validationMessage.set(
        this.translate.instant('feedbackRatingRequired')
      );

      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.validationMessage.set(null);

    const payload = {
      customerPhone: this.customerPhone.trim() || null,
      customerNote: this.customerNote.trim() || null,
      responses: this.questions().map((question) => ({
        questionId: question.id,
        rating: this.getRating(question.id)
      }))
    };

    this.feedbackService.submitFeedback(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submittedSuccessfully.set(true);
      },
      error: () => {
        this.submitting.set(false);

        this.errorMessage.set(
          this.translate.instant('feedbackSubmitError')
        );
      }
    });
  }

  submitAnotherFeedback(): void {
    this.ratings.set({});
    this.customerPhone = '';
    this.customerNote = '';

    this.errorMessage.set(null);
    this.validationMessage.set(null);
    this.submittedSuccessfully.set(false);
  }
}