import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-portfolio';
  searchValues: string = "";
  list = [
    {
      id: "e6c9be40-189b-4c49-9b53-8136319452cc",
      name: "Intersection",
      href: "intersection",
      active: true
    },
    {
      id: "8d6647c8-a16c-4fc4-94d9-cff09214e33c",
      name: "Item 1",
      href: "item-a",
      active: false
    },
    {
      id: "4dd92f46-5dd5-40aa-92b0-ea8564406e0e",
      name: "Item 3",
      href: "",
      active: false
    }
  ];

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  get filteredList() {
    if (this.searchValues.length === 0) {
      return this.list;
    }

    return this.list.filter(l => l.name.toLowerCase().includes(this.searchValues.toLowerCase()));
  }

}
