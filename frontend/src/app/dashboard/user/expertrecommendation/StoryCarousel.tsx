"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Pause } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  potential: string;
  risk: string;
}

interface Story {
  id: number;
  name: string;
  avatar: string;
  color: string;
  tasks: Task[];
}

interface StoryCarouselProps {
  stories: Story[];
}

const StoryCarousel: React.FC<StoryCarouselProps> = ({ stories }) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const STORY_DURATION = 5000;

  const currentTask = selectedStory?.tasks[currentTaskIndex];

  useEffect(() => {
    if (!selectedStory || !isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (
            selectedStory &&
            currentTaskIndex < selectedStory.tasks.length - 1
          ) {
            setCurrentTaskIndex((i) => i + 1);
            return 0;
          } else {
            closeStory();
            return 0;
          }
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedStory, isPlaying, currentTaskIndex]);

  const openStory = (story: Story) => {
    setSelectedStory(story);
    setCurrentTaskIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const closeStory = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelectedStory(null);
    setCurrentTaskIndex(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying((prev) => !prev);
  };

  const goToNextTask = () => {
    if (
      selectedStory &&
      currentTaskIndex < selectedStory.tasks.length - 1
    ) {
      setCurrentTaskIndex((i) => i + 1);
      setProgress(0);
    }
  };

  const goToPrevTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex((i) => i - 1);
      setProgress(0);
    }
  };

  return (
    <>
      <div className="flex gap-4">
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => openStory(story)}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${story.color} p-1 mb-2 group-hover:scale-105 transition-transform relative`}
            >
              <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-2xl">{story.avatar}</span>
              </div>
              {story.tasks?.length > 1 && (
                <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {story.tasks.length}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              {story.name}
            </span>
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedStory}
        onOpenChange={(open) => {
          if (!open) closeStory();
        }}
      >
        <DialogContent
          className="bg-gray-900 border-gray-700 max-w-md p-0"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedStory?.name || "Story"}</DialogTitle>
            <DialogDescription>
              Task {currentTaskIndex + 1} of {selectedStory?.tasks.length || 0}
            </DialogDescription>
          </DialogHeader>

          {selectedStory && currentTask && (
            <div className="relative">
              {/* Progress bars */}
              <div className="flex gap-1 p-4 pb-2">
                {selectedStory.tasks.map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-white transition-all duration-100"
                      style={{
                        width:
                          index < currentTaskIndex
                            ? "100%"
                            : index === currentTaskIndex
                            ? `${progress}%`
                            : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedStory.color} p-0.5`}
                  >
                    <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-lg">{selectedStory.avatar}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">
                      {selectedStory.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Task {currentTaskIndex + 1} of{" "}
                      {selectedStory.tasks.length}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                    className="text-gray-400 hover:text-white w-8 h-8 p-0"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeStory();
                    }}
                    className="text-gray-400 hover:text-white w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Clickable navigation areas */}
              <div
                className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevTask();
                }}
              />
              <div
                className="absolute right-0 top-0 w-1/3 h-full z-10 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextTask();
                }}
              />

              {/* Task Content */}
              <div className="p-6">
                <div
                  className={`w-32 h-32 rounded-full bg-gradient-to-br ${selectedStory.color} p-2 mx-auto mb-6`}
                >
                  <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-4xl">{selectedStory.avatar}</span>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <h4 className="text-xl font-bold text-white">
                    {currentTask.title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {currentTask.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-400">Potential</p>
                      <p className="text-lg font-bold text-green-400">
                        {currentTask.potential}
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-sm text-gray-400">Risk Level</p>
                      <p className="text-lg font-bold text-yellow-400">
                        {currentTask.risk}
                      </p>
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6">
                    Start Task
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoryCarousel;
