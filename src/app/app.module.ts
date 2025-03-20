import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, LoadingController } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './services/interceptor.service';
import { CommonModule } from '@angular/common';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { ReactiveFormsModule } from '@angular/forms';


export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions={
  keepalive:120,
  port:443,
  path:'/ws',
  protocol:'wss',
  username: 'intellitronika',
  password: 'intellitronika',
  hostname:'rabbitmq.test.intellitronika.com'
} as IMqttServiceOptions;

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    ReactiveFormsModule
    
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent, ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
