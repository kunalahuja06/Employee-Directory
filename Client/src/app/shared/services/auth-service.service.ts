import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserManager, User, UserManagerSettings } from 'oidc-client';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userManager: UserManager;
  private _user: User | null;
  private _loginChangedSubject = new Subject<boolean>();
  public loginChanged = this._loginChangedSubject.asObservable();

  private get idpSettings(): UserManagerSettings {
    return {
      authority: 'https://localhost:5001',
      client_id: 'AddressBook_User',
      redirect_uri: 'http://localhost:4200/signin-callback',
      scope: "openid profile EmployeeAPI.read EmployeeAPI.write roles email",
      response_type: "code",
      post_logout_redirect_uri: 'http://localhost:4200/signout-callback',
      automaticSilentRenew: true,
      silent_redirect_uri: 'http://localhost:4200/assets/silent-callback.html'
    }
  }

  constructor(private router: Router) {
    this._userManager = new UserManager(this.idpSettings);
    this._userManager.events.addAccessTokenExpired(_ => {
    this._loginChangedSubject.next(false);
    });
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
    this._userManager.signoutRedirect();
  }

  public finishLogout = () => {
    this._user = null;
    this._loginChangedSubject.next(false);
    return this._userManager.signoutRedirectCallback();
  }

  public getAccessToken = (): Promise<string> => {
    return this._userManager.getUser()
      .then((user: any) => {
        return !!user && !user.expired ? user.access_token : null;
      })
  }

  public getUser = (): Promise<User> => {
    return this._userManager.getUser()
      .then((user: any) => {
        console.log(user);
        return !!user && !user.expired ? user : null;
      })
  }
  
  public checkIfUserIsAdmin = (): Promise<boolean> => {
    return this._userManager.getUser()
      .then(user => {
        return user?.profile['role'] == 'Admin';
      })
  }
  public getEmail = (): Promise<string | undefined> => {
    return this._userManager.getUser()
      .then(user => {
        return user?.profile['email'];
      })
  }

}