import {Component, OnInit, OnDestroy} from '@angular/core';
import {coerceNumberProperty} from "@angular/cdk/coercion";
import {newArray} from "@angular/compiler/src/util";

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
  validLogin = false;
  errorMessage: string;

  guid = 'a8961058-a6ee-4d71-b325-9aca83b22237';
  log = 'Application is running';
  xmlrequest: XMLHttpRequest;
  params: string;

  dataRefreshTime = 0.5; //in mins
  intervalOfStatusReq;
  data: number[] = Array<number>();

  ngOnInit() {
    this.sendRequest(true);
    this.intervalOfStatusReq = setInterval(() => {


      console.log('Initial: '+ this.data);

      try{
        let random = this.getRandomInt(0,1);
        console.log(random);
        if(random < 1){
          // lalala();
        }
        else {
          for(let i = 0; i < 5; i++){
            this.data[i] = this.getRandomInt(1,10);
          }
        }
        console.log(this.data);
        this.log = 'APP_OK: Created array contains '+ this.data;
        console.log(this.log);
        this.sendRequest(true);
      } catch (e) {
        console.log(e);
        this.log = 'APP_ERROR: '+ e + ' '+ e.stack;
        console.log(this.log);
        this.sendRequest(false);

      }

    }, this.dataRefreshTime * 60000);

  }

  ngOnDestroy() {
    if (this.intervalOfStatusReq)
      clearInterval(this.intervalOfStatusReq);
  }

  logInto() {
    this.indexOfLogins = this.logins.indexOf(this.login);
    this.indexOfPasswords = this.passwords.indexOf(this.password);
    console.log(this.login);
    console.log(this.indexOfLogins);
    console.log(this.password);
    console.log(this.indexOfPasswords);

    if (this.login != '' && this.password != '') {
      if (this.indexOfLogins == -1 && this.indexOfPasswords == -1) {
        this.invalidLogin = true;
        this.validLogin = false;
        this.errorMessage = 'Invalid login or password';
        this.log = `Invalid login or password (login: ${this.login}, password: ${this.password})`;
        this.sendRequest(false);
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
          this.sendRequest(false);
        }
      }
    } else {
      this.invalidLogin = true;
      this.validLogin = false;
      this.errorMessage = 'Both fields are required';
    }
  }

  sendRequest(status: boolean) {
    this.xmlrequest = new XMLHttpRequest();
    this.params = `<?xml version="1.0" encoding="utf-8"?>
                      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                                     xmlns:std="http://prktices6.pl/serwis">
                        <soap:Body>
                          <std:sendStatus>
                            <guid>${this.guid}</guid>
                            <status>${status}</status>
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

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
