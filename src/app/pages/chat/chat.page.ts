import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewDidEnter } from '@ionic/angular';
import { switchMap, tap, of, fromEvent } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Contact } from 'src/app/models/Contact';
import { Messaggio } from 'src/app/models/Messaggio';
import { ContactService } from 'src/app/services/contact.service';
import { DataService } from 'src/app/services/data.service';
import { MqttsService } from 'src/app/services/mqtt.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatPage implements OnInit, ViewDidEnter {
  contacts: Contact[] = [];
  contact: Contact | undefined;
  contactId: number | undefined;
  img: string = '';
  contactUsername: string = '';
  messages: Messaggio[] = [];
  myUsername = 'francesco.scutti';
  testo: string = '';
  showAttach: boolean = false;
  photo: string = '';
  mex: Messaggio = {
    message: '',
    senderId: '',
    reciever: '',
    date: new Date(),
    fileAudio: '',
    fileVideo: '',
    fileImg: null,
  };

  constructor(
    private actRoute: ActivatedRoute,
    private contactService: ContactService,
    private router: Router,
    private mqttService: MqttsService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private appComp: AppComponent
  ) {}

  ionViewDidEnter(): void {
    this.contactId = parseInt(this.actRoute.snapshot.paramMap.get('id')!);
    this.loadContactAndImage(this.contactId);
    this.contactService.getContact(this.contactId).subscribe((c: any) => {
      this.contactUsername = c.data.username;
      if (localStorage.getItem(`${this.contactUsername}`)) {
        this.messages = JSON.parse(
          localStorage.getItem(`${this.contactUsername}`)!
        );
      }
      console.log(this.messages);
      console.log(this.contactUsername);
      this.appComp.message$.subscribe((mex) => {
        if (
          mex.senderId === this.contactUsername ||
          mex.reciever === this.contactUsername
        ) {
          this.messages = [...this.messages, mex];

          this.cdr.detectChanges();
        }
      });
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {}

  loadContactAndImage(id: number) {
    this.contactService
      .getContact(id)
      .pipe(
        switchMap((contactData: any) => {
          this.contact = contactData.data;
          if (this.contact) {
            return this.contactService.getImage(id).pipe(
              tap((imageBlob) => {
                this.img = URL.createObjectURL(imageBlob);
                this.contact!.immagineProfilo = this.img;
              })
            );
          } else {
            console.log('Contatto non trovato con ID:', id);
            return of(null);
          }
        })
      )
      .subscribe(
        () => {
          console.log('Contatto e immagine caricati per ID:', id);
          this.cdr.detectChanges();
        },
        (error) => {
          console.log(
            'Errore nel caricamento del contatto e/o immagine:',
            error
          );
          this.cdr.detectChanges();
        }
      );
  }

  contactDetails(id: number) {
    this.router.navigate(['contact-details', id]);
  }

  send(form: NgForm) {
    const topic = `chat/messages/${this.contactUsername.replace(
      '.',
      '_'
    )}/${this.myUsername.replace('.', '_')}`;
    const text = form.value.text;
    this.mex!.message = text;
    this.mex!.senderId = this.myUsername;
    this.mex!.reciever = this.contactUsername;
    this.mex!.date = new Date();
    this.mex!.fileImg = this.photo;
    this.mqttService.topicPublish(topic, JSON.stringify(this.mex));

    localStorage.setItem(
      `${this.contactUsername}`,
      JSON.stringify(this.messages)
    );
    this.testo = '';
  }

  attach() {
    this.showAttach = !this.showAttach;
  }

  loadImg(form: NgForm) {
    const id = form.value.id;

    this.contactService.getImage(id).subscribe({
      next: (imageBlob) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          if (fileReader.result) {
            this.photo = fileReader.result as string; // Store as Base64 string
            this.toastService.presentToast(
              'Immagine caricata con successo',
              'success',
              1000
            );
          }
        };
        fileReader.readAsDataURL(imageBlob); // Read as Data URL (Base64)
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.toastService.presentToast(error, 'danger', 2000);
      },
    });
    this.showAttach = false;
  }

  color: string = 'black';
  height: number = 0;
  width: number = 0;
  index: number = 0;
  changeColorSize() {
    const colors = [
      'black',
      'red',
      'green',
      'blue',
      'yellow',
      'orange',
      'purple',
    ];
    const heights = [10, 15, 20, 25, 30, 40, 50];
    const widths = [10, 15, 20, 25, 30, 40, 50];
    this.height = heights[this.index];
    this.width = widths[this.index];
    this.color = colors[this.index];
    this.index = (this.index + 1) % colors.length;
    console.log(this.color, this.height, this.width);
  }

  clickEvents: ColorClick[] = [];
  clicks$ = fromEvent<PointerEvent>(document, 'click').subscribe((event) => {
    this.changeColorSize();
    this.clickEvents = [
      ...this.clickEvents,
      { event, color: this.color, height: this.height, width: this.width },
    ];
    this.cdr.detectChanges();
  });

  private dataService : DataService = inject(DataService);
  modaleMex1?: string = this.dataService.message().get(1);
  modaleMex2?: string = this.dataService.message().get(2);
}

interface ColorClick {
  event: PointerEvent;
  color: string;
  width: number;
  height: number;
}
