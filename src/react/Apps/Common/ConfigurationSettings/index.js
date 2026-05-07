import jQuery from 'jquery';

export default class ConfigurationSettings {
    getMainSiteUrlRoot(){
        let url = import.meta.env.REACT_APP_TECHNOLOGY_SITE_URL;
        return this.ensureHttpsIfRequired(url);
    }

    getWebServiceUrlRoot() {
        let url = import.meta.env.REACT_APP_TECHNOLOGY_API_URL;
        return this.ensureHttpsIfRequired(url);
    }

    getManageRadarsUrlRoot() {
        let url = import.meta.env.REACT_APP_TECHNOLOGY_MANAGE_RADARS_URL;
        return this.ensureHttpsIfRequired(url);
    }

    getAdminRadarsUrlRoot() {
        let url = import.meta.env.REACT_APP_TECHNOLOGY_ADMIN_URL;
        return this.ensureHttpsIfRequired(url);
    }

    ensureHttpsIfRequired(url) {
        if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url && url.startsWith('http://')) {
            if (!url.includes('local') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
                url = url.replace('http://', 'https://');
            }
        }
        return url;
    }
}