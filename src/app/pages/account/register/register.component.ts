import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  isSubmit: boolean = false;

  constructor(private formBuilder: FormBuilder, public authService: AuthenticationService, private toastr: ToastrService, public router: Router, private zone: NgZone) {
    this.createRegisterForm();
   }

  ngOnInit(): void {
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstname: ['',[ Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
    }, {validator: this.pwdMatchValidator})
  }

  pwdMatchValidator(frm: FormGroup) {
    return frm.get('password').value === frm.get('cpassword').value
       ? null : {mismatch: true};
  }
  
  // convenience getter for easy access to form fields
  get get() { return this.registerForm.controls; }

  onSubmit() {
    this.isSubmit = true;
    if(this.registerForm.invalid)
      return false;
  if(this.registerForm.valid)
    this.authService.register(this.registerForm.value).subscribe((response) => {
      
      if(response['status'] == true){
        this.zone.run( () => this.router.navigateByUrl('/login'));
        this.toastr.success(response['message']);
      }     
      
    }, (error) => {
      console.log('error', error);
      this.toastr.error( error.error['message'] );
    })
  }
}
