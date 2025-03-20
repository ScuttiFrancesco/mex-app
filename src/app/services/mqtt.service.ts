import { Injectable } from '@angular/core';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MqttsService {
  constructor(private mqttService: MqttService) {}

  public topicSubscribe(topic: string): Observable<IMqttMessage> {
    console.log('topicSubscribe: ', topic);
    return this.mqttService.observe(topic);
  }

  public topicPublish(topic: string, message: string) {
    console.log('topicPublish: ', topic);
    this.mqttService.unsafePublish(topic, message, { qos: 1, retain: true });
  }

  getUsername(username: string): string {
    const usernameAjg = username.replace('.', '_');
    return `chat/messages/${usernameAjg}`;
  }
}
