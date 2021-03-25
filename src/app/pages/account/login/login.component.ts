import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../shared/services/authentication.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public authService: AuthenticationService, private toastr: ToastrService, public router: Router, private zone: NgZone) {
    this.createLoginForm();
   }

  ngOnInit(): void {
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: [''],
    })
  }

  onSubmit() {
    let formData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }
    this.authService.login(formData).subscribe((response) => {
      if(response['status'] == true){
        // this.router.navigate(['/home/dashboard']);
        this.zone.run( () => this.router.navigateByUrl('/home/categories'));
        this.toastr.success(response['message']);
      }     
      
    }, (error) => {
      console.log('error', error);
      this.toastr.error( error.error['message'] );
    })
  }
}
