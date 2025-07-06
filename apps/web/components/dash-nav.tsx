import { Button } from "@gtdraw/ui/components/button";

export default function DashNav() {
  return (
    <div className="flex justify-end sm:gap-16 border-[1px] dark:border-white border-gray-400 rounded-md shadow-md dark:shadow-gray-200 py-2.5 px-2.5 sm:px-4 md:gap-8">
      <div className="flex  sm:justify-between gap-2 sm:gap-8 md:gap-4 ">
        <Button variant={"ghost"} className="cursor-pointer ">
          All
        </Button>
        <Button variant={"ghost"}>Recents</Button>
        <Button variant={"ghost"} className="mr-4 sm:mr-0 md:mr-1">
          Created By Me
        </Button>
        <Button variant={"ghost"} className="hidden sm:block">
          Joined
        </Button>
      </div>
      <div className="flex justify-end gap-4 md:gap-4">
        <Button
          variant={"secondary"}
          className="px-2  gap-1 flex justify-center"
        >
          <div>
            <CreateIcon />
          </div>
          <div className="hidden sm:block">Create</div>
        </Button>
        <Button
          variant={"default"}
          className="px-2.5 sm:px-3 sm:gap-2 flex justify-center"
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
