import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TranslatePipe } from '@ngx-translate/core';
import { Spinner } from '../../../shared/ui/spinner/spinner';
import { UsersService } from '../../../core/services/users.service';
import { Roles } from '../../../core/enums/roles.enum';
import { UserCreateDto, UserUpdateDto } from '../../../core/models/user.model';
import { InputPasswordModule } from 'primeng/inputpassword';

@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [
    InputPasswordModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    CardModule,
    MessageModule,
    TranslatePipe,
    Spinner
  ],
  templateUrl: './user-form.html'
})
export class UserForm implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);

  router = inject(Router);
  private route = inject(ActivatedRoute);

  roles = [
    { label: 'admin', value: Roles.Admin },
    { label: 'kitchenStaff', value: Roles.KitchenStaff },
    { label: 'billingStaff', value: Roles.BillingStaff },
    { label: 'feedbackStaff', value: Roles.FeedBackStaff }
  ];

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: [''],
    email: ['', Validators.email],
    phone: [''],
    role: [Roles.Admin, Validators.required]
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
    this.id.set(parseInt(id));

    this.isEdit.set(true);

    this.usersService.getUser(id).subscribe({
      next: user => {
        this.form.patchValue({
          username: user.username,
          email: user.email ?? '',
          phone: user.phone ?? '',
          role: user.role.id
        });

        this.loading.set(false);
      },
      error: error => {
        this.errorMessage.set(error.error?.message ?? '');
        this.loading.set(false);
      }
    });
  }

  onSubmit() {
    this.errorFields.set(null);
    const data = this.form.getRawValue();
    let callApi;
    if (this.isEdit()) {
      callApi = this.usersService.updateUser(this.id(), data as UserUpdateDto);

    } else {
      callApi = this.usersService.createUser(data as UserCreateDto);
    }

    callApi.subscribe({
      next: () => {
        this.router.navigate(['/dashboard/users']);
      },
      error: error => {
        this.errorFields.set(error.error?.errors ?? {});
        this.errorMessage.set(error.error?.message ?? '');

      }
    });

  }
}