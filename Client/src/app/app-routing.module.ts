import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterCallbackComponent } from './components/register-callback/register-callback.component';
import { SigninRedirectCallbackComponent } from './components/signin-redirect-callback/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from './components/signout-redirect-callback/signout-redirect-callback.component';
import { AuthGuard } from './shared/guards/auth.guard';


@NgModule({
  imports: [RouterModule.forRoot([
    {path:'',component:HomeComponent,canActivate:[AuthGuard]},
    {path:'auth',component:AuthComponent},
    {path: 'signin-callback', component: SigninRedirectCallbackComponent },
    {path: 'signout-callback', component: SignoutRedirectCallbackComponent },
    {path: 'register-callback', component: RegisterCallbackComponent },
  ])],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
