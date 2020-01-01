import { Injectable } from "@angular/core";
import { Person } from "src/models/person";
import { Persons } from "../data/dummy";
import { WhereFilter } from "src/models/wherefilter";

@Injectable({
  providedIn: "root"
})
export class PersonService {
  constructor() {}

  getAllPerson(): Person[] {
    return Persons;
  }
  getFilteredPeson(whereFilters: WhereFilter[]): Person[] {
    let result = Persons;
    whereFilters.forEach(
      filter =>
        (result = result.filter(c =>
          filter.values.includes(c[filter.columnname])
        ))
    );

    return result;
  }
}
