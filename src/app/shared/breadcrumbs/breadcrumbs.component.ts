import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  public titulo: string;

  constructor(private router: Router,
              private title: Title,
              private meta: Meta) {
    this.getDataRoute()
      .subscribe(data => {
        this.titulo = data.titulo;
        this.title.setTitle(this.titulo);

        const metaTag: MetaDefinition = {
          name: 'description',
          content: this.titulo
        };

        this.meta.updateTag(metaTag);

      });
  }

  ngOnInit(): void {
  }

  getDataRoute() {
    return this.router.events
      .pipe(
        filter(evento => evento instanceof ActivationEnd),
        filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
        map((evento: ActivationEnd) => evento.snapshot.data)
      );
  }

}
