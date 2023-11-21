import { isValid } from 'Apps/Common/Utilities'

export class RadarViewParams {
    isPublic = true;
    userIdParam = -1;
    loggedInUser = null;
    radarTemplateIdParam = -1;
    radarIdParam = -1;
    getMostRecent = false;

    constructor(isPublic, userId, loggedInUser, radarTemplateId, radarId, mostRecent){
        this.isPublic = isPublic;
        this.userIdParam = userId;
        this.loggedInUser = loggedInUser;
        this.radarTemplateIdParam = radarTemplateId;
        this.radarIdParam = radarId;
        this.getMostRecent = mostRecent;
    }

    getUserIdToView() {
        if(this.isPublic==true){
            return this.userIdParam;
        } else {
            if(isValid(this.loggedInUser) && isValid(this.loggedInUser.id)){
                return this.loggedInUser.id;
            }
        }

        return -1;
    }
}