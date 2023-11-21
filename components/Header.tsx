import React, { useState, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dropdown } from "./Dropdown";
import { twMerge } from "tailwind-merge";
import { assetRootPath } from "../utils";
import GradientButton from "./GradientButton";

const getRelProps = (nofollow?: boolean) =>
  nofollow ? { rel: "nofollow" } : {};

interface ButtonProps {
  /**
   * What type of button is this?
   */
  type?: "primary" | "secondary" | "header";
  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large" | "nav" | "border";
  /**
   * Button contents
   */
  label?: string;
  /**
   * Optional children to use instead of a label
   */
  children?: React.ReactNode;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Optional href
   */
  href?: string;
  /**
   * Optional target
   */
  target?: string;
  /**
   * Optional rel
   */
  rel?: string;
  /**
   * What additional classes should be used?
   * Will add onto classes derived from other props.
   */
  className?: string;
  /**
   * What additional styles should be used?
   * Will override background colors/gradients derived from other props.
   */
  style?: object;
  /**
   * Disables the button
   */
  disabled?: boolean;
  /**
   * Tailwind background color class
   */
  background?: string;
  /**
   * Whether button looks like button
   */
  isButton?: boolean;
}

/**
 * Primary UI component for user interaction
 */
const Button = ({
  type = "primary",
  size = "medium",
  label,
  children,
  href,
  target,
  rel,
  className = "",
  style = {},
  disabled,
  background: bg,
  isButton,
  onClick,
  ...props
}: ButtonProps) => {
  let background;
  let textColor;
  let hoverStyles;

  let textSize;
  let padding;
  switch (size) {
    case "border":
      textSize = "text-base font-normal";
      padding = "px-0.5 py-0.5";
      break;

    case "nav":
      textSize = "text-base font-normal";
      padding = "px-7 py-1";
      break;

    case "small":
      textSize = "text-base";
      padding = "px-7 py-1";
      break;

    case "medium":
      textSize = "text-base";
      padding = "px-12 py-4";
      break;

    case "large":
      textSize = "text-2xl";
      padding = "px-12 py-6";
      break;

    default:
      break;
  }

  let fontWeight;
  let shadow;
  let rounding;
  switch (type) {
    case "header":
      fontWeight = "font-normal";
      shadow = "";
      rounding = "";
      padding = "px-4 py-1";
      break;

    default:
      fontWeight = "font-medium";
      shadow = "shadow";
      rounding = "rounded-full";
      break;
  }

  const handleClick = (e: React.SyntheticEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <a
      href={href || ""}
      target={target}
      rel={rel}
      className={`
          ${background}
          ${textColor}
          ${textSize}
          ${padding}
          ${fontWeight}
          ${shadow}
          ${rounding}
          ${hoverStyles}
          leading-7
          font-sans
          animate-gradient
          background-gradient-oversized
          cursor-pointer
          whitespace-nowrap
          ${className}
        `}
      style={style}
      onClick={handleClick}
      {...props}
    >
      <span>
        {isButton ? (
          <GradientButton
            outerDivClassName="w-full md:w-auto"
            className="py-1 w-full md:w-auto bg-transparent md:bg-origin-bg-black"
          >
            {label}
            {children}
          </GradientButton>
        ) : (
          <div className="text-subheading md:text-origin-white">
            {label}
            {children}
          </div>
        )}
      </span>
    </a>
  );
};

type MappedLink<Link> = {
  href?: string;
  label: string;
  isButton: boolean;
  highlightText?: string;
  order: number;
  target?: string;
  links?: Link[];
  isHighlight?: boolean;
  nofollow?: boolean;
};

type LinkFormatted<IconFormatted> = {
  label: string;
  href: string;
  highlight?: boolean;
  target: string;
  icon?: IconFormatted;
  nofollow?: boolean;
};

type IconFormatted = {
  alternativeText: string;
  caption: string;
  url: string;
};

interface NavLinksProps {
  /**
   * Array of link objects the header will use to create dropdowns and buttons
   */
  mappedLinks: MappedLink<LinkFormatted<IconFormatted>>[];
  /**
   * Currently displayed page of navigation bar
   */
  active?: string;
  /**
   * Is this being used on a mobile hamburger drawer? Used to enlarge text if so.
   */
  isMobile?: boolean;
  /**
   * Tailwind background color class of the header
   */
  background?: string;
}

