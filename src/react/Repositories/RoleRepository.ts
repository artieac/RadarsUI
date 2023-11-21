import { RestClient } from './RestClient'

export class RoleRepository extends RestClient {
     getAll(responseHandler: Function) {
        let getUrl = '/api/roles';
        this.getRequest(getUrl, responseHandler);
    }
}