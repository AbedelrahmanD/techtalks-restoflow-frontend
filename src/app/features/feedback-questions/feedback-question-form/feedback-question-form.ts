import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { Spinner } from '../../../shared/ui/spinner/spinner';
import { FeedbackQuestionsService } from '../../../core/services/feedback-questions.service';
import {
    FeedbackQuestionCreateDto,
    FeedbackQuestionDto,
    FeedbackQuestionUpdateDto
} from '../../../core/models/feedback-question.model';

@Component({
    standalone: true,
    selector: 'app-feedback-question-form',
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        ToggleSwitchModule,
        CardModule,
        MessageModule,
        TranslatePipe,
        Spinner
    ],
    templateUrl: './feedback-question-form.html',
    styleUrl: './feedback-question-form.css'
})
export class FeedbackQuestionForm implements OnInit {
    private fb = inject(FormBuilder);
    private feedbackQuestionsService = inject(FeedbackQuestionsService);

    router = inject(Router);
    private route = inject(ActivatedRoute);

    form = this.fb.nonNullable.group({
        question: [
            '',
            [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(255)
            ]
        ],
        isActive: [true]
    });

    id = signal(0);
    isEdit = signal(false);
    loading = signal(true);
    saving = signal(false);
    errorMessage = signal<string | null>(null);
    errorFields = signal<any>({});

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            this.loading.set(false);
            return;
        }

        this.id.set(Number(id));
        this.isEdit.set(true);

        this.feedbackQuestionsService.getQuestion(id).subscribe({
            next: question => {
                this.form.patchValue({
                    question: question.question,
                    isActive: question.isActive
                });

                this.loading.set(false);
            },
            error: error => {
                this.errorMessage.set(error.error?.message ?? '');
                this.loading.set(false);
            }
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.saving.set(true);
        this.errorMessage.set(null);
        this.errorFields.set({});

        const rawData = this.form.getRawValue();

        const data = {
            question: rawData.question.trim(),
            isActive: rawData.isActive
        };

       const callApi: Observable<FeedbackQuestionDto | void> = this.isEdit()
    ? this.feedbackQuestionsService.updateQuestion(
          this.id(),
          data as FeedbackQuestionUpdateDto
      )
    : this.feedbackQuestionsService.createQuestion(
          data as FeedbackQuestionCreateDto
      );

        callApi.subscribe({
            next: () => {
                this.router.navigate(['/dashboard/feedback-questions']);
            },
            error: error => {
                this.errorFields.set(error.error?.errors ?? {});
                this.errorMessage.set(error.error?.message ?? '');
                this.saving.set(false);
            }
        });
    }
}