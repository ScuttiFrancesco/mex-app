import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Contact } from '../models/Contact';
import { ContactService } from './contact.service';
import { catchError, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  contacts: Contact[] | undefined;
  errorMex: string = '';

  constructor(
    private toastController: ToastController,
    private contactService: ContactService,
    private router: Router
  ) {
    this.loadContacts();
  }  

  loadContacts() {
    this.contactService.contactList.subscribe(
      (contacts) => (this.contacts = contacts)
    );
  }

  async presentToast(
    errorMessage: string,    
    color: string,
    durata: number
  ) {    
    const toast = await this.toastController.create({
      message: `${errorMessage}`,
      duration: durata,
      position: 'bottom',
      color: color,      
    });
    await toast.present();
  }

  async presentToastMex(
    errorMessage: string,
    username: string,
    color: string,
    durata: number
  ) {
    const id = this.contacts?.find((c) => c.username === username)?.id;
    const toast = await this.toastController.create({
      message: `${errorMessage}`,
      duration: durata,
      position: 'bottom',
      color: color,
      buttons: [
        {
          text: 'Apri Chat',
          handler: () => {
            this.router.navigate(['contact-details', id]);
          },
        },
      ],
    });
    await toast.present();
  }
}
