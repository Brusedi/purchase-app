import { Injectable } from '@angular/core';
import { FieldDescribe, ValidatorFn } from '@appModels/metadata';
import { Validators } from '@angular/forms';


/**
 *  Бля, 191218 получение референсных данных посредством стора:  
 *  1. получение контекстнонезависимой подписки:
 *  Итак, на каком этапе ? 
 *      a. На этапе ресолвинга 
 *            минусы - не подходит (или усложняется) для контекстно зависимых подписок (не универсален)
 *            плюсы    не надо делать диспатчи из контрола
 *      б. На этапе активации подписчиков (контролов формы)
 * 
 * 
 *  2. получение контекстнозависимой подписки
 */


interface IMetadata{
  [propertyName: string]: any; 
}

type   defFooType =  (src:any, tg:any )=> any ;
const  defFoo     =  (x,y) => y

// это похоже тип который я добавляю сям на бакэнде из рутовых метаданных
const IS_FIELD_TAG_BEGIN = "["; 
const IS_FIELD_TAG_END = "]";
const ADD_META_TYPE_KEY_NAME =  IS_FIELD_TAG_BEGIN + "Type"+IS_FIELD_TAG_END;

const METADATA_GROUP_DEVIDER : string  = "." 

const RANGE_DEF_ERROR   = "Значение не попадает в допустимый диапазон";
const REQUERD_DEF_ERROR = "Значение обязательно для ввода";
const PATERN_DEF_ERROR  = "Не верный формат";

@Injectable({
  providedIn: 'root'
})
export class MetadataAdaptService {

  constructor() { }

  /**
   * 
   */
  public toFieldDescribe = ( source:any, tag:any = undefined, toDefault:defFooType = defFoo )  =>{
    const md = source as IMetadata;
    //console.log(md);
    return md ? this.toFieldDescribeFunc(md, toDefault(md,tag)):undefined ;
  }  
  

  /** 
  *   Convert metadata item to FieldDescribe type
  **/
  private toFieldDescribeFunc = ( data:IMetadata, defVal:string) => ({
        id: defVal,
        altId: this.fieldNameBung(defVal),
        foreignKey: this.existOrVal(data, ["ForeignKey", "ForeignKey.Name"],""),    
        //this.metaHelper.existOrVal(data, [ADD_META_TYPE_KEY_NAME],"string"),
        type: this.existOrValFunc(data,[
            {atr:"DataType", fn: (x => x==1 ? "DateTime" : null )},
            {atr:"DataType", fn: (x => x==2 ? "Date" : null )},
            {atr:"DataType", fn: (x => x==7 || x==6 || x==9 ? "Text" : null )},
            {atr:ADD_META_TYPE_KEY_NAME, fn: (x => x)} 
          ],undefined),  //string

        name: this.existOrVal(data, ["DisplayName", "Display.Name"] ,defVal),
        description: this.existOrVal(data, ["Description", "Display.Description"] ,undefined),
        //visible : this.metaHelper.existOrVal(data, ["Editable.AllowEdit"] , true ),                         // нецелевое использование 
        visible : this.buildIsVisible(data, defVal),                
        required: this.existOrValFunc(data,[
            {atr:"Required", fn: (x => x)},
            {atr:"Required.AllowEmptyStrings", fn: (x => !x)} 
            ],false),  
        defaultValue: undefined,    
        length: undefined,
        validators: this.buildValidators(data, defVal),
        validationMessages: this.buildvalidationMessages(data, defVal),
        order: this.existOrVal(data, ["Display.Order"] , undefined ),
        editable: this.buildIsEditable(data, defVal) 

  }) as FieldDescribe;


  /**
  *  See must field is Visible 
  */
  private buildIsVisible = (data:IMetadata, defVal:string) =>
  this.existOrValFunc(data, [{atr:"Display.AutoGenerateField", fn: x => !x } ] , true ) ||
  this.existOrValFunc(data, [{atr:"Display.AutoGenerateFilter", fn: x => !x } ] , false ) ;           

  /**
  *  See must field is ReadOnly (Editable) 
  */
  private buildIsEditable = (data:IMetadata, defVal:string) => 
  this.existOrValFunc(data, [{atr:"Editable.AllowEdit", fn: x => x } ] , true ) && 
  this.existOrValFunc(data, [{atr:"ReadOnly.IsReadOnly", fn: x => !x } ] , true ) ;           

