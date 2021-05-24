import { Document, Model } from "mongoose";
import { announcementType } from "../../types/announcement";

export interface IAnnouncement {
    title: string;
    content: string;
    timestamp: number;
    type: announcementType;
};

export interface IAnnouncementDocument extends Document, IAnnouncement { };
export interface IAnnouncementModel extends Model<IAnnouncementDocument> { };