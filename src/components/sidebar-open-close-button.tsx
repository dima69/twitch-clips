import { CloseIcon, PeopleIcon } from "../assets/icons";

type Props = {
  isIndexPage: boolean;
  isDataEmpty: boolean;
  onClick: () => void;
  isSidebarOpen: boolean;
};

const Button = ({ isIndexPage, isDataEmpty, onClick, isSidebarOpen }: Props) => {
  if (isIndexPage && isDataEmpty) {
    return null;
  }
  return (
    <button
      onClick={onClick}
      title="FOLLOWED CHANNELS"
      className="flex items-center rounded px-1 w-8 h-8 mr-2 text-center bg-yellow-300 md:hover:bg-yellow-400"
    >
      {isSidebarOpen ? <CloseIcon /> : <PeopleIcon />}
    </button>
  );
};

export default Button;
// {router.asPath !== "/" && userFollowsData.data.length ? null : (
//   <button
//     onClick={sideMenuOpenCloseButtonHandler}
//     title="FOLLOWED CHANNELS"
//     className="flex items-center rounded px-1 w-8 h-8 mr-2 text-center bg-yellow-300 md:hover:bg-yellow-400"
//   >
//     {isSidebarOpen ? <CloseIcon /> : <PeopleIcon />}
//   </button>
// )}
