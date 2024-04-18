import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DuplicatorService {

   private count = new BehaviorSubject<number>(1);

   incrementCount() {
      const increment = this.count.value + 1;
      this.count.next(increment);
   }

   get count$() {
      return this.count.asObservable();
   }
}