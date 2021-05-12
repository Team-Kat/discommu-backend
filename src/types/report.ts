export enum reportType {
    POST = 0,
    CATEGORY = 1,
    USER = 2,
    SUGGEST = 3
}

export type TReport = {
    content: string,
    timestamp: number,
    type: reportType,
    data: string
}