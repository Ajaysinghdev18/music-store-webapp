import Http from './http';

export const readAllByArtist = (artistId:string) => {
  return Http.get(`/social/artist/${artistId}`);
};

export const read = (id: string) => {
  return Http.get(`/social/${id}`);
};

