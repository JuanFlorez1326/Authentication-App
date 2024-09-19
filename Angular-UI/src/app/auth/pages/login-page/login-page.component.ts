import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {

  private router      = inject(Router);
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  
  public loginForm: FormGroup = this.fb.group({
    email:    ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required, Validators.minLength(6) ]]
  });

  public login() {
    const { email, password } = this.loginForm.value;
    this.authService.login( email, password ).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (message) => Swal.fire('Error', message, 'error')
    });
  }
}