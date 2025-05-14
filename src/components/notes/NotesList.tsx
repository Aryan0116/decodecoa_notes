import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, FileText, Search, Filter, User, BookOpen, Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import PDFViewer from './PDFViewer';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Note } from '@/types/notes';
import { AdvancedLoader } from '@/components/ui/advanced-loader';

interface NotesListProps {
  filterByUserId: string | null;
  setParentLoading?: (loading: boolean) => void;
}

const NotesList: React.FC<NotesListProps> = ({ filterByUserId, setParentLoading }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<{ id: string; note_id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Fetch notes whenever filterByUserId changes
  useEffect(() => {
    if (setParentLoading) {
      setParentLoading(loading);
    }
    fetchNotes();
    if (isAuthenticated && user) {
      fetchBookmarks();
    }
  }, [isAuthenticated, user, filterByUserId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      
      // Build the query based on whether we're filtering by user ID
      let query = supabase
        .from('notes_metadata')
        .select('*');
        
      // Apply user filter if provided
      if (filterByUserId) {
        query = query.eq('user_id', filterByUserId);
      }
      
      // Finalize the query with sorting
      const { data, error } = await query.order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Get public URLs for all files
        const notesWithUrls = await Promise.all(
          data.map(async (note) => {
            const { data: urlData } = supabase.storage
              .from('notes_pdfs')
              .getPublicUrl(note.file_path);

            return {
              ...note,
              publicUrl: urlData.publicUrl
            };
          })
        );

        setNotes(notesWithUrls);
        
        // Extract unique subjects for filtering
        const uniqueSubjects = Array.from(
          new Set(data.map(note => note.subject).filter(Boolean))
        ) as string[];
        
        setSubjects(uniqueSubjects);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Error fetching notes",
        description: "Could not load the notes. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      if (data) {
        setBookmarks(data);
        
        // Update notes with bookmark status
        setNotes(prev => 
          prev.map(note => ({
            ...note,
            isBookmarked: data.some(b => b.note_id === note.id)
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  const toggleBookmark = async (note: Note) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark notes",
        variant: "destructive",
      });
      return;
    }

    setBookmarkLoading(true);
    
    try {
      if (note.isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('note_id', note.id);
          
        if (error) throw error;
        
        // Update local state
        setBookmarks(prev => prev.filter(b => b.note_id !== note.id));
        setNotes(prev => 
          prev.map(n => 
            n.id === note.id ? { ...n, isBookmarked: false } : n
          )
        );
        
        toast({
          title: "Bookmark removed",
        });
      } else {
        // Add bookmark
        const { data, error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            note_id: note.id
          })
          .select();
          
        if (error) throw error;
        
        // Update local state
        if (data) {
          setBookmarks(prev => [...prev, ...data]);
          setNotes(prev => 
            prev.map(n => 
              n.id === note.id ? { ...n, isBookmarked: true } : n
            )
          );
        }
        
        toast({
          title: "Bookmark added",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
  title: "Note",
  description: "Already Bookmarked",
  variant: "info", // or use "default" or create a custom "info" variant styled in blue
});

    } finally {
      setBookmarkLoading(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to delete notes",
        variant: "destructive",
      });
      return;
    }

    setDeleteLoading(true);
    
    try {
      // Get the note to find the file path
      const { data: noteData, error: noteError } = await supabase
        .from('notes_metadata')
        .select('file_path')
        .eq('id', noteId)
        .single();

      if (noteError) throw noteError;

      if (noteData) {
        // Delete file from storage
        const { error: storageError } = await supabase.storage
          .from('notes_pdfs')
          .remove([noteData.file_path]);
          
        if (storageError) {
          console.error("Error deleting file:", storageError);
          // Continue anyway to delete the metadata
        }
      }

      // First delete any bookmarks for this note
      const { error: bookmarkError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('note_id', noteId);
        
      if (bookmarkError) {
        console.error("Error deleting bookmarks:", bookmarkError);
        // Continue to delete note metadata
      }

      // Delete note metadata
      const { error } = await supabase
        .from('notes_metadata')
        .delete()
        .eq('id', noteId);
        
      if (error) throw error;
      
      // Update local state
      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      toast({
        title: "Note deleted",
        description: "The note has been successfully deleted",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error deleting note",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openPdfViewer = (note: Note) => {
    setSelectedNote(note);
    setDialogOpen(true);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const kilobytes = bytes / 1024;
    if (kilobytes < 1024) {
      return `${kilobytes.toFixed(2)} KB`;
    }
    const megabytes = kilobytes / 1024;
    return `${megabytes.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const clearFilters = () => {
    setSelectedSubject(null);
  };

  const filteredNotes = notes.filter(note => {
    // Filter by search term
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      note.title.toLowerCase().includes(searchLower) ||
      (note.description?.toLowerCase() || '').includes(searchLower) ||
      (note.subject?.toLowerCase() || '').includes(searchLower) ||
      (note.uploader_name?.toLowerCase() || '').includes(searchLower) ||
      (note.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false);
      
    // Filter by selected subject
    const matchesSubject = !selectedSubject || note.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  // Function to determine card background color based on uploader role
  const getRoleBasedStyles = (role: string | null) => {
    if (role === 'teacher') {
      return {
        borderClass: 'border-green-300 dark:border-green-800',
        gradientClass: 'from-green-50/80 to-teal-50/80 dark:from-green-950/30 dark:to-teal-950/30',
        badgeVariant: 'success' as const,
      };
    }
    
    if (role === 'student') {
      return {
        borderClass: 'border-blue-300 dark:border-blue-800',
        gradientClass: 'from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30',
        badgeVariant: 'default' as const,
      };
    }
    
    return {
      borderClass: 'border-slate-200 dark:border-slate-800',
      gradientClass: 'from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800',
      badgeVariant: 'outline' as const,
    };
  };

  const canDeleteNote = (note: Note) => {
    return isAuthenticated && user && note.user_id === user.id;
  };
  
  // Custom animation classes for staggered animation
  const getAnimationDelay = (index: number) => {
    return `animate-fade-in delay-[${index * 50}ms]`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between animate-fade-in">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes by title, subject or uploader..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 transition-all duration-300 focus:border-purple-400 focus:ring-purple-400"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 transition-all duration-300 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/30">
                <Filter className="h-4 w-4" />
                {selectedSubject ? `Subject: ${selectedSubject}` : "Filter by Subject"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-fade-in">
              <DropdownMenuLabel>Filter by Subject</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {subjects.map(subject => (
                <DropdownMenuItem 
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className="cursor-pointer transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>{subject}</span>
                </DropdownMenuItem>
              ))}
              {subjects.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={clearFilters}
                    className="cursor-pointer text-primary"
                  >
                    Clear filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {selectedSubject && (
        <div className="flex items-center gap-2 animate-fade-in">
          <Badge variant="secondary" className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {selectedSubject}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 ml-1" 
              onClick={clearFilters}
            >
              ×
            </Button>
          </Badge>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center my-12 animate-fade-in">
          <AdvancedLoader text="Loading notes..." />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground animate-fade-in">
          <FileText className="mx-auto h-12 w-12 mb-4 opacity-20" />
          <p className="text-lg font-medium">
            {filterByUserId 
              ? "You haven't uploaded any notes yet" 
              : "No notes found"
            }
          </p>
          <p>
            {searchTerm || selectedSubject 
              ? 'Try different search terms or filters' 
              : filterByUserId 
                ? 'Start by uploading your first note!' 
                : 'Start by uploading some notes.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, index) => {
            const { borderClass, gradientClass, badgeVariant } = getRoleBasedStyles(note.uploader_role);
            
            return (
              <Card 
                key={note.id} 
                className={cn(
                  "flex flex-col hover:shadow-md transition-all duration-300 transform animate-fade-in",
                  "hover:translate-y-[-4px] hover:shadow-lg",
                  borderClass,
                  getAnimationDelay(index)
                )}
              >
                <CardHeader className={cn("relative rounded-t-lg bg-gradient-to-r", gradientClass)}>
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-4 transition-transform hover:scale-110"
                      onClick={() => toggleBookmark(note)}
                      disabled={bookmarkLoading}
                    >
                      {note.isBookmarked ? (
                        <BookmarkCheck className="h-5 w-5 text-primary animate-fade-in" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                      <span className="sr-only">
                        {note.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                      </span>
                    </Button>
                  )}
                  <CardTitle className="truncate">{note.title}</CardTitle>
                  <CardDescription>
                    {note.subject && (
                      <span className="block">Subject: {note.subject}</span>
                    )}
                    <span className="block">Uploaded: {formatDate(note.uploaded_at)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {note.description || 'No description provided'}
                  </p>
                  
                  {(note.uploader_name || note.uploader_role) && (
                    <div className="flex items-center mt-3 text-sm text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      <span>
                        {note.uploader_name} 
                        {note.uploader_role && (
                          <Badge 
                            variant={badgeVariant} 
                            className="ml-2 text-xs font-normal"
                          >
                            {note.uploader_role.charAt(0).toUpperCase() + note.uploader_role.slice(1)}
                          </Badge>
                        )}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between mt-auto">
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(note.file_size)}
                    </span>
                    
                    {canDeleteNote(note) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="animate-fade-in">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Note</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{note.title}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteNote(note.id)}
                              disabled={deleteLoading}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {deleteLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openPdfViewer(note)}
                    className="flex items-center gap-2 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/30 transition-all duration-300"
                  >
                    <FileText className="h-4 w-4" />
                    View PDF
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedNote && (
          <DialogContent className="max-w-4xl h-[90vh] flex flex-col animate-fade-in">
            <DialogHeader>
              <DialogTitle>{selectedNote.title}</DialogTitle>
              <DialogDescription>
                {selectedNote.subject && `Subject: ${selectedNote.subject}`}
                {selectedNote.uploader_name && ` • Uploaded by: ${selectedNote.uploader_name}`}
                {selectedNote.uploader_role && ` (${selectedNote.uploader_role})`}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              {selectedNote.publicUrl && (
                <PDFViewer 
                  fileUrl={selectedNote.publicUrl} 
                  fileName={`${selectedNote.title}.pdf`}
                />
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default NotesList;
