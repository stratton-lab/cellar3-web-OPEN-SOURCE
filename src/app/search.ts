import {Message} from "./message";
import {catchError, debounceTime, distinctUntilChanged, merge, Observable, of, Subject, switchMap, tap} from "rxjs";
import _ from "lodash";

export class Search<T> {
  msg: Message | null = null // Error message, if calling searchFunction unsuccessful.
  busy = false // Waiting for results
  query: string = '' // Query user is typing
  hasResults = false // True if searchFunction returned a non-empty array

  $autocomplete = new Subject<string>() // Input / trigger
  $search: Observable<T[]>
  $cancel = new Subject<T[]>()
  $results: Observable<T[]>

  /**
   * Configures the autocomplete.
   * @param query_min_length
   * @param searchFunction
   */
  constructor(private query_min_length = 3, searchFunction: (query: string) => Observable<T[]>) {
    this.$search = this.$autocomplete.pipe(
      debounceTime(50),
      distinctUntilChanged(),
      tap(query => this.busy = true),
      switchMap(query => {
        if (query.length >= query_min_length) {
          return searchFunction(query).pipe(
            catchError(err => {
              console.error(err)
              return of([])
            })
          )
        } else {
          return of([])
        }
      }),
      tap((results: T[]) => this.busy = false),
      tap((results: T[]) => this.hasResults = !_.isEmpty(results))
    )

    this.$results = merge(this.$search, this.$cancel)
  }


  isQueryTooShort = () => this.query.length < this.query_min_length
  hasNoResults = () => !this.hasResults && !this.isQueryTooShort() && !this.busy

  /**
   * Called by keyup and enter press events from the input element.
   * Will trigger the autocomplete.
   */
  search() {
    if (this.query.length == 0) this.hasResults = false
    this.$autocomplete.next(this.query)
  }

  reset() {
    this.query = ''
    this.search()
  }
}
