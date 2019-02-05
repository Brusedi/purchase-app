/**
 *  Helper 
 *      
 * 
 * 
 */


const FK_MACRO_BEGIN = "{"; 
const FK_MACRO_END = "}";
const FK_PARS_PATR_DEVIDER = "?";
const FK_NAME_PATR_DEVIDER = "/";
const ID_NAME_META_PROP  = "Key";


/**
*  Legasy
*  Get Macros from location  
*/ 
export const getLocationMacros = (location: string) => {
    var recFun = (s: string, r: string[]) => {
        var bp = s.indexOf(FK_MACRO_BEGIN)
        if (bp > 0 && s.length > (bp+1) ) {
            var ss = s.substring(bp+1);
            var ep = ss.indexOf(FK_MACRO_END);
            if (ep > 0) {
              r.push(ss.substring(0, ep));
              r = recFun(ss.substring(ep), r);
            }
        }
        return r;
    }
    return recFun(location, []);
}

/**
 *  Check location contains macros
 */
export const isLocationContainsMacros = (location: string) => getLocationMacros( location ).length > 0  

//export const not = ( (x:boolean) => !x );

/**
 *  Check location undepend
 */
export const isLocationUndepended = (x:string) => !(isLocationContainsMacros(x)) ;

/**
 *  Check location Parameterized
 */
export const isLocationParameterized = (location: string) => ( location.indexOf(FK_PARS_PATR_DEVIDER) > 0);

/**
 *  Cut native name from location
 */
export const locationToName = (loc: string) => {
    //console.log(loc);
    const e = loc.indexOf(FK_PARS_PATR_DEVIDER);
    const l = e > 0 ?  loc.substring(0,e) : loc;
    const b = l.lastIndexOf(FK_NAME_PATR_DEVIDER);
    
    return b>0 ? l.substring(b+1): l;
}
    
/**
 *  location to simple option
 */
export const locToEntityOptionSeed = (location: string) => (
    {
        name:       locationToName(location) ,          
        location:   location,                  // http sublocation  key 
        selectId:   undefined,                 // entity to id value func    
        selBack:    undefined    
    }
);

/**
 *  return Base location wo parameters part (clear)
 */ 
export const getBaseLocation = (loc:string) => 
    isLocationParameterized( loc ) ? loc.substring(0, loc.indexOf(FK_PARS_PATR_DEVIDER)) : loc ;


/**
 *  location info descriptor
 */
export const locationInfo = (loc: string) => ({
    optionSeed:  locToEntityOptionSeed(loc),
    isLocationUndepended: isLocationUndepended(loc),
    isLocationParameterized: isLocationParameterized(loc),
    macros:getLocationMacros(loc)
});

/**
 * Location types flags
*/ 
export const isFullIndepended = (loc: string) => isLocationUndepended(loc) && !isLocationParameterized(loc) ;
export const isPartIndepended = (loc: string) => isLocationUndepended(loc) &&  isLocationParameterized(loc) ;
export const isDepended       = (loc: string) => !isLocationUndepended(loc) ;


/**
 *  name key field from metadata
 */
export const getIdFromMeta = ( meta:any ) => 
    meta.hasOwnProperty(ID_NAME_META_PROP) ?  meta[ID_NAME_META_PROP] : undefined;

/**
 *  location to option
 */
export const locToEntityOption = (location: string, keyName: string ) => (
    {
        name:       locationToName(location) ,          
        location:   getBaseLocation(location),                  // http sublocation  key 
        selectId:   buildSelectIdFoo(keyName),                  // entity to id value func    
        selBack:    buildSelBackIdFoo(keyName)    
    }
);

/**
 *  select key from row func 
 */
export const buildSelectIdFoo = ( key: string ) => (x:any) => x[key] ;

/**
 *  select key from row func 
 */
export const buildSelBackIdFoo = ( key: string ) => (x:string) => ("?"+key+"=") + x ;

/**
* Fill macros values from row 
*/
export const fillLocationMacros = ( loc: string, row:{}) => {
    const prepVal = (v:any) => v==undefined?'null':((typeof v) == 'string' ? "'"+v+"'" : ""+v);
    const getVal = ( p:string, r:{}) => prepVal( p in r ? r[p] : undefined );  

    return getLocationMacros(loc).reduce((a:string, x) => a.replace(FK_MACRO_BEGIN+x+FK_MACRO_END, getVal(x,row)),loc);
}








