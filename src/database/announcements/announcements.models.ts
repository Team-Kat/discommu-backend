import { model } from "mongoose";
import { IAnnouncementDocument, IAnnouncementModel } from "./announcements.types";

import AnnouncementSchema from "./announcements.schema";

export const AnnouncementModel = model<IAnnouncementDocument, IAnnouncementModel>("announcement", AnnouncementSchema);