export type GithubQuery = {
    name: string
    url: string
    primaryLanguage: {
        name: string
        color: string
    }
    description: string
    homepageUrl: string
}

export type GithubGraphqlResponse = {
    user: {
        pinnedItems: {
            nodes: GithubQuery[]
        }
    }
}