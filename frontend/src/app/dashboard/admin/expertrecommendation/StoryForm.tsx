'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import { uploadImageToS3 } from '@/lib/uploadToS3';
import { DialogTitle } from '@radix-ui/react-dialog';
import { StoryFormProps } from '@/types';



const StoryForm: React.FC<StoryFormProps> = ({ coverId, onStoryAdded }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !link) {
      toast.error('Please provide both an image file and a link.');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Upload image to S3
      const imageUrl = await uploadImageToS3(
        file,
        `expert-stories/story-${Date.now()}`
      );

      // 2️⃣ Submit story with uploaded image URL
      const res = await axios.post(
        'http://localhost:8080/api/expertStories/v1/top-recommendations-stories/story',
        {
          top_recommendations_stories_id: coverId,
          image: imageUrl,
          link,
        }
      );

      toast.success('Story added!');
      setOpen(false);
      setFile(null);
      setLink('');
      onStoryAdded(res.data);
    } catch (err) {
      console.error('Add story error', err);
      toast.error('Failed to add story.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-xs py-1 px-2 text-black cursor-pointer"
        >
          Add Story
        </Button>
      </DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent className="bg-[#151313] border-[#151313] max-w-md text-white">
        <h3 className="text-lg font-bold mb-4">Add Story</h3>
        <div className="space-y-3">
          <div>
            <Label className="mb-3 text-sm font-semibold">Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <Label className="text-sm font-semibold mb-3">Link</Label>
            <Input className='text-white placeholder:text-white/80' placeholder="add aidrops link" value={link} onChange={(e) => setLink(e.target.value)} />
          </div>
          <Button
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer mt-3 text-sm"
          >
            {loading ? 'Adding...' : 'Add Story'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryForm;
