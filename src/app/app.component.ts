import { Component, ViewChild } from "@angular/core";
import { Person } from "src/models/person";
import { Persons } from "./data/dummy";
import { PersonService } from "./services/person.service";
import { MultiSelectComponent } from "ng-multiselect-dropdown";
import { NgSelectComponent } from "@ng-select/ng-select";
import { WhereFilter } from "src/models/wherefilter";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "search";
  persons: Person[];
  dataSource: any[] = [];
  whereFilters: WhereFilter[] = [];
  currentWhereFilter: WhereFilter = null;
  // dropdownSettingsColumn: any = {};
  // dropdownSettingsColumnData: any = {};
  isNeedToRenderSelectData: boolean = false;
  isNeedToRenderSelectColumn: boolean = false;
  columns: any = [
    { id: "firstname", name: "First Name" },
    { id: "lastname", name: "Last Name" },
    { id: "company", name: "Company" },
    { id: "email", name: "Email" },
    { id: "city", name: "City" }
  ];
  columnsDataSource: any[] = [];
  // selectedColumns: string[] = [];
  // @ViewChild("ddlColumn", { static: false }) ddlColumn: MultiSelectComponent;
  // @ViewChild("ddlColumnData", { static: false })
  // ddlColumnData: MultiSelectComponent;
  @ViewChild("ngSelectColumn", { static: false })
  ngSelectColumn: NgSelectComponent;
  @ViewChild("ngSelectData", { static: false })
  ngSelectData: NgSelectComponent;
  constructor(public personsService: PersonService) {
    this.persons = personsService.getAllPerson();
  }
  ngOnInit() {
    this.columnsDataSource = [...this.columns];
    // this.dropdownSettingsColumn = {
    //   singleSelection: true,
    //   idField: "id",
    //   textField: "name",
    //   selectAllText: "Select All",
    //   unSelectAllText: "UnSelect All",
    //   itemsShowLimit: 3,
    //   allowSearchFilter: false
    // };
    // this.dropdownSettingsColumnData = {
    //   singleSelection: false,
    //   idField: "id",
    //   textField: "name",
    //   selectAllText: "Select All",
    //   unSelectAllText: "UnSelect All",
    //   itemsShowLimit: 3,
    //   allowSearchFilter: false
    // };
  }
  onColumnSelect(item: any) {
    // this.ddlColumn.closeDropdown();
    this.isNeedToRenderSelectColumn = false;
    this.isNeedToRenderSelectData = true;
    this.ngSelectColumn.items;
    this.currentWhereFilter = new WhereFilter();
    this.currentWhereFilter.columnname = item.id;
    let columnData: any[] = [];
    this.persons.map(person => {
      if (
        columnData.findIndex(
          c => c.id === person[this.currentWhereFilter.columnname]
        ) === -1
      ) {
        columnData.push({
          id: person[this.currentWhereFilter.columnname],
          name: person[this.currentWhereFilter.columnname]
        });
      }
    });
    this.dataSource = columnData;
    let index = this.columnsDataSource.findIndex(
      x => x.id === this.currentWhereFilter.columnname
    );
    if (index > -1) {
      this.columnsDataSource.splice(index, 1);
      //this.ngSelectColumn.items.splice(index, 1);
    }
    setTimeout(() => {
      this.ngSelectData.open();
    }, 100);
  }
  oncloseData() {
    if (this.ngSelectData.selectedItems.length > 0) {
      this.isNeedToRenderSelectData = false;
      this.currentWhereFilter.values = [];
      this.ngSelectData.selectedItems.map(item =>
        this.currentWhereFilter.values.push(item.label)
      );
      this.whereFilters.push(this.currentWhereFilter);
      this.currentWhereFilter = null;
      this.persons = this.personsService.getFilteredPeson(this.whereFilters);
    }
  }
  oncloseColumn(item: any) {
    if (!this.currentWhereFilter) {
      this.isNeedToRenderSelectColumn = false;
    }
  }
  onSearchBoxFocus() {
    this.isNeedToRenderSelectColumn = true;
    setTimeout(() => {
      this.ngSelectColumn.open();
    }, 100);
  }
  clearFilter() {
    this.isNeedToRenderSelectColumn = false;
    this.isNeedToRenderSelectData = false;
    this.currentWhereFilter = null;
    this.whereFilters = [];
    this.columnsDataSource = [...this.columns];
    this.persons = this.personsService.getAllPerson();
  }
}
