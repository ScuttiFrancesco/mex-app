import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  InputInputEventDetail,
  IonInputCustomEvent,
  IonSelectCustomEvent,
  SelectChangeEventDetail,
} from '@ionic/core';
import { Contact } from 'src/app/models/Contact';
import { ContactService } from 'src/app/services/contact.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-insert-contact',
  templateUrl: './insert-contact.page.html',
  styleUrls: ['./insert-contact.page.scss'],
  standalone: false,
})
export class InsertContactPage implements OnInit {
  errorMex = '';
  registrationFormGroup: FormGroup;
  contacts: Contact[] = [];
  hideListItem = false;
  constructor(
    private contactService: ContactService,
    private router: Router,
    private toastService: ToastService,
    private formBuilder: FormBuilder
  ) {
    this.registrationFormGroup = formBuilder.group({
      id: ['', Validators.required],
      nickname: [''],
    });
  }

  ngOnInit() {
    this.contactService.contactList.subscribe((contacts) => {
      this.contacts = contacts;
    });
    console.log(this.contacts);
  }

  selectContact(username: string) {
    this.registrationFormGroup.controls['id'].setValue(username);
    this.hideListItem = true;
  }

  filteredContacts: Contact[] = [];
  onSearchContact(event: any) {
    this.hideListItem = false;
    const searchTerm = event.target.value;
    console.log(searchTerm);
    if (searchTerm && searchTerm.trim() !== '') {
      this.filteredContacts = this.contacts.filter(
        (contact) =>
          contact.username.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      );
    } else {
      this.filteredContacts = [...this.contacts];
    }
  }

  insertContact() {
    if (this.registrationFormGroup.valid) {
      const id = Math.floor(Math.random() * 51);
      console.log(id);
      const nickname = this.registrationFormGroup.value.nickname;
      this.contactService.insertContact(id, nickname).subscribe(
        (response: any) => {
          if (!response.success) {
            this.errorMex = response.errorMessage;
            return;
          }
          this.toastService.presentToast(
            'Contact added successfully',
            'success',
            1000
          );
          this.router.navigate(['home']);
        },
        (error) => {
          this.toastService.presentToast(error, 'success', 1000);
        }
      );
    }
  }

  get formControlli() {
    return this.registrationFormGroup!.controls;
  }
}
