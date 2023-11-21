import { RestClient } from './RestClient'

export class RadarRepository extends RestClient {

    generateUrlBase(isAnonymous) {
        let url = '/api';

        if(isAnonymous==true) {
            url += '/public';
        }

        return url;
    }

    getByUserId(userId, getAllVersions, responseHandler) {
        var url = '/api/User/' + userId + '/Radars';

        if(getAllVersions==true){
            url += "?getAllVersions=true";
        }

        this.getRequest(url, responseHandler);
    }

    getByUserIdAndRadarId(userId, radarId, responseHandler) {
        this.getByUserIdAndRadarId(false, userId, radarId, responseHandler);
    }

    getByUserIdAndRadarId(isAnonymous, userId, radarId, responseHandler) {
        let url = this.generateUrlBase(isAnonymous) + '/User/' + userId + '/Radar/' + radarId;
        this.getRequest(url, responseHandler);
    }

    getRadarsByUserIdAndRadarTemplateId(isAnonymous, userId, radarTemplateId, responseHandler){
       let url = this.generateUrlBase(isAnonymous) + '/User/' + userId + '/Radars?radarTemplateId=' + radarTemplateId;
        this.getRequest(url, responseHandler);
    }

    publishRadar(userId, radarId, isPublished, responseHandler) {
         let url = '/api/User/' + userId + '/Radar/' + radarId + '/Publish';

         var radarToUpdate = {};
         radarToUpdate.isPublished = isPublished;

         this.putRequest(url, radarToUpdate, responseHandler);
    }

    lockRadar(userId, radarId, isLocked, responseHandler) {
        let url = '/api/User/' + userId + '/Radar/' + radarId + '/Lock';

        var radarToUpdate = {};
        radarToUpdate.isLocked = isLocked;

        this.putRequest(url, radarToUpdate, responseHandler);
    }

    deleteRadar(userId, radarId, responseHandler) {
        let url = '/api/User/' + userId + '/Radar/' + radarId;

        this.deleteRequest(url, responseHandler);
    }

    addRadar(userId, radarName, radarTemplate, responseHandler) {
        let url = '/api/User/' + userId + '/Radar';

        var radarToAdd = {};
        radarToAdd.name = radarName;
        radarToAdd.radarTemplateId = radarTemplate.id;

        this.postRequest(url, radarToAdd, responseHandler);
    }

    addItemsToRadar(userId, radarId, radarItems, responseHandler){
        let url = '/api/User/' + userId + '/Radar/' + radarId + '/Items';

        var itemsToAdd = {};
        itemsToAdd.radarItems = radarItems;

        this.postRequest(url, itemsToAdd, responseHandler);
    }

    removeItemsFromRadar(userId, radarId, radarItems, responseHandler){
        let url = '/api/User/' + userId + '/Radar/' + radarId + '/Items/Delete';

        var itemsToRemove = {};
        itemsToRemove.radarItems = radarItems;

        this.postRequest(url, itemsToRemove, responseHandler);
    }

    getMostRecentRadar(isAnonymous, userId, responseHandler){
        let url = this.generateUrlBase(isAnonymous) + '/User/'  + userId + '/Radar/mostRecent'
        this.getRequest(url, responseHandler);
    }

    getFullView(isAnonymous, userId, radarTemplateId, responseHandler) {
       let url = this.generateUrlBase(isAnonymous) + '/User/' + userId + '/RadarTemplate/' + radarTemplateId + '/Radar/FullView';
       this.getRequest(url, responseHandler);
    }
};