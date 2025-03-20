import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from 'src/app/models/Contact';
import { ContactService } from 'src/app/services/contact.service';
import { ToastService } from 'src/app/services/toast.service';
import * as L from 'leaflet';
import { ViewDidEnter } from '@ionic/angular';
import { Cordinate } from 'src/app/models/Cordinate';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.page.html',
  styleUrls: ['./contact-details.page.scss'],
  standalone: false,
})
export class ContactDetailsPage implements OnInit, ViewDidEnter {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map!: L.Map | undefined;
  contact: Contact | undefined;
  contactId: number | undefined;
  img: string = '';
  lat: number = 41.820172;
  long: number = 12.469372;
  cordinate: Cordinate[] = [];
  constructor(
    private actRoute: ActivatedRoute,
    private contactService: ContactService,
    private router: Router,
    private toastService: ToastService
  ) {}
  ionViewDidEnter(): void {
    this.getCordinate();
    this.getLeaFletMap();
  }

  getCordinate() {
    if (localStorage.getItem(`${this.contact?.username}-cordinate`)) {
      this.cordinate = JSON.parse(
        localStorage.getItem(`${this.contact?.username}-cordinate`)!
      );
      const cordinata = this.cordinate.find(
        (c) => c.sender === this.contact!.username
      );
      console.log(cordinata);
      console.log(this.cordinate);
      if (cordinata!.lat && cordinata!.long) {
        this.lat = cordinata!.lat;
        this.long = cordinata!.long;
      }
    }
  }

  refresh(event: any) {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    this.getCordinate();
    this.getLeaFletMap();
    event.target.complete();
  }

  getLeaFletMap() {
    if (!this.mapContainer || !this.mapContainer.nativeElement) {
      console.error('Elemento contenitore della mappa non trovato.');
      return;
    }
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [this.lat, this.long],
      zoom: 13,
    });
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/images/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/images/marker-icon.png',
      shadowUrl: 'assets/leaflet/images/marker-shadow.png',
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);
    L.marker([this.lat, this.long]).addTo(this.map);
  }

  ngOnInit() {
    this.contactId = parseInt(this.actRoute.snapshot.paramMap.get('id')!);
    this.getContact(this.contactId);
    this.getImage(this.contactId);
  }

  getContact(id: number) {
    this.contactService.getContact(id).subscribe((data: any) => {
      this.contact = data.data;
    });
  }

  getImage(id: number) {
    this.contactService.getImage(id).subscribe((data: Blob) => {
      this.img = URL.createObjectURL(data);
      this.contact!.immagineProfilo = this.img;
    });
  }

  deleteContact(id: number) {
    this.contactService.deleteContact(id).subscribe({
      next: (data) => {
        this.toastService.presentToast(
          'Contact deleted successfully',
          'success',
          1000
        );

        this.router.navigate(['home']);
      },
      error: (error) => {
        this.toastService.presentToast(error, 'danger', 3000);
      },
    });
  }

  updateContact(userId: number, nickname: string) {
    this.router.navigate(['update-contact', userId]);
  }
}
