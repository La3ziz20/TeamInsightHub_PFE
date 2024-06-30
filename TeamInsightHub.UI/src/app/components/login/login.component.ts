import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: UntypedFormGroup;

  constructor(private fb : FormBuilder,private authService: AuthService ,private router : Router,private toastr: ToastrService,) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }



  Login() {
    const loginDto = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.authService.login(loginDto).subscribe(
      response => {
        this.toastr.success('Login successfull', 'Succes');
        location.reload();
      },
      error => {
        this.toastr.error('Password or Email is incorrect!', 'Error');
      }
    );
  }
}
