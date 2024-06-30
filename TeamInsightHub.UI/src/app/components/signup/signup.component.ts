import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  passIsNotConfirmed= false;
  user: User = new User();
  signupForm! : UntypedFormGroup;

  constructor( private  fb: FormBuilder , private authService: AuthService , private router : Router,private toastr: ToastrService,) {
    this.signupForm = this.fb.group({

      firstname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      lastname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      skils: ['', [Validators.required]],
      certificate: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]]

    }
    );
  }
  ngOnInit(): void {
    this.listenToPassword();
    this.initializeValues();
  }


  firstnameValue!: string;
  lastnameValue!: string;
  emailValue!: string;
  skilsValue!: string;
  certificateValue!: string;
  addressValue!: string;
  passwordValue!: string;
  confirmpasswordValue!: string;
  phoneValue!: string;


  getController(controllerName: string): AbstractControl{
    return this.signupForm.controls[controllerName];
  }


  listenToPassword(){
    this.getController('password').valueChanges.subscribe(()=>{
      this.checkValidity();
    })
    this.getController('confirmpassword').valueChanges.subscribe(()=>{
      this.checkValidity();
    })
  }

  checkValidity(){
    const passwordInput = this.getController('password').value ;
    const confirmPasswordInput = this.getController('confirmpassword').value ;
    if(passwordInput && passwordInput.length > 0 && confirmPasswordInput && confirmPasswordInput.length > 0){
      this.passIsNotConfirmed = passwordInput != confirmPasswordInput;

    }else{
      this.passIsNotConfirmed = false;
    }
  }

  initializeValues() {

    this.firstnameValue = this.getController('firstname').value;
    this.lastnameValue = this.getController('lastname').value;
    this.emailValue = this.getController('email').value;
    this.skilsValue = this.getController('skils').value;
    this.certificateValue = this.getController('certificate').value;
    this.addressValue = this.getController('address').value;
    this.passwordValue = this.getController('password').value;
    this.confirmpasswordValue = this.getController('confirmpassword').value;
    this.phoneValue = this.getController('phone').value;
  }

 OnSave(){
  this.authService.signUp(this.signupForm.value)
  .subscribe(res => {
    this.toastr.success(this.firstnameValue + " is successfully registered", 'Success');
     this.router.navigate(['/login']);
  }, err => {
    this.toastr.error('Email already exists, please try another one !', 'error');
  });
}
}
