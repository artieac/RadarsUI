import { isValid } from 'Apps/Common/Utilities'

export class RadarViewParams {
    isPublic = true;
    subscriptionIdParam = -1;
    authenticatedUser = null;
    radarTemplateIdParam = -1;
    radarIdParam = -1;
    getMostRecent = false;
    getFullView = false;

    constructor(isPublic, subscriptionId, authenticatedUser, radarTemplateId, radarId, mostRecent, fullView){
        this.isPublic = isPublic;
        this.subscriptionIdParam = subscriptionId;
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

    getSubscriptionIdToView() {
        if(this.isPublic==true || (isValid(this.subscriptionIdParam) && this.subscriptionIdParam > 0)){
            return this.subscriptionIdParam;
        } else {
            // Fall back to the authenticated user's own subscriptionId
            if(isValid(this.authenticatedUser) && isValid(this.authenticatedUser.subscriptionId)){
                return this.authenticatedUser.subscriptionId;
            }
        }
        return -1;
    }

    /**
     * @deprecated Use getSubscriptionIdToView() instead.
     * Kept for backward compatibility with any components that may still call this.
     */
    getUserIdToView() {
        return this.getSubscriptionIdToView();
    }
}