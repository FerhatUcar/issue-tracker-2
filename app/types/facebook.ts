type FacebookPictureObj = {
  data: { url: string };
};

export type FacebookProfile = {
  id: string;
  name?: string | null;
  email?: string | null;
  picture: FacebookPictureObj;
};
