import { Button } from "@gtdraw/ui/components/button";

export default function DashNav() {
  return (
    <div className="flex justify-end sm:gap-16 border-[1px] dark:border-white border-gray-400 rounded-md shadow-md dark:shadow-gray-200 py-2 px-2 sm:px-4 md:gap-4 md:px-2.5 lg:gap-16 lg:px-4">
      <div className="flex  sm:justify-between gap-1 sm:gap-8 md:gap-2 md:-mr-4 lg:mr-2  lg:gap-8">
        <Button
          variant={"ghost"}
          className="cursor-pointer px-1 -mr-2 md:px-2 md:-mr-4 lg:px-2"
        >
          All
        </Button>
        <Button variant={"ghost"} className="-mr-4">
          Recents
        </Button>
        <Button
          variant={"ghost"}
          className="mr-4 -ml-2 sm:mr-0   md:px-2 md:-ml-4"
        >
          Created By Me
        </Button>
        <Button variant={"ghost"} className="hidden sm:block md:px-2 md:-ml-2">
          Joined
        </Button>
      </div>
      <div className="flex justify-end gap-4 md:gap-2 md:-mr-2 md:pr-2 md:ml-2 lg:-mr-2 lg:gap-6 lg:-ml-4">
        <Button
          variant={"secondary"}
          className="px-2 -mr-1 md:px-1.5 gap-0.5 lg:gap-2 flex justify-center cursor-pointer lg:px-2.5 "
        >
          <div>
            <CreateIcon />
          </div>
          <div className="hidden sm:block">Create</div>
        </Button>
        <Button
          variant={"default"}
          className="px-2  sm:px-3 md:gap-0.5 md:px-1.5 sm:gap-2 lg:gap-2 lg:px-3 flex justify-center cursor-pointer"
        >
          <div>
            <LinkIcon />
          </div>
          <div className="hidden sm:block">Invite</div>
        </Button>
      </div>
    </div>
  );
}

function LinkIcon() {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
      >
        <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
        <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
      </svg>
    </div>
  );
}

function CreateIcon() {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
      >
        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
      </svg>
    </div>
  );
}
