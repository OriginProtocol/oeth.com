import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";
import { DownCaret } from "../Icons";

type Option = {
  label: string;
  href: string;
  highlight?: boolean;
  icon?: {
    alternativeText: string;
    caption: string;
    url: string;
  };
  nofollow?: boolean;
};

export interface DropdownProps {
  /**
   * Dropdown options
   */
  options: Option[];
  /**
   * Label to show for dropdown button
   */
  label: string;
  /**
   * Text to highlight above dropdown
   */
  highlightText?: string;
  /**
   * Should the dropdown menu align to the right?
   */
  alignRight?: boolean;
  /**
   * Should bolding match the current selection, should all options be bold, or should none be bold?
   */
  bolding?: "selection" | "none" | "all";
  /**
   * Additional classes passed to Dropdown top level component
   */
  classes?: string;
  /**
   * Additional styling passed to Dropdown top level component
   */
  style?: object;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const SINGLE_COLUMN_OPTIONS_MAX = 8;

export const Dropdown = ({
  options,
  label,
  highlightText = "",
  alignRight = false,
  bolding = "all",
  classes,
  style,
}: DropdownProps) => {
  return (
    <Menu
      as="div"
      className={`relative inline-block text-left self-center ${classes}`}
      style={style}
    >
      <div>
        <Menu.Button
          type="button"
          className={`
            ${
              highlightText?.length > 0
                ? "pr-14 translate-x-6 md:translate-x-0"
                : ""
            }
            ${classes}
            transform inline-flex w-full justify-center align-middle px-4 py-2 text-base font-normal text-slate-800 hover:text-slate-600 focus:outline-none focus:ring-offset-gray-100 font-sans
            `}
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {label}
          <span className="self-center pl-2">
            <DownCaret />
          </span>
        </Menu.Button>
      </div>
      {highlightText?.length > 0 && (
        <div className="absolute -right-6 md:right-0 bottom-6 bg-gradient-to-r from-story-pink-start to-story-pink-end rounded text-white text-2xs py-0 px-1">
          {highlightText}
        </div>
      )}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`
            ${
              alignRight
                ? "right-1/2 translate-x-1/2 md:right-0 md:mr-0"
                : "left-1/2 -translate-x-1/2 md:left-0"
            }
            ${
              options.length > SINGLE_COLUMN_OPTIONS_MAX
                ? "w-96 md:w-72 overflow-y-scroll md:overflow-auto"
                : options[0].icon
                ? "w-96 md:w-96"
                : "w-40 md:w-40"
            }
            transform md:translate-x-0 max-h-72 md:max-h-screen
            absolute z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1 flex flex-wrap" role="none">
            {options.map(
              ({ label: optionLabel, href, highlight, icon, nofollow }) => (
                <DropdownOption
                  label={optionLabel}
                  href={href}
                  highlight={highlight}
                  key={optionLabel}
                  icon={icon}
                  bold={
                    bolding === "all" ||
                    (bolding === "selection" && optionLabel === label)
                  }
                  columns={options.length > SINGLE_COLUMN_OPTIONS_MAX ? 2 : 1}
                  className={classes}
                  nofollow={nofollow}
                />
              )
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

interface DropdownOptionProps {
  label: string;
  href: string;
  highlight?: boolean;
  bold?: boolean;
  columns: number;
  icon?: {
    alternativeText: string;
    caption: string;
    url: string;
  };
  className?: string;
  nofollow?: boolean;
}

const DropdownOption = ({
  label,
  href,
  highlight = false,
  bold = false,
  columns = 1,
  icon,
  nofollow,
  className,
}: DropdownOptionProps) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          href={href}
          target="_blank"
          className={classNames(
            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
            highlight ? "text-story-pink" : "text-gray-700",
            bold && !icon ? "font-bold" : "font-normal",
            columns === 1 ? "w-full" : "w-1/2",
            icon ? "py-4" : "py-2",
            "block px-8 text-base",
            "font-sans",
            className || ""
          )}
          rel={`noreferrer ${nofollow ? "nofollow" : ""}`}
        >
          {icon && (
            <div className="relative w-full h-6 text-left">
              <Image
                src={icon.url}
                alt={icon.alternativeText}
                className="py-2"
                layout="fill"
                objectFit="contain"
                objectPosition={"0 50%"}
                priority
              />
            </div>
          )}
          {label}
        </a>
      )}
    </Menu.Item>
  );
};
