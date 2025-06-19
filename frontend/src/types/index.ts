// /types/index.ts

export type Airdrop = {
  id: string;
  title: string;
  category: string;
  preview_image_url: string;
  type: 'Free' | 'Paid';
  likes: string;
};

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  description: string | null;
  sub_task_image: string | null;
}

export interface WeeklyTask {
  id: string;
  task_title: string;
  task_category: string;
  week: number;
  task_banner_image?: string;
  end_time?: string;
  progress?: number;
  tasks?: TaskBlock[]; // Make sure TaskBlock is also defined/exported
  sub_tasks?: SubTask[];
}
export interface TaskBlock {
  id: string;
  link: string | null;
  type: string;
  value: string;
}
export interface ForgotPasswordResponse {
  message: string;
}
export interface ResetPasswordResponse {
  message: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    user_name: string;
    role: string;
    is_new_user?: boolean;
    wallet_address: string;
    daily_login_streak_count: number;
    airdrops_remaining: number;
    airdrops_earned: number;
  };
}

export interface SignUpFormData {
  userName: string;
  email: string;
  password: string;
  referralCode?: string;
}
export interface ApiResponse {
  message: string;
}
export interface Task {
  id: number;
  image: string;
  link: string;
}
export interface Story {
  cover_id: number;
  cover_name: string;
  cover_image: string;
  stories: Task[];
}

export interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export interface LeaderboardUser {
  id: string;
  user_id: string;
  user_name: string;
  points: number;
}

export interface StatItem {
  label: string;
  value: string | number;
  subLabel?: string;
}

export interface WelcomeCardProps {
  name: string;
  stats: StatItem[];
  color?: string;
}

export interface DailyLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginData: {
    streakCount: number;
    totalLogins: number;
    todayPoints: number;
  };
}
export interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
}
export interface NavbarProps {
  toggleSidebar: () => void;
  role: 'admin' | 'user';
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  week: string;
  category: string;
  image: string;
  timeLeft?: string;
  // Include other fields if needed
}

export interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

export interface Referral {
  id: number;
  join_date: string;
  user_name: string;
  points_earned: number;
  profile_image: string;
}

export interface ReferralTableProps {
  referrals: Referral[];
}
export interface ProfileStatsProps {
  total_referrals: number;
  total_earned: number;
  referral_code: string;
}
export interface StoryCarouselProps {
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}

export interface StoryItem {
  id: number;
  image: string;
  link: string;
}

export interface StoryFormProps {
  coverId: number;
  onStoryAdded: (newStory: any) => void;
}

export interface User {
  user_name: string;
  email: string;
  airdrops_earned: number;
  daily_login_streak_count: number;
}

export interface AirdropData {
  title: string;
  airdrops_banner_title: string;
  airdrops_banner_description: string;
  airdrops_banner_subtitle: string;
  airdrops_date: string;
  airdrops_banner_image: string;
  preview_image_url: string;
  category: string;
  type: string;
}
export interface ContentBlock {
  type: BlockType;
  value: string;
  link?: string;
}
export type BlockType =
  | 'link'
  | 'image'
  | 'description'
  | 'checklist'
  | 'highlight'
  | 'header1';


  export interface MultiStepFormProps {
  steps: Step[];
  onComplete: (data: Record<string, string[]>) => void;
  }

export type Step = {
  title: string;
  description: string;
  component: (props: {
    selectedValues: string[];
    onToggle: (val: string) => void;
  }) => React.ReactNode;
  isMultiSelect?: boolean;
};

export interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  role: 'admin' | 'user';
}

export interface TaskCardProps {
  task: {
    id: string;
    week: number;
    task_category: string;
    task_title: string;
    task_description: string;
    task_banner_image: string;
    start_time: string;
    end_time: string;
    progress: number;
    status: string;
  };
  // onClick: () => void;
}
export interface TaskDetailProps {
  task: {
    title: string;
    description: string;
    progress: number;
    status: string;
    week: string;
    category: string;
    image: string;
    timeLeft?: string;
  };
  onBack: () => void;
}