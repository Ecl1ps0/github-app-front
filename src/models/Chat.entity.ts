export interface Chat {
  id: string;
  name: string;
  channel_id: string;
  created_at: number;
  deleted_at: number;
  type?: string;
}
