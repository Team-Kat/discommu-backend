export enum categoryType {
    MINI = 1,
    VERIFIED = 2,
    OFFICIAL = 3
}

export type TCategory = {
    authorID: string,
    name: string,
    description: string,
    type: categoryType
}