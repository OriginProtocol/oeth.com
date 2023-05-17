import React, { useState } from "react";
import { Dropdown } from "./Dropdown";
import {
  OriginDollarLogo,
  OriginEtherLogo,
  OriginLogo,
  OriginStoryLogo,
} from "../Icons";
import { twMerge } from "tailwind-merge";
import { getRelProps } from "../utils";

export interface ButtonProps {
  /**
   * What type of button is this?
   */
  type?: "primary" | "secondary" | "header";
  /**
   * What property is this button for?
   */
  webProperty?: "originprotocol" | "ousd" | "oeth" | "story";
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
export const Button = ({
  type = "primary",
  webProperty = "originprotocol",
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

  switch (webProperty) {
    case "originprotocol":
      background =
        type === "primary"
          ? "bg-gradient-to-r from-origin-protocol-button-start to-origin-protocol-button-end"
          : "";
      textColor =
        type === "primary"
          ? "text-white"
          : type === "header"
          ? "text-slate-800"
          : "text-black";
      hoverStyles =
        type === "primary" ? "hover:text-gray-100" : "hover:text-slate-600";
      break;

    case "ousd":
      background =
        type === "primary"
          ? "bg-gradient-to-r from-ousd-button-start to-ousd-button-end"
          : type === "secondary"
          ? "bg-gradient-to-r from-ousd-button-dark-start to-ousd-button-dark-end"
          : "";
      textColor = "text-white";
      hoverStyles = type === "header" ? "" : "hover:text-gray-300";
      break;

    case "oeth":
      background =
        type === "primary"
          ? "bg-gradient-to-r from-oeth-button-start to-oeth-button-end"
          : type === "secondary"
          ? "bg-gradient-to-r from-oeth-button-dark-start to-oethx  -button-dark-end"
          : "";
      textColor = "text-white";
      hoverStyles = type === "header" ? "" : "hover:text-gray-300";
      break;

    case "story":
      background =
        type === "primary"
          ? "bg-gradient-to-r from-story-button-start to-story-button-end"
          : type === "header"
          ? ""
          : "bg-white";
      textColor =
        type === "primary"
          ? "text-white"
          : type === "header"
          ? "text-black"
          : "text-story-blue";
      hoverStyles =
        type === "primary"
          ? "hover:bg-gray-50 hover:text-gray-100"
          : "hover:bg-gray-50";
      break;

    default:
      break;
  }

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

  const Component = target === "_self" && href?.startsWith("/") ? Link : "span";

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
      <Component href={href || ""} target={target}>
        {webProperty === "ousd" || webProperty === "oeth" ? (
          <div
            className={`relative bg-gradient2 rounded-[100px] w-full md:w-fit h-fit ${
              isButton ? "hover:opacity-90" : ""
            }`}
          >
            <button
              onClick={onClick}
              className={twMerge(
                `relative bg-origin-bg-black rounded-[100px] w-full md:w-auto ${
                  isButton ? "px-4 lg:px-6 hover:bg-[#1b1a1abb]" : ""
                } py-1 text-origin-white`,
                bg
              )}
            >
              {label}
              {children}
            </button>
          </div>
        ) : (
          <>
            {label}
            {children}
          </>
        )}
      </Component>
    </a>
  );
};

export type MappedLink<Link> = {
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

export type LinkFormatted<IconFormatted> = {
  label: string;
  href: string;
  highlight?: boolean;
  target: string;
  icon?: IconFormatted;
  nofollow?: boolean;
};

export type IconFormatted = {
  alternativeText: string;
  caption: string;
  url: string;
};

export interface NavLinksProps {
  /**
   * Array of link objects the header will use to create dropdowns and buttons
   */
  mappedLinks: MappedLink<LinkFormatted<IconFormatted>>[];
  /**
   * webProperty that header will be used on, changes logo on left side
   */
  webProperty: "originprotocol" | "ousd" | "oeth" | "story";
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
  webProperty,
  active,
  isMobile,
  background,
}: NavLinksProps) => (
  <div
    className={`flex flex-col md:!flex-row space-y-4 md:!space-y-0 ${
      (webProperty === "ousd" || webProperty === "oeth") && isMobile
        ? "px-8"
        : "items-center justify-center"
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
                (webProperty === "ousd" || webProperty === "oeth") && isMobile
                  ? "-ml-4 mr-auto"
                  : webProperty === "ousd" || webProperty === "oeth"
                  ? "pt-2"
                  : ""
              }`}
              key={mappedLink.label}
            >
              <Button
                label={mappedLink.label}
                type="header"
                size="nav"
                href={mappedLink.href}
                webProperty={webProperty}
                target={mappedLink.target}
                background={background}
                className={`${
                  mappedLink.isHighlight ? "text-story-pink" : ""
                } ${
                  (webProperty === "ousd" || webProperty === "oeth") && isMobile
                    ? "text-base"
                    : isMobile
                    ? "text-2xl"
                    : ""
                }`}
                {...relProps}
              />
              {(webProperty === "ousd" || webProperty === "oeth") && (
                <div
                  className={`h-1 mx-4 mt-0.5 bg-gradient-to-r ${
                    webProperty === "ousd" &&
                    "group-hover:from-ousd-purple group-hover:to-ousd-blue"
                  } ${
                    webProperty === "oeth" &&
                    "group-hover:from-oeth-purple group-hover:to-oeth-blue"
                  } rounded-full ${
                    active === mappedLink.label
                      ? "from-ousd-purple to-ousd-blue"
                      : ""
                  }`}
                ></div>
              )}
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
              size={
                webProperty === "ousd" || webProperty === "oeth"
                  ? "border"
                  : "small"
              }
              label={mappedLink.label}
              key={mappedLink.label}
              href={mappedLink.href}
              target={mappedLink.target}
              className={`${
                (webProperty === "ousd" || webProperty === "oeth") && isMobile
                  ? "absolute left-8 right-8 bottom-8 text-center"
                  : ""
              }`}
              background={background}
              webProperty={webProperty}
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
  webProperty,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  webProperty: "originprotocol" | "ousd" | "oeth" | "story";
}) => (
  <div className="space-y-2 cursor-pointer" onClick={() => setOpen(!open)}>
    <span
      className={`block w-8 h-0.5 ${
        webProperty === "ousd" || webProperty === "oeth"
          ? "bg-white"
          : "bg-gray-600"
      } transform transition-transform ${
        open ? "rotate-45 translate-y-1.5" : ""
      }`}
    ></span>
    <span
      className={`block w-8 h-0.5 ${
        webProperty === "ousd" || webProperty === "oeth"
          ? "bg-white"
          : "bg-gray-600"
      } transform transition-transform ${
        open ? "-rotate-45 -translate-y-1" : ""
      }`}
    ></span>
  </div>
);

