import { Schema } from "mongoose";
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

export default AnnouncementSchema;