export interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

export interface ImgflipResponse {
  success: boolean;
  data: {
    memes: Meme[];
  };
}

export const fetchMemes = async (): Promise<Meme[]> => {
  try {
    const response = await fetch('https://api.imgflip.com/get_memes');
    const data: ImgflipResponse = await response.json();
    if (data.success) {
      return data.data.memes;
    }
    return [];
  } catch (error) {
    console.error('Error fetching memes:', error);
    return [];
  }
};
