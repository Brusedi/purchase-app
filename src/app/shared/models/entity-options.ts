import { anyEntityOptions, AnyEntityId } from "./any-entity";

export const NvaPlanPurchaseLine:anyEntityOptions<AnyEntityId> = {
  name: "NvaPlanPurchaseLine", 
  location:"/NvaAx/NvaPlanPurchaseLine", 
  selectId: (x) => x.RECID,
  selBack: (x:string) => ("?RECID=" + x )
};    