import { isValid } from 'Apps/Common/Utilities'

export class RadarViewParams {
    isPublic = true;
    userIdParam = -1;
    authenticatedUser = null;
    radarTemplateIdParam = -1;
    radarIdParam = -1;
    getMostRecent = false;

    constructor(isPublic, userId, authenticatedUser, radarTemplateId, radarId, mostRecent){
        this.isPublic = isPublic;
        this.userIdParam = userId;
        this.authenticatedUser = authenticatedUser;
        this.radarTemplateIdParam = radarTemplateId;
        this.radarIdParam = radarId;
        this.getMostRecent = mostRecent;
    }

    getUserIdToView() {
        if(this.isPublic==true){
            return this.userIdParam;
        } else {
            if(isValid(this.authenticatedUser) && isValid(this.authenticatedUser.id)){
                return this.authenticatedUser.id;
            }
        }

        return -1;
    }
}