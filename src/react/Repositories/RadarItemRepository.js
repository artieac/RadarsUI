import { RestClient } from './RestClient'
import { isValid } from 'Apps/Common/Utilities'

export class RadarItemRepository extends RestClient {
    createRadarItemForSubject(radarCategory, radarRing, confidenceFactor, details, radarSubject){
        var radarItem = {};

        if(radarCategory==null){
            radarCategory = {};
            radarCategory.name = "";
            radarCategory.id = -1;
        }

        radarItem.radarCategory = radarCategory;

        if(radarRing==null){
            radarRing = {};
            radarRing.name = "";
            radarRing.id = -1;
        }

        radarItem.radarRing = radarRing;

        if(confidenceFactor==null){
            confidenceFactor = {};
            confidenceFactor.name = "";
            confidenceFactor.id = -1;
        }

        radarItem.confidenceLevel = confidenceFactor;
        radarItem.assessmentDetails = details;
        radarItem.radarSubject = radarSubject;

        return radarItem;
    };

    createRadarItemForNewSubject(radarCategory, radarRing, confidenceFactor, details, subjectName, subjectUrl){
        let radarSubject = {};
        radarSubject.name = subjectName;
        radarSubject.url = subjectUrl;

        return this.createRadarItemForSubject(radarCategory, radarRing, confidenceFactor, details, radarSubject);
    };

     searchForRadarSubject(subjectName, selectedRadarTemplate, selectedCategory, selectedRing, isAnonymous, responseHandler) {
         var queryString = "";

         if(subjectName) {
             queryString += "name=" + subjectName;
         }

         if(isValid(selectedRadarTemplate) && isValid(selectedRadarTemplate.id)) {
             queryString +="&radarTemplateId=" + selectedRadarTemplate.id;
         }

         if(isValid(selectedCategory) && isValid(selectedCategory.id)) {
             queryString += "&radarCategoryId=" + selectedCategory.id;
         }

         if(isValid(selectedRing) && isValid(selectedRing.id)) {
             queryString += "&radarRingId=" + selectedRing.id;
         }

         let url = "";

         if(isAnonymous==true) {
             url = url + '/api/public/RadarSubject/search?' + queryString;
         }
         else {
             url = url + '/api/public/RadarSubject/search?' + queryString;
         }

         this.getRequest(url, responseHandler);
     };

    addRadarItem (userId, radarId, radarItem, responseHandler) {
        let url = '/api/User/' + userId + '/Radar/' + radarId + '/Item';

        var params = {};
        params.radarCategory = radarItem.radarCategory.id;
        params.radarRing = radarItem.radarRing.id;
        params.confidenceLevel = radarItem.confidenceLevel.id;
        params.assessmentDetails = radarItem.assessmentDetails;
        params.technologyName = radarItem.radarSubject.name;
        params.url = radarItem.radarSubject.url;

        this.postRequest(url, params, responseHandler);
    };

    addRadarItemNewSubject(userId, radarId, radarCategory, radarRing, confidenceLevel, details, subjectName, subjectUrl, responseHandler) {
         var radarItem = this.createRadarItemForNewSubject(radarCategory, radarRing, confidenceLevel, details, subjectName, subjectUrl);
         this.addRadarItem(userId, radarId, radarItem, responseHandler);
     };

    addRadarItemExistingSubject(userId, radarId, radarCategory, radarRing, confidenceLevel, details, radarSubject, responseHandler) {
         var radarItem = this.createRadarItemForSubject(radarCategory, radarRing, confidenceLevel, details, radarSubject);
         this.addRadarItem(userId, radarId, radarItem, successCallback, errorCallback);
     };

     updateRadarItem(userId, radarId, radarItemId, radarCategory, radarRing, confidenceLevel, details, radarSubject, responseHandler) {
        let url =  '/api/User/' + userId + '/Radar/' + radarId + '/Item/' + radarItemId;

        var params = {};
        params.radarCategory = radarCategory.id;
        params.radarRing = radarRing.id;
        params.confidenceLevel = confidenceLevel.id;
        params.assessmentDetails = details;
        params.technologyName = radarSubject.name;
        params.url = radarSubject.url;

        this.postRequest(url, params, responseHandler);
     };

     deleteRadarItem (userId, radarId, radarItemId, responseHandler){
        let url = '/api/User/' + userId + '/Radar/' + radarId + '/Item/' + radarItemId;

        this.deleteRequest(url, responseHandler);
     };

     deleteRadarItems(userId, radarId, radarItems, responseHandler){
         let url = '/api/User/' + userId + '/Radar/' + radarId + '/Items/Delete';

         var itemsToDelete = {};
         itemsToDelete.radarItems = radarItems;

         this. postRequest(url, itemsToDelete, responseHandler);
     };
};