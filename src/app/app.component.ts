import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MqttsService } from './services/mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { catchError, Observable, Subject, Subscription, tap } from 'rxjs';
import { Contact } from './models/Contact';
import { Messaggio } from './models/Messaggio';
import { ContactService } from './services/contact.service';
import { ToastService } from './services/toast.service';
import { Cordinate } from './models/Cordinate';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  contacts: Contact[] | undefined;
  contact: Contact | undefined;
  private messageSubject = new Subject<Messaggio>(); // Crea un Subject per i messaggi
  message$ = this.messageSubject.asObservable();

  cordinates: Cordinate[] = [];
  contactUsername: string = '';
  messages: Messaggio[] = [];
  myUsername = 'francesco.scutti';
  mex: Messaggio = {
    message: '',
    senderId: '',
    reciever: '',
    date: new Date(),
    fileAudio: '',
    fileVideo: '',
    fileImg: '',
  };
  errorMex: string = '';

  constructor(
    public router: Router,
    private mqttService: MqttsService,
    private contactService: ContactService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.detectMqtt();
    this.detectMqttCordinate();
  }
  /* 
  loadContacts() {
    const contactsObservable = this.contactService.getContactList().pipe(
      catchError((error) => {
        this.errorMex = error.message;
        return [];
      })
    );
    contactsObservable.subscribe((contacts) => {
      this.contacts = this.contactService.contactList;            
    });
  } */

  loadContacts() {
    this.contactService.contactList.subscribe(
      (contacts) => (this.contacts = contacts)
    );
  }

  detectMqtt() {
    const topic = `chat/messages/#`;
    this.mqttService.topicSubscribe(topic).subscribe({
      next: (message: IMqttMessage) => {
        const paidLoad: Messaggio = JSON.parse(message.payload.toString());
        paidLoad.date = new Date();
        this.messages.push(paidLoad);
        this.messageSubject.next(paidLoad);
        console.log('img: ', paidLoad.fileImg);
        localStorage.setItem(
          `${paidLoad.senderId}`,
          JSON.stringify(this.messages)
        );
        if (paidLoad.senderId !== this.myUsername) {
          this.toastService.presentToastMex(
            `${paidLoad.senderId}: ${paidLoad.message}`,
            `${paidLoad.senderId}`,
            'light',
            2000
          );
        }
      },
      error: (error: Error) => {
        this.toastService.presentToast(error.message, 'danger', 2000);
      },
    });
  }

  detectMqttCordinate() {
    const topic = `cordinate/#`;
    this.mqttService.topicSubscribe(topic).subscribe({
      next: (message: IMqttMessage) => {
        const paidLoad: Cordinate = JSON.parse(message.payload.toString());
        this.cordinates.push(paidLoad);
        localStorage.setItem(
          `${paidLoad.sender}-cordinate`,
          JSON.stringify(this.cordinates)
        );

        this.toastService.presentToastMex(
          `${paidLoad.sender} ha inviato nuove cordinate`,
          `${paidLoad.sender}`,
          'light',
          2000
        );
      },
      error: (error: Error) => {
        this.toastService.presentToast(error.message, 'danger', 2000);
      },
    });
  }
}
