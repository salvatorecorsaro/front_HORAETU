import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OrderDto} from '../classes/order-dto';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private chatbotUrl = 'http://localhost:5000/chat-bot/';

  constructor(private httpClient: HttpClient) { }

  askChatBot(theMessage: string): Observable<GetResponseChatBot> {
    const chatBotResponseUrl = `${this.chatbotUrl}${theMessage}`;
    return this.httpClient.get<GetResponseChatBot>(chatBotResponseUrl);
  }
}

interface GetResponseChatBot {
  data: string;
}