const NavLinks = ({
  mappedLinks,
  active,
  isMobile,
  background,
}: NavLinksProps) => (
  <div
    className={`flex flex-col md:!flex-row space-y-4 md:!space-y-0 overflow-hidden ${
      isMobile ? "px-8" : "justify-end items-center"
    }`}
  >
    {mappedLinks.map((mappedLink) => {
      const relProps = getRelProps(mappedLink.nofollow);

      if (!mappedLink.isButton && mappedLink.links) {
        if (mappedLink.links.length > 0) {
          return (
            <Dropdown
              label={mappedLink.label}
              highlightText={mappedLink.highlightText}
              options={mappedLink.links}
              key={mappedLink.label}
              bolding="none"
              classes={`${isMobile ? "text-2xl" : ""}`}
            />
          );
        } else {
          return (
            <div
              className={`group flex flex-col ${
                isMobile ? "-ml-4 mr-auto" : "pt-2"
              }`}
              key={mappedLink.label}
            >
              <Button
                label={mappedLink.label}
                type="header"
                size="nav"
                href={mappedLink.href}
                target={mappedLink.target}
                background={background}
                className={`${
                  mappedLink.isHighlight ? "text-story-pink" : ""
                } text-base`}
                {...relProps}
              />
              <div
                className={`h-1 mx-4 mt-0.5 bg-gradient-to-r group-hover:from-oeth-purple group-hover:to-oeth-blue
                   rounded-full ${
                     active === mappedLink.label
                       ? "from-oeth-purple to-oeth-blue"
                       : ""
                   }`}
              />
            </div>
          );
        }
      }
    })}
    <div
      className={`flex flex-col md:!flex-row md:!space-x-5 md:!pl-4 items-center justify-center space-y-4 md:!space-y-0`}
    >
      {mappedLinks.map((mappedLink) => {
        const relProps = getRelProps(mappedLink.nofollow);

        if (mappedLink.isButton) {
          return (
            <Button
              size={`border`}
              label={mappedLink.label}
              key={mappedLink.label}
              href={mappedLink.href}
              target={mappedLink.target}
              className={`${
                isMobile ? "absolute left-8 right-8 bottom-8 text-center" : ""
              }`}
              background={background}
              isButton
              {...relProps}
            />
          );
        }
      })}
    </div>
  </div>
);

const Hamburger = ({
  setOpen,
  open,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}) => (
  <div className="space-y-2 cursor-pointer" onClick={() => setOpen(!open)}>
    <span
      className={`block w-8 h-0.5 bg-white transform transition-transform ${
        open ? "rotate-45 translate-y-1.5" : ""
      }`}
    ></span>
    <span
      className={`block w-8 h-0.5 bg-white transform transition-transform ${
        open ? "-rotate-45 -translate-y-1" : ""
      }`}
    ></span>
  </div>
);

interface HeaderProps {
  /**
   * Array of link objects the header will use to create dropdowns and buttons
   */
  mappedLinks: MappedLink<LinkFormatted<IconFormatted>>[];
  /**
   * Currently displayed page of navigation bar
   */
  active?: string;

  className?: string;
  /**
   * Tailwind background color class of the header
   */
  background?: string;
}

const Header = ({
  mappedLinks,
  background,
  active,
  className,
}: HeaderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <header className={twMerge("px-8 md:!px-16 lg:!px-[8.375rem]", className)}>
      <div
        className={
          "py-9 md:!py-16 w-full flex justify-between items-center mx-auto max-w-[89.5rem]"
        }
      >
        <div className="flex h-4 md:!h-6">
          <a href="/">
            <Image
              src={assetRootPath("/images/origin-ether-logo.svg")}
              width={181}
              height={24}
              alt="Origin Ether Logo"
              className="w-[121px] h-[16px] md:!w-[181px] md:!h-[24px]"
            />
          </a>
        </div>
        <div className="flex-1 hidden md:!block min-w-0">
          <NavLinks mappedLinks={mappedLinks} active={active} />
        </div>
        <div className="block md:!hidden">
          <Hamburger open={open} setOpen={setOpen} />
        </div>
        <div
          className={`
            ${open ? "translate-y-0" : "translate-y-full"}
            bg-origin-bg-black
            transform md:!hidden fixed top-0 bottom-0 right-0 left-0 transition-transform shadow z-50
          `}
        >
          <div className="relative h-full">
            <div className="flex flex-col justify-center align-middle h-full">
              <div>
                <Image
                  src={assetRootPath("/images/origin-ether-logo.svg")}
                  width={181}
                  height={24}
                  alt="Origin Ether Logo"
                  className="absolute left-4 top-7 w-[121px] h-[16px] md:!w-[181px] md:!h-[24px]"
                />
                <div className="absolute right-[22px] top-7">
                  <Hamburger open={open} setOpen={setOpen} />
                </div>
              </div>
              <NavLinks
                background={background}
                mappedLinks={mappedLinks}
                isMobile
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
