import { RestClient } from './RestClient'

export class TeamRepository extends RestClient {
     getAllByUser(userId: number, responseHandler: Function) {
        let getUrl = '/api/User/' + userId + '/Teams';
        this.getRequest(getUrl, responseHandler);
     }

     getTeam(userId: number, teamId: number, responseHandler: Function) {
        let getUrl = '/api/User/' + userId + '/Team/' + teamId;
        this.getRequest(getUrl, responseHandler);
    }

    addTeam(userId: number, teamName: string, responseHandler: Function) {
        let url = '/api/User/' + userId + '/Team';

        let teamToAdd = { name: teamName };
        this.postRequest(url, teamToAdd, responseHandler);
    }
}
