import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.isLoggedInSubject.asObservable();
  constructor() { }
  loginvalue() {
    this.isLoggedInSubject.next(true);
  }
   
  logout() {
    this.isLoggedInSubject.next(false);
  }
}
