import Image from "next/image";
import React from "react";

const tasks = [
  {
    id: 1,
    title: "LayerZero Airdrop 2 – Fresh Strategy to Explore!",
    image: "/images/layerzero.png",
    progress: 90,
    timeLeft: "1 Hour",
    week: "Week 04",
  },
  {
    id: 2,
    title: "Hyperlane Airdrop: Engage with New Chains and Tokens",
    image: "/images/hyperlane.png",
    progress: 100,
    timeLeft: "Ended",
    week: "Week 02",
  },
  {
    id: 3,
    title: "Eclipse Airdrop: The Last Push Before TGE",
    image: "/images/eclipse.png",
    progress: 0,
    timeLeft: "Ended",
    week: "Week 03",
  },
];

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-white">{title}</h2>
    <div className="flex gap-2">
      <button className="text-gray-400" aria-label="Previous">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="text-gray-400" aria-label="Next">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  </div>
);

// Assuming you have a Progress component imported here:
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`bg-gray-700 rounded-full overflow-hidden ${className}`}>
    <div
      className="bg-purple-500 h-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

const TaskItem = ({ task }: { task: typeof tasks[0] }) => (
  <div className="bg-[#171717] rounded-xl p-5 mb-4 flex flex-col w-full ">
    <div className="mb-4">
      <div className="w-full h-40 bg-gray-800 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
        {/* Use image if available */}
        <Image width={1920} height={1080}
          src={task.image}
          alt={task.title}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
      <h3 className="text-white font-medium text-lg">{task.title}</h3>
    </div>

    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400">Progress</span>
        <span className="text-purple-400 font-semibold">{task.progress}%</span>
      </div>
      <Progress value={task.progress} className="h-2 mb-4" />

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-gray-400 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-gray-400">{task.timeLeft}</span>
        </div>
        <span className="text-purple-400">{task.week}</span>
      </div>
    </div>
  </div>
);

const TasksSection = () => (
  <section className="mb-6 md:mb-8 px-4">
    <SectionHeader title="My Task" />
    <div className="flex flex-wrap -mx-2">
      {tasks.map((task) => (
        <div key={task.id} className="px-2 mb-4 w-full sm:w-3/12 md:w-4/12 lg:w-5/12">
          <TaskItem task={task} />
        </div>
      ))}
    </div>
  </section>
);

export default TasksSection;
