'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';


type EditAirdropFormModalProps = {
  airdrop: {
    id: string;
    title: string;
    category: string;
    preview_image_url: string;
    type: 'Free' | 'Paid';
  };
};

const defaultCategories = ['Solana', 'Ethereum', 'Polygon'];

const EditAirdropFormModal = ({ airdrop }: EditAirdropFormModalProps) => {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState(airdrop.title);
  const [category, setCategory] = useState(airdrop.category);
  const [type, setType] = useState<'Free' | 'Paid'>(airdrop.type);
  const [customCategory, setCustomCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const finalCategory = isAddingCategory ? customCategory : category;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleUpdate = async () => {
    if (!name || !finalCategory) {
  toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      let publicUrl = airdrop.preview_image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const s3Path = `airdrops/${airdrop.id}/previewr.${fileExt}`;

        const presignRes = await axios.get(
          'http://localhost:8080/api/upload/v1/generate-upload-url',
          {
            params: {
              filename: s3Path,
              contentType: imageFile.type,
            },
          }
        );

        const { uploadUrl, publicUrl: newUrl } = presignRes.data;

        await axios.put(uploadUrl, imageFile, {
          headers: { 'Content-Type': imageFile.type },
        });

        publicUrl = newUrl;
      }

      await axios.put(
        `http://localhost:8080/api/airdrop/v1/${airdrop.id}`,
        {
          title: name,
          category: finalCategory,
          type: type,
          preview_image_url: publicUrl,
        },
        { withCredentials: true }
      );

toast.success('Airdrop updated successfully!');
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error('Update failed:', err);
toast.error('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="absolute top-4 right-5 bg-[#8373EE] hover:bg-[#8373EE]/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer">
          <Pencil className="w-5 h-5 text-white" />
        </button>
      </DialogTrigger>

      <DialogContent className="md:w-[950px] bg-[#151313] border-0 text-white w-11/12 max-h-[90vh] rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Airdrop</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* Preview */}
          <div className="md:w-6/12 w-full flex justify-center">
            <div className="bg-black text-white rounded-lg p-4 w-full max-w-[320px]">
              {imageFile ? (
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  width={1920}
                  height={1080}
                  className="rounded-lg mb-2 object-cover"
                />
              ) : (
                <Image
                  src={airdrop.preview_image_url}
                  alt="Preview"
                  width={1920}
                  height={1080}
                  className="rounded-lg mb-2 object-cover"
                />
              )}
              <p className="text-base font-semibold mt-2">{name}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-[#8373EE] text-xs px-2 py-1 rounded-md">
                  # {finalCategory}
                </span>
                {type && (
                  <span className="bg-[#8373EE] text-xs px-2 py-1 rounded-md">
                    # {type}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:w-6/12 w-full space-y-4">
            <div className="space-y-2">
              <Label className=''>Upload Image</Label>
              <Input   className="text-white file:text-white  file:cursor-pointer"

                type="file"
                accept="image/*"
                
                onChange={handleImageChange}
              />
            </div>
            <div className="space-y-2">
              <Label className='text-white'>Airdrop Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              {!isAddingCategory ? (
                <Select
                  onValueChange={(val) =>
                    val === 'add_new'
                      ? setIsAddingCategory(true)
                      : setCategory(val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue className='text-white placeholder:text-white' placeholder={category} />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="add_new">➕ Add new</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter new category"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label className='text-white'>Type</Label>
              <Select
                value={type}
                onValueChange={(val) => setType(val as 'Free' | 'Paid')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleUpdate} disabled={isSubmitting} className='cursor-pointer bg-[#8373EE] hover:bg-[#8373EE]/80 text-white'>
              {isSubmitting ? 'Updating...' : 'Update Airdrop'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAirdropFormModal;
