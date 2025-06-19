import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { DisplaySectionProps } from '@/types';
import React from 'react';

const DisplaySection: React.FC<DisplaySectionProps> = ({ title }) => {
  return (
    <section className="py-6 px-2 mb-6 w-full">
      <h2 className="text-xl font-semibold text-gray-200 mb-5">{title}</h2>
      <div className="space-y-6 max-w-md">
        <div>
          <Label htmlFor="theme" className="text-white/80 pb-4 block">
            Theme
          </Label>
          <Select defaultValue="dark" disabled>
            <SelectTrigger className="bg-white border-gray-800 text-black w-full">
              <SelectValue placeholder="Dark Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark Mode</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="language" className="text-white/80 pb-4 block">
            Language
          </Label>
          <Select defaultValue="en" disabled>
            <SelectTrigger className="bg-white border-gray-800 text-black w-full">
              <SelectValue placeholder="English" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default DisplaySection;
