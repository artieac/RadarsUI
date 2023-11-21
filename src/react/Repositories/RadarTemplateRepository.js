import { RestClient } from './RestClient'

export class RadarTemplateRepository extends RestClient {
    createDefaultRadarTemplate(name){
            var retVal = {};
            retVal.id = -1;
            retVal.name= name;

            retVal.radarRings = [];
            retVal.radarRings.push(this.createDefaultRadarTemplateDetail(-1, "RadarRingOne", "1"));
            retVal.radarRings.push(this.createDefaultRadarTemplateDetail(-2, "RadarRingTwo", "2"));
            retVal.radarRings.push(this.createDefaultRadarTemplateDetail(-3, "RadarRingThree", "3"));
            retVal.radarRings.push(this.createDefaultRadarTemplateDetail(-4, "RadarRingFour", "4"));

            retVal.radarCategories = [];
            retVal.radarCategories.push(this.createDefaultRadarTemplateDetail(-1, "RadarCategoryOne", "#8FA227"));
            retVal.radarCategories.push(this.createDefaultRadarTemplateDetail(-2, "RadarCategoryTwo", "#8FA227"));
            retVal.radarCategories.push(this.createDefaultRadarTemplateDetail(-3, "RadarCategoryTwo", "#8FA227"));
            retVal.radarCategories.push(this.createDefaultRadarTemplateDetail(-4, "RadarCategoryTwo", "#8FA227"));

            return retVal;
    }

    createDefaultRadarTemplateDetail(id, name, option){
            var retVal = {};
            retVal.id = id;
            retVal.name= name;
            retVal.displayOption = option;
            return retVal;
    }

    getPublicByUserId(userId, responseHandler){
        var getUrl = '/api/public/User/' + userId + '/RadarTemplates';

        this.getRequest(getUrl, responseHandler);
    }

    getByUserId(userId, responseHandler) {
        var getUrl = '/api/User/' + userId + '/RadarTemplates';

        this.getRequest(getUrl, responseHandler);
    }

    getMostRecentByUserId(userId, responseHandler) {
        var getUrl = '/api/User/' + userId + '/RadarTemplates?mostRecent=true';

        this.getRequest(getUrl, responseHandler);
    }

    getHistory(userId, radarTemplateId, responseHandler){
        var getUrl = '/api/User/' + userId + '/RadarTemplate/' + radarTemplateId;

        this.getRequest(getUrl, responseHandler);
    }

    getOwnedAndAssociatedByUserId(userId, responseHandler){
        var url = '/api/User/' + userId + '/RadarTemplates?includeOwned=true&includeAssociated=true';

        this.getRequest(url, responseHandler);
     }

    getOtherUsersSharedRadarTemplates(userId, responseHandler){
        var url = '/api/RadarTemplates/Shared?excludeUser=-1';

        this.getRequest(url, responseHandler);
    }

    getAssociatedRadarTemplates(userId, responseHandler){
        let url = '/api/User/' + userId + '/RadarTemplates/Associated';

        this.getRequest(url, responseHandler);
    }

    addRadarTemplate(userId, radarTemplate, responseHandler) {
         let url = '/api/User/' + userId + '/RadarTemplate';

         this.postRequest(url, radarTemplate, responseHandler);
    }

    updateRadarTemplate(userId, radarTemplate, responseHandler) {
         let url = '/api/User/' + userId + '/RadarTemplate/' + radarTemplate.id;

         this.putRequest(url, radarTemplate, responseHandler);
    }

    deleteRadarTemplate(userId, radarTemplateId, responseHandler){
         let url = '/api/User/' + userId + '/RadarTemplate/' + radarTemplateId;

         this.deleteRequest(url, responseHandler);
    }

    deleteRadarRing(userId, radarTemplateId, radarRingId, responseHandler){
        let url = '/api/User/' + userId + '/RadarTemplate/' + radarTemplateId + '/ring/' + radarRingId;

        this.deleteRequest(url, responseHandler);
    }

    associateRadarTemplate(userId, radarTemplateId, shouldAssociate, responseHandler) {
         let url = '/api/User/' + userId + '/RadarTemplate/' + radarTemplateId + '/Associate';

         var radarTemplateAssociation = {};
         radarTemplateAssociation.shouldAssociate = shouldAssociate;

         this.putRequest(url, radarTemplateAssociation, responseHandler);
    }

   getPublishedRadarTemplates(responseHandler) {
        let url = '/api/public/RadarTemplates/Published';

        this.getRequest(url, responseHandler);
   }
};