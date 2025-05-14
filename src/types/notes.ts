export interface Note {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_size: number | null;
  uploaded_at: string;
  subject: string | null;
  tags: string[] | null;
  uploader_name: string | null;
  uploader_role: string | null;
  user_id: string | null;
  publicUrl?: string;
  isBookmarked?: boolean;
}

export interface NotesListProps {
  filterByUserId: string | null;
  setParentLoading?: (loading: boolean) => void;
}
