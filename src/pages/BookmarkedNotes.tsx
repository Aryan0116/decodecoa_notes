
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Note } from '@/types/notes';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { BookmarkCheck, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PDFViewer from '@/components/notes/PDFViewer';

const BookmarkedNotes = () => {
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBookmarkedNotes();
    }
  }, [isAuthenticated, user]);

  const fetchBookmarkedNotes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch bookmarks for the current user with note details
      const { data: bookmarks, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select(`
          note_id,
          notes_metadata:notes_metadata(
            id, title, description, file_path, file_size, uploaded_at,
            subject, tags, uploader_name, uploader_role, user_id
          )
        `)
        .eq('user_id', user.id);

      if (bookmarkError) throw bookmarkError;

      if (bookmarks && bookmarks.length > 0) {
        // Transform the data to get notes with URLs
        const notesData = await Promise.all(
          bookmarks.map(async (bookmark) => {
            const note = bookmark.notes_metadata as any;
            
            // Get public URL for the file
            const { data: urlData } = supabase.storage
              .from('notes_pdfs')
              .getPublicUrl(note.file_path);

            return {
              ...note,
              publicUrl: urlData.publicUrl,
              isBookmarked: true
            };
          })
        );

        setBookmarkedNotes(notesData);
      } else {
        setBookmarkedNotes([]);
      }
    } catch (error) {
      console.error('Error fetching bookmarked notes:', error);
      toast({
        title: "Error fetching bookmarks",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (noteId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('note_id', noteId);
        
      if (error) throw error;
      
      // Update local state
      setBookmarkedNotes(prev => prev.filter(note => note.id !== noteId));
      
      toast({
        title: "Bookmark removed",
      });
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast({
        title: "Error",
        description: "Could not remove bookmark",
        variant: "destructive",
      });
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

  // Function to determine badge color based on uploader role
  const getBadgeVariant = (role: string | null) => {
    if (role === 'teacher') return 'success';
    if (role === 'student') return 'default';
    return 'outline';
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookmarkCheck className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Bookmarked Notes</h1>
        <p className="text-muted-foreground">Please log in to view your bookmarked notes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookmarkCheck className="h-8 w-8 text-purple-600" />
            <span>Bookmarked Notes</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Your saved study materials for quick access
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : bookmarkedNotes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BookmarkCheck className="mx-auto h-12 w-12 mb-4 opacity-20" />
          <p className="text-lg font-medium">No bookmarked notes</p>
          <p>Browse the notes page and bookmark notes you find useful.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedNotes.map((note) => (
            <Card 
              key={note.id} 
              className="flex flex-col hover:shadow-md transition-shadow"
            >
              <CardHeader>
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
                    <span>
                      {note.uploader_name} 
                      {note.uploader_role && (
                        <Badge 
                          variant={getBadgeVariant(note.uploader_role) as any} 
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeBookmark(note.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openPdfViewer(note)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View PDF
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedNote && (
          <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
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

export default BookmarkedNotes;
