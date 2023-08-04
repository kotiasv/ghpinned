import { GraphQLClient } from "graphql-request"
import { query } from "./graphql"

type GithubQuery = {
    name: string
    url: string
    primaryLanguage: {
        name: string
        color: string
    }
    description: string
    homepageUrl: string
}

type GithubGraphqlResponse = {
    user: {
        pinnedItems: {
            nodes: GithubQuery[]
        }
    }
}

class GithubClient {
    token: string | null
    client: GraphQLClient

    constructor() {
        this.token = null
        this.client = new GraphQLClient("https://api.github.com/graphql")
    }

    setToken(token: string) {
        this.token = token
        this.client.setHeader("Authorization", `Bearer ${token}`)
    }

    async getPinnedRepos(username: string) {
        if (!this.token)
            return []

        const res: GithubGraphqlResponse =
            await this.client.request(query(username))

        console.log(res)
        const repos = res.user.pinnedItems.nodes
        return repos
    }
}

export default GithubClient
