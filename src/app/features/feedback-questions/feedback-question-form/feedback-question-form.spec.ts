import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackQuestionForm } from './feedback-question-form';

describe('FeedbackQuestionForm', () => {
  let component: FeedbackQuestionForm;
  let fixture: ComponentFixture<FeedbackQuestionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackQuestionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackQuestionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
