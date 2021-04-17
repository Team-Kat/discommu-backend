import { IReportDocument } from "./reports.types";

export async function edit(this: IReportDocument, content: string): Promise<void> {
    this.content = content ?? this.content;
    await this.save();
}