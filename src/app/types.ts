export interface User {
  id: number;
  fio: string;
  tab_number: string;
  post: string;
  table: Table[];
}

export interface Table {
  id: number;
  created_at: Date;
  date: string;
  terms: string;
  task: string;
  order_number: string;
  user_id: number;
}