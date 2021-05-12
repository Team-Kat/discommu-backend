export enum categoryType {
    MINI = 1,
    VERIFIED = 2,
    OFFICIAL = 3
}

export enum categorySort {
    NEWEST = "newest",
    ALPHABETIC = "alphabetic",
    POST = "posts"
}

export type TCategory = {
    authorID: string,
    name: string,
    description: string,
    type: categoryType
}