import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "../assets/icons";

type Props = {
  menuActiveElement: string;
  selectedRange: (range: string) => void;
};

const ClipsFilterDropdown = ({ menuActiveElement, selectedRange }: Props) => {
  return (
    <Menu className="inline-block mb-2 relative text-sm" as="div">
      <Menu.Button className="bg-gray-100 rounded-md flex justify-center px-4 py-2 font-medium items-center">
        Top{" "}
        <span className="bg-yellow-300 px-2 rounded-full ml-2">
          {menuActiveElement}
        </span>
        <ChevronDownIcon />
      </Menu.Button>
      <Menu.Items className="z-10 rounded-md flex flex-col mt-1 shadow-lg py-1 text-sm border absolute w-32 ml-1 bg-slate-100">
        <div className="px-1 pt-2 flex flex-col divide-y divide-gray-100">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => selectedRange("24H")}
                className={`${
                  active ? "bg-sky-200" : "text-black"
                } pl-2 py-2 font-medium w-full text-left`}
              >
                Top <span className="bg-yellow-300 px-2 rounded-full">24H</span>
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => selectedRange("7D")}
                className={`${
                  active ? "bg-sky-200" : "text-black"
                } pl-2 py-2 font-medium w-full text-left`}
              >
                Top <span className="bg-yellow-300 px-2 rounded-full">7D</span>
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => selectedRange("30D")}
                className={`${
                  active ? "bg-sky-200" : "text-black"
                } pl-2 py-2 font-medium w-full text-left`}
              >
                Top <span className="bg-yellow-300 px-2 rounded-full">30D</span>
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => selectedRange("ALL")}
                className={`${
                  active ? "bg-sky-200" : "text-black"
                } pl-2 py-2 font-medium w-full text-left`}
              >
                Top <span className="bg-yellow-300 px-2 rounded-full">ALL</span>
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default ClipsFilterDropdown;
