import { RestClient } from './RestClient';

export class SubscriptionRepository extends RestClient {

    getAllRights(responseHandler: Function) {
        this.getRequest('/api/SubscriptionRights', responseHandler);
    }

    getAllTiers(responseHandler: Function) {
        this.getRequest('/api/SubscriptionTiers', responseHandler);
    }

    getAllGrants(responseHandler: Function) {
        this.getRequest('/api/SubscriptionTierGrants', responseHandler);
    }

    saveGrant(tierId: number, rightId: number, value: number, responseHandler: Function) {
        this.postRequest('/api/SubscriptionTierGrants', { tierId, rightId, value }, responseHandler);
    }

    getAllSubscriptions(responseHandler: Function) {
        this.getRequest('/api/Subscriptions', responseHandler);
    }

    updateSubscription(id: number, owningUserId: number, subscriptionTierId: number, responseHandler: Function) {
        this.putRequest(`/api/Subscriptions/${id}`, { owningUserId, subscriptionTierId }, responseHandler);
    }
}
