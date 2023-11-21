import { RestClient } from './RestClient'

export class UserRepository extends RestClient {
    getUser(responseHandler: Function) {
        let getUrl = '/api/User';
        this.getRequest(getUrl, responseHandler);
    }

    getUserById(userId: number, responseHandler: Function) {
        let getUrl = '/api/User/' + userId;
        this.getRequest(getUrl, responseHandler);
    }

     getAll(responseHandler: Function) {
        let getUrl = '/api/Users';
        this.getRequest(getUrl, responseHandler);
    }
}
