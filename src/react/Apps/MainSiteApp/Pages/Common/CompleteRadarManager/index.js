export default class CompleteRadarManager {
   completeRadarId = -9999;
   completeRadarName = "Current";

   generateCompleteViewDropdownItem(userId, radarTemplate) {
        let retVal = {
            id: this.completeRadarId,
            name: this.completeRadarName,
            formattedAssessmentDate: "",
            userId: userId,
            radarTemplate: radarTemplate
        };

        return retVal;
    }

    isRadarTheCompleteView(radarId, radarName) {
        if(radarId==this.completeRadarId &&
           radarName==this.completeRadarName){
           return true;
       }

        return false;
    }
}