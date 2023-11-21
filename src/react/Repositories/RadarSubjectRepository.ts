import { RestClient } from './RestClient'

export class RadarSubjectRepository extends RestClient {
     getRadarSubjectAssessments(radarSubjectId: number, responseHandler: Function) {
        let url = "/api/public/RadarSubject/" + radarSubjectId + "/assessments";
        this.getRequest(url, responseHandler);
    }
}