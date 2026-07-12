import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackQuestionsList } from './feedback-questions-list';

describe('FeedbackQuestionsList', () => {
  let component: FeedbackQuestionsList;
  let fixture: ComponentFixture<FeedbackQuestionsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackQuestionsList],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackQuestionsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
