import Link from "next/link";
import { useState, ReactNode, FormEvent } from "react";
import { CloseIcon, PeopleIcon, SearchIcon } from "../assets/icons";
import useUserStore from "../store/store";
import SideBar from "./sidebar";
import { useRouter } from "next/router";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const userFollowsData = useUserStore((state) => state.userFollowsData);
  const [quickSearchValue, setQuickSearchValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sideMenuOpenCloseButtonHandler = () => {
    setIsSidebarOpen((value) => !value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quickSearchValue) return;
    if (quickSearchValue.length < 4) return;
    if (router.query.username === quickSearchValue) return;
    setQuickSearchValue("");
    router.push(quickSearchValue);
  };

  return (
    <div className="flex flex-col">
      <header className="flex sticky top-0 p-2 z-20 bg-gray-200 w-full h-12">
        <div className="flex w-full justify-between">
          <div className="flex">
            {router.asPath === "/" && !userFollowsData.data.length ? null : (
              <button
                onClick={sideMenuOpenCloseButtonHandler}
                title="FOLLOWED CHANNELS"
                className="flex items-center rounded px-1 w-8 h-8 mr-2 text-center bg-yellow-300 md:hover:bg-yellow-400"
              >
                {isSidebarOpen ? <CloseIcon /> : <PeopleIcon />}
              </button>
            )}
          </div>
          <div className="flex w-96">
            <form onSubmit={handleSubmit} className="w-full">
              <input
                type="text"
                placeholder="quick jump to userpage"
                value={quickSearchValue}
                onChange={(e) => setQuickSearchValue(e.currentTarget.value)}
                className="w-full rounded-r-none rounded pl-2 py-1 bg-gray-100 hover:border-gray-300 border hover:shadow border-transparent"
              />
              <input type="submit" className="hidden" />
            </form>
            <Link href={quickSearchValue}>
              <a
                className="flex items-center rounded w-8 rounded-l-none border-l-0 text-center bg-yellow-300 hover:bg-yellow-400"
                onClick={() => setQuickSearchValue("")}
              >
                <SearchIcon />
              </a>
            </Link>
          </div>
          <div></div>
        </div>
      </header>
      {/* ESC key close event */}
      {/* transition css */}
      <div className="flex h-[calc(100vh-3rem)]">
        <SideBar
          isOpen={isSidebarOpen}
          followingUsersListData={userFollowsData}
        />

        <main className="flex flex-col flex-1 overflow-auto px-2">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
