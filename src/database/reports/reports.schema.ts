import { Schema } from "mongoose";
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
        type: Number,
        enum: reportType,
        default: reportType.SUGGEST
    }
});

export default Reportchema;