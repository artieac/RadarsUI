import { isValid } from 'Apps/Common/Utilities'

export class RadarViewParams {
    isPublic = true;
    userIdParam = -1;
    authenticatedUser = null;
    radarTemplateIdParam = -1;
    radarIdParam = -1;
    getMostRecent = false;
    getFullView = false;

    constructor(isPublic, userId, authenticatedUser, radarTemplateId, radarId, mostRecent, fullView){
        this.isPublic = isPublic;
        this.userIdParam = userId;
        this.authenticatedUser = authenticatedUser;
        this.radarTemplateIdParam = radarTemplateId;
        this.radarIdParam = radarId;

        if(isValid(mostRecent)){
            this.getMostRecent = mostRecent;
        }

        if(isValid(fullView)){
            this.getFullView = fullView;
        }
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