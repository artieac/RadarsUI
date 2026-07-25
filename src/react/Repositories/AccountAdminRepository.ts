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

    getRadarTemplates(userId: number | string, responseHandler: Function) {
        this.getRequest(`${BASE}/User/${userId}/RadarTemplates`, responseHandler);
    }

    getOwnedAndAssociatedTemplates(userId: number | string, responseHandler: Function) {
        this.getRequest(`${BASE}/User/${userId}/RadarTemplates?includeOwned=true&includeAssociated=true`, responseHandler);
    }

    getAssociatedRadarTemplates(userId: number | string, responseHandler: Function) {
        this.getRequest(`${BASE}/User/${userId}/RadarTemplates/Associated`, responseHandler);
    }

    getSharedRadarTemplates(excludeUserId: number | string, responseHandler: Function) {
        this.getRequest(`${BASE}/RadarTemplates/Shared?excludeUser=${excludeUserId}`, responseHandler);
    }

    addRadarTemplate(userId: number | string, radarTemplate: any, responseHandler: Function) {
        this.postRequest(`${BASE}/User/${userId}/RadarTemplate`, radarTemplate, responseHandler);
    }

    updateRadarTemplate(userId: number | string, radarTemplate: any, responseHandler: Function) {
        this.putRequest(`${BASE}/User/${userId}/RadarTemplate/${radarTemplate.id}`, radarTemplate, responseHandler);
    }

    deleteRadarTemplate(userId: number | string, radarTemplateId: number | string, responseHandler: Function) {
        this.deleteRequest(`${BASE}/User/${userId}/RadarTemplate/${radarTemplateId}`, responseHandler);
    }

    associateRadarTemplate(userId: number | string, radarTemplateId: number | string, shouldAssociate: boolean, responseHandler: Function) {
        this.putRequest(`${BASE}/User/${userId}/RadarTemplate/${radarTemplateId}/Associate`, { shouldAssociate }, responseHandler);
    }

    // ── Radars ──────────────────────────────────────────────────────────────

    getRadars(userId: number | string, responseHandler: Function) {
        this.getRequest(`${BASE}/User/${userId}/Radars`, responseHandler);
    }

    addRadar(userId: number | string, radarName: string, radarTemplate: any, responseHandler: Function) {
        this.postRequest(`${BASE}/User/${userId}/Radar`, { name: radarName, radarTemplateId: radarTemplate.id }, responseHandler);
    }

    publishRadar(userId: number | string, radarId: number | string, isPublished: boolean, responseHandler: Function) {
        this.putRequest(`${BASE}/User/${userId}/Radar/${radarId}/Publish`, { isPublished }, responseHandler);
    }

    lockRadar(userId: number | string, radarId: number | string, isLocked: boolean, responseHandler: Function) {
        this.putRequest(`${BASE}/User/${userId}/Radar/${radarId}/Lock`, { isLocked }, responseHandler);
    }

    deleteRadar(userId: number | string, radarId: number | string, responseHandler: Function) {
        this.putRequest(`${BASE}/User/${userId}/Radar/${radarId}/Delete`, {}, responseHandler);
    }

    // ── Grant Access ────────────────────────────────────────────────────────

    searchUsers(query: string, responseHandler: Function) {
        const encoded = encodeURIComponent(query);
        this.getRequest(`${BASE}/Users/search?q=${encoded}`, responseHandler);
    }

    getGrants(responseHandler: Function) {
        this.getRequest(`${BASE}/grants`, responseHandler);
    }

    grantAccess(targetUserId: number | string, roleId: number, responseHandler: Function) {
        this.postRequest(`${BASE}/grants`, { targetUserId, roleId }, responseHandler);
    }

    revokeAccess(grantId: number | string, responseHandler: Function) {
        this.deleteRequest(`${BASE}/grants/${grantId}`, responseHandler);
    }
}
