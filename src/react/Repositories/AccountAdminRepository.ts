import { RestClient } from './RestClient';

const BASE = '/api/AccountAdmin';

/**
 * Repository for all Account Management UI operations.
 * All calls route to /api/AccountAdmin/** which requires ROLE_ACCOUNT_ADMIN on the backend.
 */
export class AccountAdminRepository extends RestClient {

    // ── Client-side helpers (no API call) ───────────────────────────────────

    createDefaultRadarTemplate(name: any) {
        const retVal: any = {};
        retVal.id = -1;
        retVal.name = name;
        retVal.radarRings = [
            this.createDefaultRadarTemplateDetail(-1, 'RadarRingOne', '1'),
            this.createDefaultRadarTemplateDetail(-2, 'RadarRingTwo', '2'),
            this.createDefaultRadarTemplateDetail(-3, 'RadarRingThree', '3'),
            this.createDefaultRadarTemplateDetail(-4, 'RadarRingFour', '4'),
        ];
        retVal.radarCategories = [
            this.createDefaultRadarTemplateDetail(-1, 'RadarCategoryOne', '#8FA227'),
            this.createDefaultRadarTemplateDetail(-2, 'RadarCategoryTwo', '#8FA227'),
            this.createDefaultRadarTemplateDetail(-3, 'RadarCategoryThree', '#8FA227'),
            this.createDefaultRadarTemplateDetail(-4, 'RadarCategoryFour', '#8FA227'),
        ];
        return retVal;
    }

    createDefaultRadarTemplateDetail(id: number, name: string, option: string) {
        return { id, name, displayOption: option };
    }

    // ── User ────────────────────────────────────────────────────────────────

    getUser(responseHandler: Function) {
        this.getRequest(`${BASE}/User`, responseHandler);
    }

    // ── Radar Templates ─────────────────────────────────────────────────────

    getRadarTemplates(subscriptionId: number | string, responseHandler: Function) {
        this.getRequest(`${BASE}/Subscription/${subscriptionId}/RadarTemplates`, responseHandler);
    }

    getOwnedAndAssociatedTemplates(subscriptionId: number | string, responseHandler: Function) {
        this.getRequest(`${BASE}/Subscription/${subscriptionId}/RadarTemplates?includeOwned=true&includeAssociated=true`, responseHandler);
    }

    getAssociatedRadarTemplates(subscriptionId: number | string, responseHandler: Function) {
        this.getRequest(`${BASE}/Subscription/${subscriptionId}/RadarTemplates/Associated`, responseHandler);
    }

    getSharedRadarTemplates(subscriptionId: number | string, responseHandler: Function) {
        this.getRequest(`${BASE}/RadarTemplates/Shared?excludeSubscription=${subscriptionId}`, responseHandler);
    }

    addRadarTemplate(subscriptionId: number | string, radarTemplate: any, responseHandler: Function) {
        this.postRequest(`${BASE}/Subscription/${subscriptionId}/RadarTemplate`, radarTemplate, responseHandler);
    }

    updateRadarTemplate(subscriptionId: number | string, radarTemplate: any, responseHandler: Function) {
        this.putRequest(`${BASE}/Subscription/${subscriptionId}/RadarTemplate/${radarTemplate.id}`, radarTemplate, responseHandler);
    }

    deleteRadarTemplate(subscriptionId: number | string, radarTemplateId: number | string, responseHandler: Function) {
        this.deleteRequest(`${BASE}/Subscription/${subscriptionId}/RadarTemplate/${radarTemplateId}`, responseHandler);
    }

    associateRadarTemplate(subscriptionId: number | string, radarTemplateId: number | string, shouldAssociate: boolean, responseHandler: Function) {
        this.putRequest(`${BASE}/Subscription/${subscriptionId}/RadarTemplate/${radarTemplateId}/Associate`, { shouldAssociate }, responseHandler);
    }

    // ── Radars ──────────────────────────────────────────────────────────────

    getRadars(subscriptionId: number | string, responseHandler: Function) {
        this.getRequest(`${BASE}/Subscription/${subscriptionId}/Radars`, responseHandler);
    }

    addRadar(subscriptionId: number | string, radarName: string, radarTemplate: any, responseHandler: Function) {
        this.postRequest(`${BASE}/Subscription/${subscriptionId}/Radar`, { name: radarName, radarTemplateId: radarTemplate.id }, responseHandler);
    }

    publishRadar(subscriptionId: number | string, radarId: number | string, isPublished: boolean, responseHandler: Function) {
        this.putRequest(`${BASE}/Subscription/${subscriptionId}/Radar/${radarId}/Publish`, { isPublished }, responseHandler);
    }

    lockRadar(subscriptionId: number | string, radarId: number | string, isLocked: boolean, responseHandler: Function) {
        this.putRequest(`${BASE}/Subscription/${subscriptionId}/Radar/${radarId}/Lock`, { isLocked }, responseHandler);
    }

    deleteRadar(subscriptionId: number | string, radarId: number | string, responseHandler: Function) {
        this.putRequest(`${BASE}/Subscription/${subscriptionId}/Radar/${radarId}/Delete`, {}, responseHandler);
    }

    // ── Grant Access ────────────────────────────────────────────────────────

    getSeatStatus(subscriptionId: number | string, responseHandler: Function) {
        this.getRequest(`${BASE}/Subscription/${subscriptionId}/seat-status`, responseHandler);
    }

    searchUsers(query: string, responseHandler: Function) {
        const encoded = encodeURIComponent(query);
        this.getRequest(`${BASE}/Users/search?q=${encoded}`, responseHandler);
    }

    getGrants(subscriptionId: number | string, responseHandler: Function) {
        this.getRequest(`${BASE}/Subscription/${subscriptionId}/grants`, responseHandler);
    }

    grantAccess(subscriptionId: number | string, targetUserId: number | string, roleId: number, responseHandler: Function) {
        this.postRequest(`${BASE}/Subscription/${subscriptionId}/grants`, { targetUserId, roleId }, responseHandler);
    }

    revokeAccess(subscriptionId: number | string, grantId: number | string, responseHandler: Function) {
        this.deleteRequest(`${BASE}/Subscription/${subscriptionId}/grants/${grantId}`, responseHandler);
    }

    updateGrantRole(subscriptionId: number | string, grantId: number | string, roleId: number, responseHandler: Function) {
        this.putRequest(`${BASE}/Subscription/${subscriptionId}/grants/${grantId}`, { roleId }, responseHandler);
    }
}
