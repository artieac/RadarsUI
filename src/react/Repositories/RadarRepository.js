import { RestClient } from './RestClient'

export class RadarRepository extends RestClient {

    generateUrlBase(isAnonymous) {
        let url = '/api';

        if(isAnonymous==true) {
            url += '/public';
        }

        return url;
    }

    getBySubscriptionId(subscriptionId, getAllVersions, responseHandler) {
        var url = '/api/Subscription/' + subscriptionId + '/Radars';

        if(getAllVersions==true){
            url += "?getAllVersions=true";
        }

        this.getRequest(url, responseHandler);
    }

    getByUserIdAndRadarId(isAnonymous, subscriptionId, radarId, responseHandler) {
        let url = this.generateUrlBase(isAnonymous) + '/Subscription/' + subscriptionId + '/Radar/' + radarId;
        this.getRequest(url, responseHandler);
    }

    getRadarsBySubscriptionIdAndRadarTemplateId(isAnonymous, subscriptionId, radarTemplateId, responseHandler){
       let url = this.generateUrlBase(isAnonymous) + '/Subscription/' + subscriptionId + '/Radars?radarTemplateId=' + radarTemplateId;
        this.getRequest(url, responseHandler);
    }

    publishRadar(subscriptionId, radarId, isPublished, responseHandler) {
         let url = '/api/Subscription/' + subscriptionId + '/Radar/' + radarId + '/Publish';

         var radarToUpdate = {};
         radarToUpdate.isPublished = isPublished;

         this.putRequest(url, radarToUpdate, responseHandler);
    }

    lockRadar(subscriptionId, radarId, isLocked, responseHandler) {
        let url = '/api/Subscription/' + subscriptionId + '/Radar/' + radarId + '/Lock';

        var radarToUpdate = {};
        radarToUpdate.isLocked = isLocked;

        this.putRequest(url, radarToUpdate, responseHandler);
    }

    deleteRadar(subscriptionId, radarId, responseHandler) {
        let url = '/api/Subscription/' + subscriptionId + '/Radar/' + radarId + '/Delete';

        this.putRequest(url, {}, responseHandler);
    }

    addRadar(subscriptionId, radarName, radarTemplate, responseHandler) {
        let url = '/api/Subscription/' + subscriptionId + '/Radar';

        var radarToAdd = {};
        radarToAdd.name = radarName;
        radarToAdd.radarTemplateId = radarTemplate.id;

        this.postRequest(url, radarToAdd, responseHandler);
    }

    addItemsToRadar(subscriptionId, radarId, radarItems, responseHandler){
        let url = '/api/Subscription/' + subscriptionId + '/Radar/' + radarId + '/Items';

        var itemsToAdd = {};
        itemsToAdd.radarItems = radarItems;

        this.postRequest(url, itemsToAdd, responseHandler);
    }

    removeItemsFromRadar(subscriptionId, radarId, radarItems, responseHandler){
        let url = '/api/Subscription/' + subscriptionId + '/Radar/' + radarId + '/Items/Delete';

        var itemsToRemove = {};
        itemsToRemove.radarItems = radarItems;

        this.postRequest(url, itemsToRemove, responseHandler);
    }

    getMostRecentRadar(isAnonymous, subscriptionId, responseHandler){
        let url = this.generateUrlBase(isAnonymous) + '/Subscription/'  + subscriptionId + '/Radar/MostRecent'
        this.getRequest(url, responseHandler);
    }

    getMostRecentRadarByTemplate(isAnonymous, subscriptionId, radarTemplateId, responseHandler){
        let url = this.generateUrlBase(isAnonymous) + '/Subscription/'  + subscriptionId + '/RadarTemplate/' + radarTemplateId + '/Radars/MostRecent'
        this.getRequest(url, responseHandler);
    }

    getFullView(isAnonymous, subscriptionId, radarTemplateId, responseHandler) {
       let url = this.generateUrlBase(isAnonymous) + '/Subscription/' + subscriptionId + '/RadarTemplate/' + radarTemplateId + '/Radar/FullView';
       this.getRequest(url, responseHandler);
    }

    getQuadrant(isAnonymous, subscriptionId, radarId, quadrantName, responseHandler) {
        let url = this.generateUrlBase(isAnonymous) + '/Subscription/' + subscriptionId + '/Radar/' + radarId + '/Quadrant/' + quadrantName;
        this.getRequest(url, responseHandler);
    }
};