    /**
  *  Build simple field val validator by metadata
  */
  private buildValidators(data:IMetadata, defVal:string){
    var ret:ValidatorFn[] = [];
    return ret
      .concat( this.defineOrValFunc( data,
        [{atr: "Range.Minimum", fn:( x => [ Validators.min(x) ] )} ], [] )
      )
      .concat( this.defineOrValFunc( data,
        [{atr: "Range.Maximum", fn:( x => [ Validators.max(x) ] )} ], [] )
      )
      .concat( this.defineOrValFunc( data,
        [{atr: "RegularExpression.Pattern", fn:( x => [ Validators.pattern(x)  ] )} ], [] )
      )
      .concat( this.defineOrValFunc( data, [
          {atr: "Required", fn:( x => [ Validators.required ] )} ,
          {atr:"Required.AllowEmptyStrings", fn: (x => x ? [] : [ Validators.required ]  ) }
        ], [] )
      );
  }    

/**
*  Build simple field val validator by metadata
*  А я ченява, жопа кучерява...
*/
private buildvalidationMessages(data:IMetadata, defVal:string){
  var ret:{ key: string , val: string }[] = [];
  return ret
    .concat( this.defineOrValFuncIfExistGroup( data, "Range",
      [{atr: "Range.ErrorMessage",  fn:( x => [ { key:"min" , val:x },{ key:"max" , val:x }]) } ],
      [ { key:"min", val:RANGE_DEF_ERROR },{ key:"max", val:RANGE_DEF_ERROR }], [] )
    )
    .concat( this.defineOrValFuncIfExistGroup( data, "Required",
       [{atr: "Required.ErrorMessage", fn:( x => [{ key:"required", val:x }]) } ],
       [{ key:"required", val:REQUERD_DEF_ERROR }], [] )
    )
    .concat( this.defineOrValFuncIfExistGroup( data, "RegularExpression",
      [{atr: "RegularExpression.ErrorMessage", fn:( x => [{ key:"pattern", val:x }]) } ],
      [{ key:"pattern", val:PATERN_DEF_ERROR }], [] )
    )
    .reduce( (acc,i) => { acc[i.key] = i.val ; return acc; } , {} ) 
}    

  /** 170418 Чета я не понимаю, при выборке данных посредством entyty  
  * с регистром лэйблов происходят чудеса
  * нужна затычка до выяснения обстоятельств такого поведения. :( 
  * Преобразует оригинальное (сикульно-ентитивое) имя поля в формат приходящий с сервиса бакенда
  **/
  private fieldNameBung = (origName: string) =>  origName.toUpperCase() == origName ? origName.toLowerCase() : origName[0].toLowerCase() + origName.substring(1);

  // METADATA HELPER -------------------------------------------
  ifNull = (val: any, valDef: any) => (val === null) ? valDef : val;
  ifNullOrUndef = (val: any, valDef: any) => (val === null || val === undefined) ?valDef: val ;

  valueOf = (source: IMetadata, key: string) => source[key];
  //firstValueOf =  (source: IMetadata, keys: string[]):any =>  keys.map( x => this.valueOf(source, x ) ).find( (e,i,a) => e != undefined )

  firstValueOf(source: IMetadata, keys: string[]): any {
    var ret: any = null;
    for (var s in keys) {
        var v = this.valueOf(source, keys[s]);
        if (v != undefined) { ret = v; break; }
    }
    return ret;
  } 
  
  valueOfFunc = (source: IMetadata, keyAcc: { atr:string, fn:((any) => any)} ) => {
    const v = this.valueOf(source, keyAcc.atr);
    return (v == undefined || v == null ) ? v: keyAcc.fn( this.valueOf(source, keyAcc.atr));
  }

  firstValueOfFunc(source: IMetadata, keysAcc: { atr:string, fn:( (src: any) => any)}[]) {
    var ret: any = null;
    for (var s in keysAcc) {
        var v = this.valueOfFunc(source, keysAcc[s]); 
        if (v != undefined ) {ret = v; break;}
    }
    return ret;
  }


  existOrVal  = (source: IMetadata, keys: string[], defVal: any) => this.ifNull( this.firstValueOf(source, keys), defVal  );

  /**
   *  Принимает метаданные и массив объектов : ключ, функция. При наличии в метаданных ключа возвращает значение функции от значения метаданных...
  */
  existOrValFunc  = (source: IMetadata, keysAcc: { atr:string, fn:( (src: any) => any)}[], defVal: any) => this.ifNull( this.firstValueOfFunc(source, keysAcc), defVal  );

  /**
   *  Принимает метаданные и массив объектов : ключ, функция. При наличии в метаданных дефайнед ключа возвращает значение функции от значения метаданных...
  */
  defineOrValFunc = (source: IMetadata, keysAcc: { atr:string, fn:( (src: any) => any)}[], defVal: any) => this.ifNullOrUndef( this.firstValueOfFunc(source, keysAcc), defVal );  

  //180718
  /**
  * Detect metadata is contains keyGroup
  */ 
  existGroup =  (source: IMetadata, keyGroup: string, groupDevider: string = METADATA_GROUP_DEVIDER ) => 
    Object.keys(source)
      .filter( x => x.includes(groupDevider) )
      .map( x => x.substring(0, x.indexOf(groupDevider)))
      .some( x => x === keyGroup );

  /**
   *  Проверяет наличие в метаданных группы keyGroup и если таковая есть проверяет наличие defined значения ключа метаданных keysAcc.atr 
   *  при наличии первого попавшегося возвращает результат соотв. функции  keysAcc.fn  если ни один keysAcc.atr не найден то defVal. 
   *  А если нету группы то noGroupVal
   */
  defineOrValFuncIfExistGroup = (source: IMetadata, keyGroup: string, keysAcc: { atr:string, fn:( (src: any) => any)}[], defVal: any, noGroupVal: any ) =>     
    this.existGroup( source, keyGroup ) ? this.defineOrValFunc(source, keysAcc, defVal) : noGroupVal ;

 
 

}


