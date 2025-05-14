
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormValues {
  title: string;
  description: string;
  subject: string;
  file: FileList;
  uploaderName: string;
  uploaderRole: string;
}

const NotesUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, isAuthenticated, userProfile } = useAuth();
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      subject: '',
      uploaderName: userProfile?.name || '',
      uploaderRole: userProfile?.role || 'student',
    },
  });

  // Update form values when user profile changes
  useEffect(() => {
    if (userProfile) {
      form.setValue('uploaderName', userProfile.name || '');
      form.setValue('uploaderRole', userProfile.role || 'student');
    }
  }, [userProfile, form]);

  const onSubmit = async (data: FormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload notes",
        variant: "destructive",
      });
      return;
    }
    
    if (!data.file || data.file.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
      return;
    }

    const file = data.file[0];
    
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data: fileData, error: fileError } = await supabase.storage
        .from('notes_pdfs')
        .upload(filePath, file);
        
      if (fileError) {
        throw new Error(fileError.message);
      }

      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('notes_pdfs')
        .getPublicUrl(filePath);
        
      const publicUrl = publicUrlData.publicUrl;

      // Store metadata in the database with user_id for authentication
      const { error: metadataError } = await supabase
        .from('notes_metadata')
        .insert({
          title: data.title,
          description: data.description,
          subject: data.subject,
          file_path: filePath,
          file_size: file.size,
          tags: [data.subject],
          uploader_name: data.uploaderName,
          uploader_role: data.uploaderRole,
          user_id: user?.id, // Include user_id for authentication
        });
        
      if (metadataError) {
        throw new Error(metadataError.message);
      }

      toast({
        title: "Upload successful",
        description: "Your notes have been uploaded successfully",
      });
      
      setDialogOpen(false);
      form.reset({
        title: '',
        description: '',
        subject: '',
        uploaderName: userProfile?.name || '',
        uploaderRole: userProfile?.role || 'student',
      });
      window.location.reload(); // Refresh to show the new notes
      
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Link to="/auth/login">
        <Button className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Login to Upload Notes
        </Button>
      </Link>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Upload Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload PDF Notes</DialogTitle>
          <DialogDescription>
            Share educational materials with other students and teachers.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Computer Architecture - Week 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subject"
              rules={{ required: "Subject is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Computer Architecture" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="uploaderName"
                rules={{ required: "Your name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="uploaderRole"
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a brief description of these notes..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="file"
              rules={{ required: "PDF file is required" }}
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>PDF File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => onChange(e.target.files)}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a PDF file (max 10MB)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Notes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NotesUploader;
