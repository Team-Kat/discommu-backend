import { IReportModel, IReportDocument, reportType } from "./reports.types";

export async function report(
    this: IReportModel,
    data: string,
    type: reportType,
    content: string
): Promise<IReportDocument> {
    return await this.create({
        data: data,
        type: type,
        content: content,
        timestamp: Date.now()
    });
}