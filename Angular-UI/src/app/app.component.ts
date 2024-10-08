import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  private router = inject(Router);
  private authService = inject(AuthService);

  public finishedAuthCheck = computed<boolean>( () => {
    if (this.authService.authStatus() === AuthStatus.checking) return false;
    return true;
  });

  public authStatusChangedEffect = effect( () => {
    switch(this.authService.authStatus()) {
      case AuthStatus.checking:
        return; 
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard');
        return;
      case AuthStatus.noAuthenticated:
        this.router.navigateByUrl('/auth/login');
        return;
    }
  });

}