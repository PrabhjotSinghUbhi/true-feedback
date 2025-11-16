import {Message} from "@/models/messages.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>
}