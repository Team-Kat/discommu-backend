import { Schema } from "mongoose";

import { report } from "./reports.statics";
import { IReportDocument, IReportModel } from "./reports.types";

import { reportType } from "../../types/report";

const Reportchema = new Schema<IReportDocument, IReportModel>({
    content: String,
    data: {
        type: String,
        default: ''
    },
    timestamp: Number,
    userID: String,
    type: {
        type: String,
        enum: reportType,
        default: reportType.SUGGEST
    }
});

Reportchema.statics.report = report;

export default Reportchema;