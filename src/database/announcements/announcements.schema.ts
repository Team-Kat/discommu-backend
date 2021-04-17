import { Schema } from "mongoose";

import { createAnnouncement } from "./announcements.statics";
import { edit } from "./announcements.methods";
import { IAnnouncementDocument, IAnnouncementModel, announcementType } from "./announcements.types";

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

AnnouncementSchema.statics.createAnnouncement = createAnnouncement;
AnnouncementSchema.methods.edit = edit;

export default AnnouncementSchema;