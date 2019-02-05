import { Injectable } from '@angular/core';
import { DataProvService } from '../data-prov.service';
import { tap, map, mergeAll, toArray, mergeMap, combineLatest, reduce, catchError } from 'rxjs/operators';
import { FieldDescribe} from '@appModels/metadata';
import { Observable,  from } from 'rxjs';
import { MetadataAdaptService } from './metadata-adapt.service';

const IS_FIELD_TAG_BEGIN = "["; 
const IS_FIELD_TAG_END = "]";
const ADD_META_TYPE_KEY_NAME =  IS_FIELD_TAG_BEGIN + "Type"+IS_FIELD_TAG_END;
const META_FIELDNAME_KEY_NAME =  IS_FIELD_TAG_BEGIN + "id"+IS_FIELD_TAG_END;


const MODULE_NAME    = 'Johny Galon';
const COMPONENT_NAME = 'MetadataEngineService ';
const log = (msg:any) => ( console.log("["+MODULE_NAME+"]"+"["+COMPONENT_NAME+"] " + msg )  );



@Injectable({
  providedIn: 'root'
})
export class MetadataProvService {
  
  constructor(
    private dataService: DataProvService,
    private adapterService: MetadataAdaptService
    ) { }


  public metadata$(loc:string ):Observable<any>{  
    const r$ = this.loadMetadata3(loc);    //loadMetadata2
    //r$.subscribe( x=> console.log(x));
    return r$;
  }


  private loadMetadata3 = (loc:string ) => {
    const tmeta$ = this.dataService.metadata$(loc);
    const fdesc$ = tmeta$.pipe(
      map(this.toFieldsType),
      mergeMap( x => from(Object.keys(x)).pipe(
                    mergeMap( f => this.getFieldDescr$(loc, f, x[f] )),
                    reduce( (a,f:FieldDescribe) => ({...a, [f.id]:f }), ({}) )
      )),
    );
    return tmeta$.pipe( 
      combineLatest( fdesc$ , (v1,v2) => ({table:v1 ,fieldsDesc: v2 }) )
      //, tap(x=>console.log(x)) 
    );     
  };      

  private getFieldDescr$ = (loc:string, id:string, typeSeed:string ) =>
      this.dataService.metadata$(loc, id)
        .pipe( catchError( error => ([{[META_FIELDNAME_KEY_NAME]:id}])) )
        .pipe( 
            map( x => this.adapterService.toFieldDescribe(x, META_FIELDNAME_KEY_NAME, (x,t) => x[t] )),
            map( x => ({...x, type:(x.type === undefined ? typeSeed : x.type) }))
        );
        

  /**
  *  Convert table metadata to fields list
  */
 private toFieldsType = (data:any) => {
    const isField = (key:string) => key.length > 2 && key[0]== IS_FIELD_TAG_BEGIN && key[key.length-1] ==  IS_FIELD_TAG_END ;    
    const clear   = (key:string) => key.length > 2 ? key.substring(1, key.length - 1) : key  ;
    return Object.getOwnPropertyNames(data)
          .filter(isField)
          .reduce( (a,i) => ({ ...a, [clear(i)]:data[i] }) , {}  )
  } 
  
  
  private loadMetadata2 = (loc:string ) => {
    const tMeta$ = this.dataService.metadata$(loc);
    const fList$ = tMeta$.pipe( map( x =>  this.toFieldsList(x)) )
    const fListDesc$ = fList$.pipe(
     //tap( x => console.log(x) ),
      map( x =>  x.map( x =>   this.dataService.metadata$(loc, x).pipe( catchError( error => ([{ [META_FIELDNAME_KEY_NAME]:x}]) )))), 
      //tap( x => console.log(x) ),
      mergeMap( x => from(x).pipe(mergeAll(),toArray())),  
      map( x => x.map( x=> this.adapterService.toFieldDescribe(x, META_FIELDNAME_KEY_NAME, (x,t) => x[t] ) )),    
      map( x => x.reduce((a,e) => ({...a, [e.id]:e }) ,  {})   )
    )

    return tMeta$.pipe(
      combineLatest( fListDesc$, (v1,v2) => ({table:v1 ,fieldsDesc: v2 })   )
    )
  }

