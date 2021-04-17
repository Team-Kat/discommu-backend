import { Document, Model } from "mongoose";

export enum reportType {
    POST = 0,
    CATEGORY = 1,
    USER = 2,
    SUGGEST = 3
}


export interface IReport {
    content: string;
    data?: String;
    timestamp: number;
    type: reportType;
    userID: string;
}

export interface IReportDocument extends Document, IReport {
    addHeart: (this: IReportDocument, userID: string) => Promise<void>;
    removeHeart: (this: IReportDocument, userID: string) => Promise<void>;
    watch: () => Promise<IReportDocument>;
    edit: (data: { title: string, content: string, tag: string[] }) => Promise<void>;
};

export interface IReportModel extends Model<IReportDocument> {
    findByTag: (tag: string) => Promise<Array<IReportDocument>>;
    searchReports: (query: string) => Promise<Array<IReportDocument>>;
    createReport: (data: IReportDocument) => Promise<IReportDocument>;
};