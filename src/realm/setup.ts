import {createRealmContext} from '@realm/react';

import { ZellerCustomer } from './models/ZellerCustomer';
export const { RealmProvider,useObject,useProgress,useQuery,useRealm} = createRealmContext({
    schema: [ZellerCustomer],
    schemaVersion: 1,
    deleteRealmIfMigrationNeeded: true,
});