  // public metadata$(loc:string ):Observable<FieldDescribes>{
  //   const r$ =  
  //     this.loadMetadata(loc).pipe(
  //       map( x => x.reduce( (a,e) => ({...a, [e.name]:e }) ,  {}  ) )
  //     );
  //   r$.subscribe( x=> console.log(x));
  //   return r$;
  // }
  
  /**
  * Prepare metadata
  */
  private loadMetadata = ( loc:string ) => 
    this.dataService.metadata$(loc).pipe(
      tap( x => console.log(x) ),
      map( x => ({table:x ,fieldsDesc: this.toFieldsDescribe(loc, x)}) ),
      tap( x => console.log(x) ),        
  )    
  
  
  // {
  //   const tablMeta$ = this.dataService.metadata$(loc);
  //   const fieldsDesc$ = this.

  //   return tablMeta$.pipe(
  //       combineLatest( fieldsDesc$ , (f,d) => { } )
  //   )
  // }

  //  /**
  //   * Prepare metadata
  //   */
  //  private loadMetadata = ( loc:string ) => 
  //  this.dataService.metadata$(loc).pipe(
  //      map( x => this.toFieldsList(x) ),
  //      map( x => x.map( fld => this.dataService.metadata$(loc, fld ) ) ),
  //      mergeMap( x => from(x).pipe(mergeAll(),toArray())),
  //      map( x =>  x.map( x=> this.adapterService.toFieldDescribe(x, META_FIELDNAME_KEY_NAME, (x,t) => x[t] ) ))
  //  );

  /**
   *  Convert table metadata to FieldDescribe[]$
   */
  private toFieldsDescribe = (loc:string, tableMeta:any) =>{ 
    const fieldsMetadata = 
      this.toFieldsList(tableMeta)
        .map( fld => this.fldToFieldsDescribe$(loc, fld));

    console.log(fieldsMetadata);

    return from(fieldsMetadata).pipe(
      mergeAll(),
      reduce( (a,e:FieldDescribe) => ({...a, [e.name]:e }) ,  {}  ) ,     
      tap(x=>console.log(x))
    )
  }
  
  /**
   *  get FieldDescr by fieldName
   */
  private fldToFieldsDescribe$ = (loc:string, fieldName:string ) => 
    this.dataService.metadata$(loc, fieldName ).pipe( 
      map( x => this.adapterService.toFieldDescribe(x, META_FIELDNAME_KEY_NAME, (x,t) => x[t] ) )  , 
      tap(x=>console.log(x))
    )
   
  // private toFieldsDescribe = (loc:string, tableMeta$:Observable<any>) => 
  //   tableMeta$.pipe(
  //     map( x => this.toFieldsList(x) ),
  //     map( x => x.map( fld => this.dataService.metadata$(loc, fld ) ) ),
  //     mergeMap( x => from(x).pipe(mergeAll(),toArray())),
  //     map( x =>  x.map( x=> this.adapterService.toFieldDescribe(x, META_FIELDNAME_KEY_NAME, (x,t) => x[t] ) )),
  //     map( x => x.reduce( (a,e) => ({...a, [e.name]:e }) ,  {}  ) )
  //   )  
  



  /**
   *  Convert table metadata to fields list
   */
  private toFieldsList = (data:any) => {
    const isField = (key:string) => key.length > 2 && key[0]== IS_FIELD_TAG_BEGIN && key[key.length-1] ==  IS_FIELD_TAG_END ;    
    const clear   = (key:string) => key.length > 2 ? key.substring(1, key.length - 1) : key  ;
    return Object
          .getOwnPropertyNames(data)
          .filter(isField)
          .map(clear) ;
  }

  


  //******************************************************************************************************************** */
  private getFD():FieldDescribe {
    return ({ name: "", description: '', id: '', altId: '', foreignKey: '', type: '', visible: true, required: true,  editable: true,   defaultValue: null  })
  } 




}
