import { Document, Model } from "mongoose";
import { reportType } from "../../types/report";


export interface IReport {
    content: string;
    data?: String;
    timestamp: number;
    type: reportType;
    userID: string;
};

export interface IReportDocument extends Document, IReport { };
export interface IReportModel extends Model<IReportDocument> { };