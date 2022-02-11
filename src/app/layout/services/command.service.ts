import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Command } from './command';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommandService {
  private baseUrl = globals.apiBaseUrl + 'command';

  constructor(private http: HttpClient) {}

  createCommand(commande: Command): Observable<Command> {
    return this.http.post<Command>(`${this.baseUrl}`, commande);
  }

  getCommand(): Observable<Command> {
    return this.http.get<Command>(`${this.baseUrl}`);
  }
  removeByNumCmd(numero: String) {
    return this.http.get(
      `${this.baseUrl}/search/removeByNumcmd?numero=${numero}`
    );
  }
  getCommandByNumCmd(numero: String) {
    return this.http.get(
      `${this.baseUrl}/search/findByNumcmd?numCmd=${numero}`
    );
  }
  getObjectifsCmdsFours() {
    return this.http.get(`${this.baseUrl}/search/getObjectifsCmdsFours`);
  }

  updateCommandAchat(purcmd: string, date: String, numcmd: String) {
    return this.http.get(
      `${this.baseUrl}/search/modifyCommandAchat?purcmd=${purcmd}&date=${date}&numcmd=${numcmd}`
    );
  }

  updateCommand(command: Command): Observable<any> {
    return this.http.put<Command>(`${this.baseUrl}/${command.id}`, command);
  }
  verifierCommandeEnDouble() {
    return this.http.get(`${this.baseUrl}/search/verifierCommandeEnDouble`);
  }
  updatePurCommmande(numcmd: String) {
    return this.http.get(
      `${this.baseUrl}/search/updatePurCommmande?numcmd=${numcmd}`
    );
  }
}
