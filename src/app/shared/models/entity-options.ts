import { anyEntityOptions, AnyEntityId } from "./any-entity";

export const NvaPlanPurchaseLine:anyEntityOptions<AnyEntityId> = {
  name: "NvaPlanPurchaseLine", 
  location:"/NvaAx/NvaPlanPurchaseLine", 
  selectId: (x) => x.RECID,
  selBack: (x:string) => ("?RECID=" + x )
};    

export const NVA_EX_PlanPurch_Docs:anyEntityOptions<AnyEntityId> = {
  name: "NVA_EX_PlanPurch_Docs", 
  location:"/NvaAx/NVA_EX_PlanPurch_Docs", 
  selectId: (x) => x.RECID,
  selBack: (x:string) => ("?RECID=" + x )
};    