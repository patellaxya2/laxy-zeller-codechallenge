// src/models/Task.ts

import { Realm, BSON, ObjectSchema } from "realm";
import { IZellerCustomer } from "../../types";
import { EROLES } from "../../utils/enum";

export class ZellerCustomer extends Realm.Object<IZellerCustomer> {
  id!: string;
  name!: string;
  email!: string;
  role!: EROLES;
    constructor(realm:Realm,name:string,email:string,role:EROLES) { 
        super(realm, { name, email, role })
    }
  
  static schema: ObjectSchema = {
    name: "ZellerCustomer",
    primaryKey: "id",
    properties: {
      id: {
        type: "string",
        default: () =>  Date.now()+""
      },
      name: "string",
      email: "string",
      role: "string",      
    },
  };
}