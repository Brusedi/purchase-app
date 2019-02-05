import { Dictionary } from "@ngrx/entity";

/**
 *  Helper for metadata 
 *  Pure function accumulator    
 * 
 *  15 01 2019 
 */

const MD_T_KEY_PROP_NAME   = 'Key';
const MD_T_LABEL_PROP_NAME = 'DisplayColumn';

const OPTION_ID_NAME    = 'key';
const OPTION_LABEL_NAME = 'value';


/**
 *  Ret id prop from metadata
*/
export const getMdKeyName = (meta:{}) => (MD_T_KEY_PROP_NAME in meta)?meta[MD_T_KEY_PROP_NAME]:undefined;

/**
 *  Ret label prop from metadata
*/
export const getMdLabelName = (meta:{}) => (MD_T_LABEL_PROP_NAME in meta)?meta[MD_T_LABEL_PROP_NAME]:undefined;

/**
 *  Ret option dataset for entities and metadata
*/
export const getMdOptons = ( data:{}[] , meta:{}) => {
   const getProp = ( o:{} , p:string ) => !!p&&!!o ? ( (p in o) ? o[p]:undefined ):undefined;    
   return data.map( x => ({ [OPTION_ID_NAME]:getProp(x, getMdKeyName(meta)),  [OPTION_LABEL_NAME]:getProp(x, getMdLabelName(meta)) }) ) ;
}

/**
 *  Ret option dataset for entities and metadata
*/
export const getMdOptonsFromDict = ( data:Dictionary<any> , meta:{}) => getMdOptons( Object.keys(data).map( x => data[x] ), meta  ) ;
