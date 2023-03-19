import { Injectable } from '@angular/core';
import { DocumentService } from './document.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private documentService: DocumentService,
  ) { }

  async listAccountsByUser(userId: string){
    return await this.documentService.listP(`users/${userId}/accounts`); 
  }
}