export interface HeaderProps {
  /**
   * webProperty that header will be used on, changes logo on left side
   */
  webProperty: "originprotocol" | "ousd" | "oeth" | "story";
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

export const Header = ({
  webProperty,
  mappedLinks,
  background,
  active,
  className,
}: HeaderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={twMerge(
        `${
          webProperty === "ousd" || webProperty === "oeth"
            ? "px-8 md:!px-16 lg:!px-[8.375rem]"
            : ""
        }`,
        background,
        className
      )}
    >
      <div
        className={`py-9 md:!py-16 w-full flex justify-between items-center mx-auto ${
          webProperty === "ousd" || webProperty === "oeth"
            ? "max-w-[89.5rem]"
            : "max-w-screen-xl px-9"
        }`}
      >
        <div className="flex h-4 md:!h-6">
          <a href="/">
            {webProperty === "originprotocol" && <OriginLogo />}
            {webProperty === "ousd" && <OriginDollarLogo />}
            {webProperty === "oeth" && <OriginEtherLogo />}
            {webProperty === "story" && <OriginStoryLogo />}
          </a>
        </div>
        <div className="hidden md:!block">
          <NavLinks
            background={background}
            mappedLinks={mappedLinks}
            webProperty={webProperty}
            active={active}
          />
        </div>
        <div className="block md:!hidden">
          <Hamburger open={open} setOpen={setOpen} webProperty={webProperty} />
        </div>
        <div
          className={`
            ${open ? "translate-y-0" : "translate-y-full"}
            ${
              webProperty === "ousd" || webProperty === "oeth"
                ? "bg-black"
                : "bg-white"
            }
            transform md:!hidden fixed top-0 bottom-0 right-0 left-0 transition-transform shadow z-50
          `}
        >
          <div className="relative h-full">
            <div className="flex flex-col justify-center align-middle h-full">
              <div className="absolute left-8 top-9 h-4">
                <a href="/">{webProperty === "ousd" && <OriginDollarLogo />}</a>
              </div>
              <div className="absolute right-8 top-9">
                <Hamburger
                  open={open}
                  setOpen={setOpen}
                  webProperty={webProperty}
                />
              </div>
              <NavLinks
                background={background}
                mappedLinks={mappedLinks}
                webProperty={webProperty}
                isMobile
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
