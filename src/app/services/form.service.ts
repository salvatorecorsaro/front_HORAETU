import { Injectable } from '@angular/core';
import {Region} from '../classes/region';
import {Country} from '../classes/country';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private countriesUrl = 'http://localhost:8080/api/countries';
  private regionsUrl = 'http://localhost:8080/api/regions';
  constructor(private httpClient: HttpClient) {
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    const data: number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    const data: number[] = [];
    const currentYear: number = new Date().getFullYear();
    const endYear: number = currentYear + 10;
    for (let theYear = currentYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }


  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }


  getRegions(countryCode: string): Observable<Region[]>{
    const searchRegionsUrl = `${this.regionsUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<GetResponseRegions>(searchRegionsUrl).pipe(
      map((response => response._embedded.regions))
    );
  }


}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseRegions {
  _embedded: {
    regions: Region[];
  };
}
