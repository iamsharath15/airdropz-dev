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
import { ChevronDownIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useDispatch } from 'react-redux';

type Airdrop = {
  id: string;
  title: string;
  category: string;
  type: 'Free' | 'Paid';
  preview_image_url?: string;
};
const setCreatedAirdrop = (payload: Airdrop) => ({
  type: 'airdrop/setCreatedAirdrop',
  payload,
});

const defaultCategories = ['Solana', 'Ethereum', 'Polygon'];

const AirdropFormModal = () => {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'Free' | 'Paid'>('Free');
  const [customCategory, setCustomCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const finalCategory = isAddingCategory ? customCategory : category;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleCreate = async () => {
    if (!name || !finalCategory || !imageFile) {
      alert('Please fill in all fields and select an image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create the airdrop without the banner image
      const createPayload = {
        title: name,
        category: finalCategory,
        type: type,
      };

      const createRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/airdrop/v1/`,
        createPayload,
        { withCredentials: true }
      );

      const newAirdrop = createRes.data?.airdrop;
      const airdropId = newAirdrop?.id;

      if (!airdropId) throw new Error('Airdrop ID missing');

      // Step 2: Generate S3 path and presigned URL
      const fileExt = imageFile.name.split('.').pop();
      const s3Path = `airdrops/${airdropId}/banner.${fileExt}`;

      const presignRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/v1/generate-upload-url`,
        {
          params: {
            filename: s3Path,
            contentType: imageFile.type,
          },
        }
      );

      const { uploadUrl, publicUrl } = presignRes.data;

      // Step 3: Upload to S3
      await axios.put(uploadUrl, imageFile, {
        headers: { 'Content-Type': imageFile.type },
      });

      // Step 4: Update the airdrop with the image URL
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/airdrop/v1/${airdropId}`,
        {
          title: name,
          category: finalCategory,
          type: type,
          preview_image_url: publicUrl,
        },
        { withCredentials: true }
      );

      // Step 5: Dispatch and redirect
      const updatedAirdrop = {
        ...newAirdrop,
        preview_image_url: publicUrl,
      };

      dispatch(setCreatedAirdrop(updatedAirdrop));
      router.push(`/dashboard/admin/airdrops/create/${airdropId}`);
      setOpen(false);
    } catch (err) {
      console.error('Airdrop creation or image upload failed:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
         <Button
          variant="outline"
          className="gap-2 text-white border-white bg-black cursor-pointer"
        >
          <Plus size={18} />
          <span className="hidden md:inline  text-sm ">Add Airdrop</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="md:w-[950px] bg-[#2a2a2a] w-11/12 max-h-[90vh] rounded-xl flex items-center justify-center border-0">
        <div className="overflow-y-auto max-h-[80vh] pr-1 scrollable-modal w-full touch-pan-y">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Airdrop</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-6 mt-4">
            {/* Preview */}
            <div className="md:w-6/12 w-full flex justify-center items-start">
              <div className="bg-black text-white rounded-lg p-4 w-full max-w-[320px]">
                {imageFile ? (
                  <Image
                    src={URL.createObjectURL(imageFile)}
                    alt="Airdrop Preview"
                    width={1920}
                    height={1080}
                    className="rounded-lg mb-2 object-cover"
                  />
                ) : (
                  <div className="w-full h-[180px] font-semibold rounded-lg mb-2 bg-[#8373EE] flex items-center justify-center text-white text-sm">
                    No Image Selected
                  </div>
                )}
                <p className="text-base font-semibold mt-2">
                  {name || 'Airdrop Name'}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-[#8373EE] text-xs px-2 py-1 rounded-lg">
                    # {finalCategory || 'Category'}
                  </span>
                  {type && (
                    <span className="bg-[#8373EE] text-xs px-2 py-1 rounded-lg">
                      # {type}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="md:w-6/12 w-full space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-white">Upload Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer text-black file:text-black bg-white"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label className="text-white">Airdrop Name</Label>
                <Input
                  className="text-black placeholder:text-black bg-white focus-visible:border-[#8373EE] "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-white">Category</Label>
                {!isAddingCategory ? (
                  <Select
                    onValueChange={(val) =>
                      val === 'add_new'
                        ? setIsAddingCategory(true)
                        : setCategory(val)
                    }
                  >
                    <SelectTrigger hideIcon className="cursor-pointer w-full text-black placeholder:text-black bg-white">
                      <SelectValue placeholder="Select category" className='text-black placeholder:text-black' />
                                    <ChevronDownIcon className="inline h-4 w-4 text-black" />

                    </SelectTrigger>
                    <SelectContent>
                      {defaultCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="add_new">
                        ➕ Add new category
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    className="text-white placeholder:text-white"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter new category"
                  />
                )}
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label className="text-white">Type</Label>
                <Select
                  value={type}
                  onValueChange={(val) => setType(val as 'Free' | 'Paid')}
                >
                  <SelectTrigger hideIcon className="cursor-pointer w-full text-black placeholder:text-black bg-white">
                    <SelectValue placeholder="Select type" />
                                                        <ChevronDownIcon className="inline h-4 w-4 text-black" />

                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="bg-[#8373EE] md:w-7/12  w-full  cursor-pointer hover:bg-[#8373EE]/80"
                onClick={handleCreate}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Airdrop'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AirdropFormModal;
