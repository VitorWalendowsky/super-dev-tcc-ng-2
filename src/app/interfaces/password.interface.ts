export interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  category: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  icon?: string;
  iconColor?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}