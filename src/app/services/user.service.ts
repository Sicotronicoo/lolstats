import { Injectable } from '@angular/core';
import { Functions, httpsCallableData } from '@angular/fire/functions';
import { firstValueFrom } from 'rxjs';
import { ApiLolService } from './api-lol.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private lolService: ApiLolService,
    private functions: Functions,

  ) { }
}
