import {Component, OnInit, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  logins: string[] = ['login', 'login2', 'login3', 'login4'];
  passwords: string[] = ['pass', 'pass2', 'pass3', 'pass4'];

  login: string = '';
  password: string = '';
  hide = true;
  indexOfLogins: number;
  indexOfPasswords: number;

  invalidLogin: boolean;
  validLogin = true;
  errorMessage: string;

  guid = 'a8961058-a6ee-4d71-b325-9aca83b22237';
  log = 'Application is running';
  xmlrequest: XMLHttpRequest;
  params: string;

  dataRefreshTime = 5; //in mins
  intervalOfStatusReq;

  ngOnInit() {
    this.sendStatusRequest();
    this.intervalOfStatusReq = setInterval(() => this.sendStatusRequest(), this.dataRefreshTime*60000);
  }

  ngOnDestroy() {
    if(this.intervalOfStatusReq)
      clearInterval(this.intervalOfStatusReq);
  }

  logInto() {
    this.indexOfLogins = this.logins.indexOf(this.login);
    this.indexOfPasswords = this.passwords.indexOf(this.password);
    console.log(this.login);
    console.log(this.indexOfLogins);
    console.log(this.password);
    console.log(this.indexOfPasswords);

    if(this.login != '' && this.password != ''){
      if (this.indexOfLogins == -1 && this.indexOfPasswords == -1) {
        this.invalidLogin = true;
        this.validLogin = false;
        this.errorMessage = 'Invalid login or password';
        this.log = `Invalid login or password (login: ${this.login}, password: ${this.password})`;
        this.sendErrorRequest();
      } else {
        if (this.indexOfLogins == this.indexOfPasswords) {
          this.invalidLogin = false;
          this.validLogin = true;
          this.errorMessage = 'LOGGED IN';
          this.login = '';
          this.password = '';
        } else {
          this.invalidLogin = true;
          this.validLogin = false;
          this.errorMessage = 'Invalid login or password';
          this.log = `Invalid login or password (login: ${this.login}, password: ${this.password})`;
          this.sendErrorRequest();
        }
      }
    } else {
      this.invalidLogin = true;
      this.validLogin = false;
      this.errorMessage = 'Both fields are required';
    }
  }

  sendStatusRequest(){
    this.xmlrequest = new XMLHttpRequest();
    this.params = `<?xml version="1.0" encoding="utf-8"?>
                      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                                     xmlns:std="http://prktices6.pl/serwis">
                        <soap:Body>
                          <std:sendStatus>
                            <guid>${this.guid}</guid>
                            <status>${this.validLogin}</status>
                            <log>${this.log}</log>
                          </std:sendStatus>
                        </soap:Body>
                      </soap:Envelope>`;

    this.xmlrequest.open("POST",
      "http://localhost:9090/ws/applicationStatus");

    this.xmlrequest.setRequestHeader('Content-type',
      'text/xml');

    this.xmlrequest.send(this.params);

  }

  sendErrorRequest(){
    this.xmlrequest = new XMLHttpRequest();
    this.params = `<?xml version="1.0" encoding="utf-8"?>
                      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                                     xmlns:std="http://prktices6.pl/serwis">
                        <soap:Body>
                          <std:sendError>
                            <guid>${this.guid}</guid>
                            <log>${this.log}</log>
                          </std:sendError>
                        </soap:Body>
                      </soap:Envelope>`;

    this.xmlrequest.open("POST",
      "http://localhost:9090/ws/applicationError");

    this.xmlrequest.setRequestHeader('Content-type',
      'text/xml');

    this.xmlrequest.send(this.params);

  }
}
