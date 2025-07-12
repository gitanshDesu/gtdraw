import { Button } from "@gtdraw/ui/components/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@gtdraw/ui/components/sidebar";
import { LogOut, Plus, Settings, Trash } from "lucide-react";
import { useState } from "react";
import UpdateUser from "./update-details";
import UpdateAvatar from "./update-avatar";
import AccountDeleteAlert from "./account-delete";
import ResetPass from "./reset-password";
import VerifyCode from "./verify-code";
import { MailType } from "@gtdraw/common/types";

export function AppSidebar() {
  const [showUpdateAcc, setShowUpdateAcc] = useState(false);
  const [showUpdateAvatar, setShowUpdateAvatar] = useState(false);
  const [showAccountDeleteAlert, setShowAccountDeleteAlert] = useState(false);
  const [showResetPass, setShowResetPass] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  return (
    <Sidebar variant="sidebar" className="md:w-[14rem] lg:w-[16rem]">
      <SidebarHeader>
        <SideBarAvatar />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-md">Workspace</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-1">
            <div>
              <Button
                variant={"ghost"}
                className=" cursor-pointer flex justify-start gap-1 -mb-2 w-full"
              >
                <Plus size={20} />
                <span>Create Workspace</span>
              </Button>
            </div>
            <Button
              className="cursor-pointer flex justify-start"
              variant={"ghost"}
            >
              All Workspaces
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-md">
            <div className="flex justify-start gap-1">
              <Settings size={20} />
              <div>Settings</div>
            </div>
          </SidebarGroupLabel>
          <SidebarContent>
            <div className="flex flex-col gap-1">
              <Button
                variant={"ghost"}
                className="cursor-pointer flex justify-start gap-1 w-full"
                onClick={() => setShowUpdateAcc(true)}
              >
                Update User Details
              </Button>
              <Button
                variant={"ghost"}
                className="cursor-pointer flex justify-start gap-1 w-full"
                onClick={() => setShowUpdateAvatar(true)}
              >
                Update Avatar
              </Button>
              <Button
                variant={"ghost"}
                className="cursor-pointer flex justify-start gap-1 w-full"
                onClick={() => setShowForgotPass(true)}
              >
                Reset Password
              </Button>
              <Button
                variant={"destructive"}
                className="cursor-pointer flex justify-start gap-1 w-full"
                onClick={() => setShowAccountDeleteAlert(true)}
              >
                <Trash size={20} />
                <div>Delete Account</div>
              </Button>
              <Button
                variant={"ghost"}
                className="cursor-pointer flex justify-start gap-1 w-full"
              >
                <LogOut size={20} />
                <div>Logout</div>
              </Button>
            </div>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      {showUpdateAcc ? (
        <UpdateUser
          showUpdateAcc={showUpdateAcc}
          setShowUpdateAcc={setShowUpdateAcc}
          open={showUpdateAcc}
          onOpenChange={setShowUpdateAcc}
        />
      ) : null}
      {showUpdateAvatar ? (
        <UpdateAvatar
          showUpdateAvatar={showUpdateAvatar}
          setShowUpdateAvatar={setShowUpdateAvatar}
          open={showUpdateAvatar}
          onOpenChange={setShowUpdateAvatar}
        />
      ) : null}
      {showAccountDeleteAlert ? (
        <AccountDeleteAlert
          open={showAccountDeleteAlert}
          onOpenChange={setShowAccountDeleteAlert}
        />
      ) : null}
      {showForgotPass ? (
        <ResetPass
          open={showForgotPass}
          onOpenChange={setShowForgotPass}
          setShowResetPass={setShowResetPass}
          showResetPass={showResetPass}
        />
      ) : null}
      {showResetPass ? (
        <VerifyCode
          type={MailType.RESET}
          open={showResetPass}
          onOpenChange={setShowResetPass}
        />
      ) : null}
    </Sidebar>
  );
}

function SideBarAvatar({
  avatar = "",
  fullName = "John Doe",
  username = "johndoe",
}: {
  avatar?: string;
  fullName?: string;
  username?: string;
}) {
  return (
    <div className="grid grid-cols-2 p-2 m-2 gap-2">
      <div className="col-span-1 w-full h-full flex items-center justify-between">
        {avatar ? (
          <img src={avatar}></img>
        ) : (
          <div className="flex justify-center items-center text-center font-semibold text-3xl w-2/3 m-[12px] h-full border-[1px]  border-black dark:border-white rounded-full">
            {fullName.split(" ")[0]![0]?.toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center col-span-1 mt-2 mr-4">
        <div className="text-left font-semibold text-lg">{fullName}</div>
        <div className="relative bottom-3 right-1 text-gray-400 pt-2">{`@${username}`}</div>
      </div>
    </div>
  );
}
