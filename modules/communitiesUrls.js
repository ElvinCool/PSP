class CommunitieUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getCommunities() {
        return `${this.baseUrl}/communities`;
    }

    getCommunitieById(id) {
        return `${this.baseUrl}/communities/${id}`;
    }

    createCommunitie() {
        return `${this.baseUrl}/communities`;
    }

    removeCommunitieById(id) {
        return `${this.baseUrl}/communities/${id}`;
    }

    updateCommunitieById(id) {
        return `${this.baseUrl}/communities/${id}`;
    }
}

export const communitiesUrls = new CommunitieUrls();