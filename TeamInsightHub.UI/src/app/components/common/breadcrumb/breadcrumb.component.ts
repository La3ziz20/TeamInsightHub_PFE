import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {

  @Input() breadcrumbList: { title: string, path: string }[] = [];

  constructor(private router: Router) { }

  goToPath(path: string) {
    this.router.navigateByUrl(path);
  }

}
