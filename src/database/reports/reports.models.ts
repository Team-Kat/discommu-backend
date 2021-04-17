import { model } from "mongoose";
import { IReportDocument, IReportModel } from "./reports.types";

import ReportSchema from "./reports.schema";

export const ReportModel = model<IReportDocument, IReportModel>("report", ReportSchema);