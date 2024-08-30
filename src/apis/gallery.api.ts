import { HttpV2 } from './http';

export const getGalleriesByArtist = (artistId: string, query: any) => {
  return HttpV2.get(`/gallery/${artistId}`, query);
};


export const getGalleriesByName = (galleryName: string, query: any) => {
  return HttpV2.get(`/gallery/name/${galleryName}`, query);
};

export const readById = (galleryId: string) => {
  return HttpV2.get(`/gallery/detail/${galleryId}`);
};
export const readAllGalleries = (params?: { query?: any; options?: any; projection?: any; aggregate?: any }) => {
  return HttpV2.get('/gallery/all', params);
};



