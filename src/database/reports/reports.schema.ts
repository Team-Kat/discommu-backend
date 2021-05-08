import { Schema } from "mongoose";

import { report } from "./reports.statics";
import { edit } from "./reports.methods";
import { IReportDocument, IReportModel } from "./reports.types";

import { reportType } from "../../types/report";

const Reportchema = new Schema<IReportDocument, IReportModel>({
    content: String,
    data: {
        type: String,
        default: ''
    },
    timestamp: Number,
    type: {
        type: String,
        enum: reportType,
        default: reportType.SUGGEST
    }
});

Reportchema.statics.report = report;
Reportchema.methods.edit = edit;

export default Reportchema;