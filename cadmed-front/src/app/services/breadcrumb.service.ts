import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbSubject = new BehaviorSubject<BreadcrumbItem[]>([
    { label: 'Dashboard', url: '/dashboard' }
  ]);

  breadcrumbs$: Observable<BreadcrumbItem[]> = this.breadcrumbSubject.asObservable();

  constructor() { }

  set(breadcrumbs: BreadcrumbItem[]) {
    this.breadcrumbSubject.next(breadcrumbs);
  }

  reset() {
    this.breadcrumbSubject.next([{ label: 'Dashboard', url: '/dashboard' }]);
  }
}
