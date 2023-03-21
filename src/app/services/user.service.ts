import { Injectable } from '@angular/core';
import { where } from 'firebase/firestore';
import { DocumentService } from './document.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private documentService: DocumentService,
  ) { }

  async listAccountsByUser(userId: string){
    return await this.documentService.listP<any>(`users/${userId}/accounts`); 
  }

  async listAccountsByGame(userId: string){
    return await this.documentService.listP<any>(`users/${userId}/accounts`, [where("game", "==", "league of legends")]); 
  }
}


