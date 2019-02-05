import { Injectable }               from '@angular/core';
import { Router, ActivationEnd }    from '@angular/router';
import { Location }                 from '@angular/common';
import { Effect, Actions }          from '@ngrx/effects';
import { Store }                    from '@ngrx/store';
import { tap, map, filter }         from 'rxjs/operators';
import * as fromRouterActions       from '@appStore/actions/router.actions';
import * as fromStore               from '@appStore/index'




@Injectable()
export class RouterEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location,
    //private store: Store<fromStore.State>
  ) {
    //this.listenToRouter();
  }

  @Effect({ dispatch: false })
  navigate$ = this.actions$.ofType(fromRouterActions.RouterActionTypes.go).pipe(
    map((action: fromRouterActions.Go) => action.payload),
    tap(() => console.log(this.location)),
    tap(({ path, query: queryParams, extras }) => {
      this.router.navigate(path, { queryParams, ...extras });
    }),
    tap(()=>console.log(this.location) )
  );

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$
    .ofType(fromRouterActions.RouterActionTypes.back)
    .pipe(
        tap(() => console.log(this.location)),
        tap(() => this.location.back())
        );

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$
    .ofType(fromRouterActions.RouterActionTypes.forward)
    .pipe(
        tap(() => console.log(this.location)),
        tap(() => this.location.back())
    );


    //*****************************************/
    // private listenToRouter() {
    //     this.router.events.pipe(
    //         filter(event => event instanceof ActivationEnd)
    //     ).subscribe((event: ActivationEnd) =>
    //         this.store.dispatch(new fromRouterActions.Go({path: [event.snapshot.routeConfig.path] }))
    //     );
    // }
}