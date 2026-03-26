export interface Banner {
  id: string;
  name: string;
  link?: string | null;
  order: number;
  image_url: string;
  active: boolean;
  created_at?: string;
}
