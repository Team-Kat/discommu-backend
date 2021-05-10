import { Document, Model } from "mongoose";
import { reportType } from "../../types/report";


export interface IReport {
    content: string;
    data?: String;
    timestamp: number;
    type: reportType;
    userID: string;
}

export interface IReportDocument extends Document, IReport { };

export interface IReportModel extends Model<IReportDocument> {
    findByTag: (tag: string) => Promise<Array<IReportDocument>>;
    searchReports: (query: string) => Promise<Array<IReportDocument>>;
    createReport: (data: IReportDocument) => Promise<IReportDocument>;
};