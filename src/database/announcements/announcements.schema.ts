import { Schema } from "mongoose";
import { IAnnouncementDocument, IAnnouncementModel } from "./announcements.types";

import { announcementType } from "../../types/announcement";

const AnnouncementSchema = new Schema<IAnnouncementDocument, IAnnouncementModel>({
    title: String,
    content: String,
    timestamp: Number,

    type: {
        type: String,
        enum: announcementType,
        default: announcementType.ETC
    }
});

export default AnnouncementSchema;