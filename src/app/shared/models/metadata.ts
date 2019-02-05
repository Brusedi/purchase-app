import { ValidationErrors, AbstractControl } from "@angular/forms";

/**
 *  Item (db-table-field) Metadata 
 *  field presentation descriptor
 */ 
export interface FieldDescribe {
    name: string
    description: string
    id: string
    altId: string
    foreignKey: string
    type: string
    visible: boolean
    required: boolean
    editable: boolean
    defaultValue: any
    length?: number
    cellExp?:(v:any) => any
    tag?:any
    exp?:any
    validators?: ValidatorFn[]
    validationMessages? : { [key: string]: string }  
    order?:number
  }

export type FieldDescribes = ({
    [key: string]:FieldDescribe
  })

 /**
 * @stable
 */
export interface ValidatorFn {
    (c: AbstractControl): ValidationErrors | null;
}