import axios from "axios"
import { JSDOM } from "jsdom"

const valueToHex = (color: number) => color >= 16
    ? color.toString(16)
    : `0${color.toString(16)}`

const fetchPage = async (link: string): Promise<Document> => {
    const { data }: {
        data: string
    } = await axios.get(link)
    const dom = new JSDOM(data)
    return dom.window.document
}

const getRepo = (item: Element) =>
    item.querySelector(".repo")?.textContent as string

const getDescription = (item: Element) =>
    item.querySelector(".pinned-item-desc")
        ?.textContent
        ?.trim() as string

const getLinks = async (
    item: Element, username: string, repo: string
) => {
    const github = `https://github.com/${username}/${repo}`
    const document = await fetchPage(github)

    const aboutBlock = Array.from(
        document.querySelectorAll(".BorderGrid-cell")
    )[0]
    const link = Array.from(
        aboutBlock.getElementsByTagName("a")
    )[0].getAttribute("href")
    const website = link?.startsWith("#")
        ? null
        : link

    return {
        github,
        website
    } as {
        github: string
        website: string | null
    }
}

const getLanguage = (item: Element) => {
    const name = item
        .querySelector('[itemprop="programmingLanguage"]')
        ?.textContent as string
    const circle = item.querySelector(".repo-language-color") as Element & {
        style: {
            backgroundColor: string
        }
    }
    const rgbColor = circle.style.backgroundColor.trim()
    const color = "#" + rgbColor
        .replace(/[a-z(]+/, "")
        .replace(/[)]/, "")
        .split(",")
        .map(part => valueToHex(Number(part)))
        .join("")

    return {
        name,
        color
    }
}

export type PinnedRepos = [] | {
    repo: string
    description: string
    links: {
        github: string
        website: string | null
    }
    language: {
        name: string
        color: string
    }
}[]

export const ghPinned = async (username: string): Promise<PinnedRepos> => {
    const result = []
    const document = await fetchPage(`https://github.com/${username}`)
    const pinned = Array.from(
        document.querySelectorAll(".pinned-item-list-item.public")
    )
    for (const [_, item] of pinned.entries()) {
        const repo = getRepo(item)
        result.push({
            repo,
            description: getDescription(item),
            links: await getLinks(item, username, repo),

            language: getLanguage(item),
        })
    }

    return result
}