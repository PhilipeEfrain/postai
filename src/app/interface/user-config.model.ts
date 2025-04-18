//src/app/interface/user-config.model.ts

import dayjs from "dayjs";

export interface UserConfig {
    uid: string; // do Firebase Auth
    businessName: string;
    businessCategory: string;
    channels: {
      instagram: boolean;
      facebook: boolean;
      whatsapp: boolean;
    };
  }
  
  export interface sheduleInCalendarPost {
    title: string,
    url: string, // novo campo -> usuário pode colocar uma url para a imagem ou video
    description: string,
    hashtags: string[],
    links: string[],
    type: string, // feed, image, video
    date: Date 
    remindBefore: number,
    createdAt: Date 
    updatedAt: Date 
  }