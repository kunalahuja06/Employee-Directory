import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserManager, User, UserManagerSettings } from 'oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userManager: UserManager;
  private _user: User | null ;
  private _loginChangedSubject = new Subject<boolean>();
  public loginChanged = this._loginChangedSubject.asObservable();

  private get idpSettings(): UserManagerSettings {
    return {
      authority: 'https://localhost:5001',
      client_id: 'angular-client',
      redirect_uri: 'http://localhost:4200/signin-callback',
      scope: "openid profile EmployeeAPI.read",
      response_type: "code",
      post_logout_redirect_uri: 'http://localhost:4200/signout-callback'
    }
  }


  constructor() {
    this._userManager = new UserManager(this.idpSettings);
  }


  public login = () => {
    return this._userManager.signinRedirect();
  }

  public isAuthenticated = async (): Promise<boolean> => {
    return this._userManager.getUser()
      .then((user: any) => {
        if (this._user !== user) {
        this._loginChangedSubject.next(this.checkUser(user));
        }
        this._user = user;

        return this.checkUser(user);
      })
  }
  private checkUser = (user: User): boolean => {
    return !!user && !user.expired;
  }
  public finishLogin = (): Promise<User> => {
    return this._userManager.signinRedirectCallback()
      .then(user => {
        this._user = user;
        this._loginChangedSubject.next(this.checkUser(user));
        return user;
      })
  }
  public logout = () => {
    this._user= null;
    this._userManager.signoutRedirect();
  }
  public finishLogout = () => {
    return this._userManager.signoutRedirectCallback();
  }
}