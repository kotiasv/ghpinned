import { GraphQLClient } from "graphql-request"
import { query } from "./graphql"
import { GithubGraphqlResponse } from "./types"

export class GithubClient {
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
            return {
                message: "You must set your GitHub API token. Use setToken(<token>)"
            }

        const res: GithubGraphqlResponse =
            await this.client.request(query(username))

        console.log(res)
        const repos = res.user.pinnedItems.nodes
        return repos
    }
}