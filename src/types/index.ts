import { EROLES } from "../utils/enum";

 export interface IZellerCustomer  {
    id: string;
    name: string;
   role: EROLES;
   email: string;
};
  


export type StackParamList= {
  Dashboard: undefined;
  AddNewUser: undefined;
};


export interface IGetZellerCustomersResponse {
  listZellerCustomers: {
    items: IZellerCustomer[];
  };
}