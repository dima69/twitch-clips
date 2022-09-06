import AuthForm from "./auth-form";

const SideBarLogin = ({ isOpen }: { isOpen: boolean }) => {
  // @@@ if !auth return null or ask for auth

  return (
    <nav
      className={
        isOpen
          ? "fixed md:static md:block z-50 md:max-w-max bg-gray-100 h-full overflow-y-auto no-scrollbar"
          : "hidden overflow-y-auto no-scrollbar"
      }
    >
      <div className="flex flex-col">
        <AuthForm />
      </div>
    </nav>
  );
};

export default SideBarLogin;
