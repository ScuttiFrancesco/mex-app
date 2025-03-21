import {
  Component,
  ComponentRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Contact } from '../models/Contact';
import { ContactService } from '../services/contact.service';
import { Router } from '@angular/router';
import {
  IonSearchbar,
  LoadingController,
  ViewDidEnter,
  ViewDidLeave,
  ViewWillEnter,
} from '@ionic/angular';
import { ModalComponent } from '../components/modal/modal.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage
  implements ViewDidEnter, ViewWillEnter, OnInit, ViewDidLeave
{
  contacts: Contact[] = [];
  contactsImg: Contact[] = [];
  img: string = '';
  searchInput: string = '';

  @ViewChild('headerTitle', { static: false }) titleElement:
    | ElementRef
    | undefined;

  @ViewChild('searchBar', { static: false }) searchBar:
    | IonSearchbar
    | undefined;

  private colors = ['black', 'green', 'blue', 'orange', 'purple', 'pink'];
  btn: any;
  primary: any;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private loadinCtl: LoadingController
  ) {}

  ionViewDidLeave(): void {
    this.showSearchInput = false;
    this.searchInput = '';
    this.modal?.destroy();
  }

  searchInputTouched() {
    if (this.searchInput.length === 0) {
      setTimeout(() => {
        if (this.searchInput.length === 0) {
          this.showSearchInput = false;
        }
      }, 5000); // 5000 ms = 5 secondi
    }
  }

  showSearchInput: boolean = false;
  onSearchInputChanged(newValue: boolean) {
    this.showSearchInput = newValue;

    setTimeout(() => {
      this.searchBar?.setFocus();
    }, 100);
  }

  ngOnInit(): void {
    setInterval(() => {
      this.cambiaColoreTitolo();
    }, 5000);
  }

  ionViewWillEnter(): void {
    this.presentLoading();
  }
  ionViewDidEnter(): void {
    this.getContacts();
    //this.progressione();
  }

  /* shuffleArray(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]];  
    }
    return array;
  }

   progressione() {
    const array1 = [];
    for (let i = 0; i < 300; i++) {
      if (i < 100 ) {
        array1.push(0);
      }
       else if (i < 220 && i >= 100) {
        array1.push(1);        
      }
      else if (i < 270 && i >= 220) {
        array1.push(2);        
      }
      else {
        array1.push(3);
      }
    }
    
    const array = this.shuffleArray(array1);
    let livello = 1;
    let parziale = 0;
    let totale = 0;
    for (let i = 0; i < array.length; i++) {
      let positivo = array[i] === 1;
      console.log('Livello: ', livello);

      if (!positivo) {
        parziale -= livello;
        livello = 1;
      } else {
        parziale += livello * 2.5 - livello;
        livello =
          livello % 2 == 0
            ? livello + livello / 2
            : livello + Math.round(livello / 2);
      }
      console.log(
        `Totale: ${totale} Parziale: ${parziale} Livello: ${livello}`
      );
         if (parziale > 20) {
        totale += parziale;
        parziale = 0;
        livello = 1;
      } 
    }
    console.log('Tot: ', array.filter((e) => e === 1).length);
    console.log(array);
    
    
  }  */

  index = 0;
  cambiaColoreTitolo() {
    if (this.titleElement && this.titleElement.nativeElement) {
      this.titleElement.nativeElement.style.color = this.colors[this.index];

      this.titleElement.nativeElement.style.textShadow = `${this.index}px ${this.index}px ${this.index}px black`;
      this.index = this.index == this.colors.length - 1 ? 0 : this.index + 1;
    }
  }

  async presentLoading() {
    const loading = await this.loadinCtl.create({
      message: 'Loading...',
      duration: 300,
    });
    await loading.present();
  }

  async getContacts() {
    await this.contactService
      .getContactList()
      .pipe(
        switchMap((data: any) => {
          this.contacts = data.data;
          let input = this.searchInput.toUpperCase().trim();
          if (input.length > 0) {
            this.contacts = this.contacts.filter((c) => {
              const nome = c.name.toUpperCase();
              const cognome = c.surname.toUpperCase();
              const nomeCompleto = `${nome} ${cognome}`;
              return (
                nome.startsWith(input) ||
                cognome.startsWith(input) ||
                nomeCompleto.startsWith(input)
              );
            });
          }
          if (this.searchInput.length === 0) {
            setInterval(() => {
              if (this.searchInput.length === 0) {
                setInterval(() => {
                  if (this.searchInput.length === 0) {
                    this.closeSearchBar();
                  }
                }, 5000);
              }
            }, 5000);
          }
          
          const imageObservables = this.contacts.map((c) => {
            return this.contactService.getImage(c.id).pipe(
              map((imgBlob) => {
                const imageUrl = URL.createObjectURL(imgBlob);
                c.immagineProfilo = imageUrl;

                return imageUrl;
              }),
              catchError((error) => {
                console.log(error);
                return of(null);
              })
            );
          });
          return forkJoin(imageObservables);
        }),
        catchError((error) => {
          console.error('Errore in getContactList() o switchMap:', error);
          return of([]);
        })
      )
      .subscribe(() => {
        this.contactsImg = [...this.contacts];
      });
  }

  closeSearchBar() {
    this.showSearchInput = false;
  }

  openChat(id: number) {
    this.router.navigate(['chat', id]);
  }

  @ViewChild('modalContainer', { read: ViewContainerRef, static: false })
  modalContainer?: ViewContainerRef;
  modaleMex1: string = '';
  modaleMex2: string = '';
  modal: ComponentRef<ModalComponent> | undefined;
  private dataService: DataService = inject(DataService);


  openModal(modale: number) {
    if (modale < 10) {
      this.dataService.tipoOggetto.set(modale);      
      console.log('Tipo oggetto: ', this.dataService.tipoOggetto());
      this.router.navigate(['tables']);
      return;
    }
    this.modal = this.modalContainer?.createComponent(ModalComponent);
    if (this.modal) {
      this.modal.instance.title = 'Titolo della modale';
      this.modal.instance.closeModal.subscribe(() => {
        this.modal?.destroy();
      });
      this.modal.instance.closeModal.subscribe((param) => {
        if (modale === 10) {
          this.modaleMex1 = param;
        } else if (modale === 20){
          this.modaleMex2 = param;
        }

        const currentMap = this.dataService.message();
        currentMap.set(modale, param);
        this.dataService.message.set(currentMap);
      });
    }
  }
}
