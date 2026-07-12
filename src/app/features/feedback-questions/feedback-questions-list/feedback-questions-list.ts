import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SortIcon, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Pencil } from '@primeicons/angular/pencil';
import { Trash } from '@primeicons/angular/trash';
import { MessageModule } from 'primeng/message';

import { FeedbackQuestionsService } from '../../../core/services/feedback-questions.service';
import { FeedbackQuestionDto } from '../../../core/models/feedback-question.model';
import { DataTable } from '../../../shared/ui/data-table/data-table';
import { TABLE_DEFAULTS } from '../../../shared/config/table.config';

@Component({
    standalone: true,
    selector: 'app-feedback-questions-list',
    imports: [
        DataTable,
        TableModule,
        ButtonModule,
        TagModule,
        Pencil,
        Trash,
        TranslatePipe,
        SortIcon,
        MessageModule
    ],
    templateUrl: './feedback-questions-list.html',
    styleUrl: './feedback-questions-list.css'
})
export class FeedbackQuestionsList implements OnInit {
    private feedbackQuestionsService = inject(FeedbackQuestionsService);
    private router = inject(Router);
    private translate = inject(TranslateService);

    protected readonly tableConfig = TABLE_DEFAULTS;

    questions = signal<FeedbackQuestionDto[]>([]);
    loading = signal(true);
    errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        this.loadQuestions();
    }

    loadQuestions(): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.feedbackQuestionsService.listQuestions().subscribe({
            next: questions => {
                this.questions.set(questions);
                this.loading.set(false);
            },
            error: error => {
                this.errorMessage.set(
                    error.error?.message ?? 'Error loading feedback questions'
                );

                this.loading.set(false);
            }
        });
    }

    navigateToNew(): void {
        this.router.navigate(['/dashboard/feedback-questions/new']);
    }

    navigateToEdit(id: number | string): void {
        this.router.navigate(['/dashboard/feedback-questions/edit', id]);
    }

    deleteQuestion(id: number | string): void {
        const confirmed = confirm(
            this.translate.instant('deleteFeedbackQuestionConfirm')
        );

        if (!confirmed) {
            return;
        }

        this.feedbackQuestionsService.deleteQuestion(id).subscribe({
            next: () => {
                this.loadQuestions();
            },
            error: error => {
                this.errorMessage.set(
                    error.error?.message ?? 'Error deleting feedback question'
                );
            }
        });
    }
}