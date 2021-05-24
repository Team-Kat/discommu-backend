import { model } from "mongoose";

import ReportSchema from "./reports.schema";
import { IReportDocument, IReportModel } from "./reports.types";

export const ReportModel = model<IReportDocument, IReportModel>("report", ReportSchema);