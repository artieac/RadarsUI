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

    getPublicByUserId(subscriptionId, responseHandler){
        var getUrl = '/api/public/Subscription/' + subscriptionId + '/RadarTemplates';
        this.getRequest(getUrl, responseHandler);
    }

    getByUserId(subscriptionId, responseHandler) {
        var getUrl = '/api/Subscription/' + subscriptionId + '/RadarTemplates';
        this.getRequest(getUrl, responseHandler);
    }

    getMostRecentByUserId(subscriptionId, responseHandler) {
        var getUrl = '/api/Subscription/' + subscriptionId + '/RadarTemplates?mostRecent=true';
        this.getRequest(getUrl, responseHandler);
    }

    getHistory(subscriptionId, radarTemplateId, responseHandler){
        var getUrl = '/api/Subscription/' + subscriptionId + '/RadarTemplate/' + radarTemplateId;
        this.getRequest(getUrl, responseHandler);
    }

    getOwnedAndAssociatedBySubscriptionId(subscriptionId, responseHandler){
        var url = '/api/Subscription/' + subscriptionId + '/RadarTemplates?includeOwned=true&includeAssociated=true';
        this.getRequest(url, responseHandler);
     }

    getOtherUsersSharedRadarTemplates(subscriptionId, responseHandler){
        var url = '/api/RadarTemplates/Shared?excludeUser=' + subscriptionId;
        this.getRequest(url, responseHandler);
    }

    getAssociatedRadarTemplates(subscriptionId, responseHandler){
        let url = '/api/Subscription/' + subscriptionId + '/RadarTemplates/Associated';
        this.getRequest(url, responseHandler);
    }

    addRadarTemplate(subscriptionId, radarTemplate, responseHandler) {
         let url = '/api/Subscription/' + subscriptionId + '/RadarTemplate';
         this.postRequest(url, radarTemplate, responseHandler);
    }

    updateRadarTemplate(subscriptionId, radarTemplate, responseHandler) {
         let url = '/api/Subscription/' + subscriptionId + '/RadarTemplate/' + radarTemplate.id;
         this.putRequest(url, radarTemplate, responseHandler);
    }

    deleteRadarTemplate(subscriptionId, radarTemplateId, responseHandler){
         let url = '/api/Subscription/' + subscriptionId + '/RadarTemplate/' + radarTemplateId;
         this.deleteRequest(url, responseHandler);
    }

    deleteRadarRing(subscriptionId, radarTemplateId, radarRingId, responseHandler){
        let url = '/api/Subscription/' + subscriptionId + '/RadarTemplate/' + radarTemplateId + '/ring/' + radarRingId;
        this.deleteRequest(url, responseHandler);
    }

    associateRadarTemplate(subscriptionId, radarTemplateId, shouldAssociate, responseHandler) {
         let url = '/api/Subscription/' + subscriptionId + '/RadarTemplate/' + radarTemplateId + '/Associate';

         var radarTemplateAssociation = {};
         radarTemplateAssociation.shouldAssociate = shouldAssociate;

         this.putRequest(url, radarTemplateAssociation, responseHandler);
    }

   getPublishedRadarTemplates(responseHandler) {
        let url = '/api/public/RadarTemplates/Published';
        this.getRequest(url, responseHandler);
   }
};