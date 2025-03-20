import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewDidEnter } from '@ionic/angular';
import { Contact } from 'src/app/models/Contact';
import { ContactService } from 'src/app/services/contact.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-update-contact',
  templateUrl: './update-contact.page.html',
  styleUrls: ['./update-contact.page.scss'],
  standalone: false,
})
export class UpdateContactPage implements ViewDidEnter {
  userId: number | undefined;
  nickname :string |undefined;
  contact: Contact | undefined;

  constructor(
    private actRoute: ActivatedRoute,
    private contactService: ContactService,
    private router: Router,
    private toastService:ToastService
  ) {}
  ionViewDidEnter(): void {
    this.actRoute.params.subscribe((param) => {
      this.userId = +param['userId'];
      this.nickname = localStorage.getItem(`${this.userId}`)!;
    });
  }

  updateContact(form: NgForm) {
    const userId = form.value.userId;
    const nickname = form.value.nickname;
    localStorage.setItem(`${userId}`, nickname);
    this.contactService.updateContact(userId, nickname).subscribe(
      (data) => {
        this.toastService.presentToast('Contact updated successfully', 'success', 1000)
        this.router.navigate(['home']);
      },
      (error) => {
        this.toastService.presentToast(error, 'danger', 3000)
      }
    );
  }
}
