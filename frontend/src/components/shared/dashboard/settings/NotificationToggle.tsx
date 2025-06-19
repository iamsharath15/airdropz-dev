import { Switch } from '@/components/ui/switch';
import React from 'react'

const NotificationToggle = ({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
     <div className="flex justify-between items-center max-w-md">
    <div className="pr-4">
      <h3 className="text-white font-semibold pb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      className="peer bg-gray-700 peer-checked:bg-[#8373EE] cursor-pointer"
    />
  </div> 
 )
}

export default NotificationToggle