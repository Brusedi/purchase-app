import { Injectable } from "@angular/core";
import { AppSettings } from "../app-setting";
import { of, Observable } from 'rxjs';



@Injectable()
export class AppSettingsService {
  getSettings(): Observable<AppSettings> {
    let settings = new AppSettings();
    return of<AppSettings>(settings);
  }
}