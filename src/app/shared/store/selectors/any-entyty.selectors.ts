import { AnyEntytySetItemState, State } from "@appStore/reducers/any-entity-set.reduser";
import { createFeatureSelector, createSelector } from "@ngrx/store";



/**
 * 
 * 
 */

export const dataStore = createFeatureSelector<State>('data');

export const selectDatas = createSelector(
    dataStore,
    (x:State) => {
        return x;
    } 
); 