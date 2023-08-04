import { gql } from "graphql-request"

export const query = (username: string) => gql`
    {
        user(login: "${username}") {
            pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                    ... on Repository {
                        name
                        url
                        primaryLanguage {
                            name
                            color
                        }
                        description
                        homepageUrl
                    }
                }
            }
        }
    }
`