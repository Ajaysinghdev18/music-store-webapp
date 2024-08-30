export interface ISocial {
    _id?: string;
    title?: string;
    statement?: string;
    artistId?: string;
    thumbnail?: any;
    video?: any;
    attachment?: any;
    contentType: 'video' | 'announcement',
    createdAt:any;
    publishOnSocialMedia: boolean
  }