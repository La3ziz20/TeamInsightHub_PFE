import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UserDto } from 'src/app/dtos/user.dto';
@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
})
export class FormUserComponent implements OnInit {
  connectedUserId!: string;
  User!: UserDto;
  UserForm!: FormGroup;
  submitted = false;

  breadcrumbList = [{ title: 'Profile', path: '/profile' }];

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['id']) {
        this.connectedUserId = params['id'];
        this.getUserById(params['id']);
      }
    });
    const breadcrumb = {
      title: 'Edit',
      path: '/profile/edit?id=' + this.connectedUserId,
    };
    this.breadcrumbList.push(breadcrumb);
  }

  getController(controllerName: string): AbstractControl {
    return this.UserForm.controls[controllerName];
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.UserForm = this.fb.group({
      firstname: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],
      ],
      lastname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      certificate: ['', [Validators.required]],
      skils: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    });
  }

  save(): void {
    this.submitted = true;
    if (this.UserForm.valid) {
      this.updateUser();
    }
  }

  cancel(): void {
    this.router.navigate(['profile']);
  }

  updateUser() {
    this.userService.updateUser(this.User, this.User.id).subscribe(
      (updatedUser) => {
        this.toastr.success('User updated successfully', 'Success');
        this.router.navigate(['profile']);
      },
      (error) => {
        this.toastr.error(
          error.error.message || 'An error occurred while updating the user',
          'Error'
        );
      }
    );
  }

  getUserById(id: string) {
    this.userService.getUserById(id).subscribe((value) => {
      this.User = value;
    });
  }
}
