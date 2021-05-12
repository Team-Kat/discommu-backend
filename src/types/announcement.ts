export enum announcementType {
    POST = 0,
    CATEGORY = 1,
    ETC = 2
}

export type TAnnouncement = {
    title: string,
    content: string,
    timestamp: number,
    type: announcementType
}