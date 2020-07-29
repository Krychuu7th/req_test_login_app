import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  logins: string[] = ['login', 'login2', 'login3', 'login4'];
  passwords: string[] = ['pass', 'pass2', 'pass3', 'pass4'];

  login: string = '';
  password: string = '';
  hide = true;
  indexOfLogins: number;
  indexOfPasswords: number;

  invalidLogin: boolean;
  validLogin:boolean;
  errorMessage: string;

  guid = 'a8961058-a6ee-4d71-b325-9aca83b22237';
  xmlrequest: XMLHttpRequest;
  params: string;

  logInto() {
    this.indexOfLogins = this.logins.indexOf(this.login);
    this.indexOfPasswords = this.passwords.indexOf(this.password);
    console.log(this.login);
    console.log(this.indexOfLogins);
    console.log(this.password);
    console.log(this.indexOfPasswords);
    if(this.indexOfLogins == -1 && this.indexOfPasswords == -1){
      this.invalidLogin = true;
      this.validLogin = false;
      this.errorMessage = 'Invalid login or password';
      this.sendRequest();
    } else {
      if (this.indexOfLogins == this.indexOfPasswords) {
        this.login = '';
        this.password = '';
        this.invalidLogin = false;
        this.validLogin = true;
        this.errorMessage = 'LOGGED IN';
        this.sendRequest();
      }
      else {
        this.invalidLogin = true;
        this.validLogin = false;
        this.errorMessage = 'Invalid login or password';
        this.sendRequest();
      }
    }
  }

  sendRequest(){
    this.xmlrequest = new XMLHttpRequest();
    this.params = `<?xml version="1.0" encoding="utf-8"?>
                      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                                     xmlns:std="http://prktices6.pl/serwis">
                        <soap:Body>
                          <std:sendStatus>
                            <guid>${this.guid}</guid>
                            <status>${this.validLogin}</status>
                          </std:sendStatus>
                        </soap:Body>
                      </soap:Envelope>`;

    this.xmlrequest.open("POST",
      "http://localhost:9090/ws/applicationStatus");

    this.xmlrequest.setRequestHeader('Content-type',
      'text/xml');

    this.xmlrequest.send(this.params);

  }
}
