import { Component, OnInit } from '@angular/core';
import {ChatbotService} from '../../services/chatbot.service';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  constructor(private chatbotService: ChatbotService) { }
  labelQuestion: FormControl;
  panelOpenState = false;
  answer = '';

  form: FormGroup;

  ngOnInit(): void {
    this.handleChatbotResponse('hello');
    this.labelQuestion = new FormControl('');

    this.form = new FormGroup({
      question : this.labelQuestion});
  }

  handleChatbotResponse(message: string) {
    this.chatbotService.askChatBot(message).subscribe(
      data => {
        this.answer = data.data;
      }
    );
  }

  onSubmit(formDirective: FormGroupDirective): void {
    console.log(this.labelQuestion.value);
    this.handleChatbotResponse(this.labelQuestion.value);
    this.form.reset();
  }
}
