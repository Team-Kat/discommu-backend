import { model } from "mongoose";

import AnnouncementSchema from "./announcements.schema";
import { IAnnouncementDocument, IAnnouncementModel } from "./announcements.types";

export const AnnouncementModel = model<IAnnouncementDocument, IAnnouncementModel>("announcement", AnnouncementSchema);