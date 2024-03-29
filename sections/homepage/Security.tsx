import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "@originprotocol/origin-storybook";
import { assetRootPath } from "../../utils";
import { Audit } from "../../types";
import { GradientButton, Section } from "../../components";
import { twMerge } from "tailwind-merge";
import { SecurityFeature } from "../../components";

interface SecurityProps {
  audits: Audit[];
  sectionOverrideCss?: string;
}

const Security = ({ audits, sectionOverrideCss }: SecurityProps) => {
  return (
    <Section
      className={twMerge("bg-origin-bg-black", sectionOverrideCss)}
      innerDivClassName="py-14 md:py-[120px] text-center"
    >
      <Typography.H6
        className="text-[32px] md:text-[56px] leading-[36px] md:leading-[64px]"
        style={{ fontWeight: 500 }}
      >
        Security first
      </Typography.H6>
      <Typography.Body3
        className="md:max-w-[943px] mt-[16px] mx-auto !leading-[23px] md:!leading-[28px] text-subheading text-sm md:text-base"
        style={{ fontDisplay: "swap" }}
      >
        OETH&apos;s smart contracts are forked from OUSD, which has been
        stress-tested for more than two years.
      </Typography.Body3>

      <div className="flex flex-col md:flex-row relative mb-10 md:mb-20 mt-10 md:mt-20 max-w-[1134px] mx-auto">
        <SecurityFeature
          title="Audited by world-class experts"
          subtitle="Changes to the protocol are reviewed by internal and external auditors on an ongoing basis."
          className="flex-1 md:mr-6"
        >
          <div className="grid grid-cols-2 gap-y-10 lg:flex lg:flex-row lg:justify-between mx-auto">
            {audits.map((audit, i) => {
              return (
                <Link
                  className="mx-auto flex justify-center items-center flex-col"
                  href={audit.attributes.auditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={i}
                >
                  <div className="relative rounded-full w-[104px] h-[104px] md:w-[72px] md:h-[72px] bg-origin-bg-black">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Image
                        src={assetRootPath(
                          `/images/${audit.attributes.name
                            .replace(/ /g, "-")
                            .toLowerCase()}.svg`
                        )}
                        width={
                          audit.attributes.name === "OpenZeppelin" ? 27 : 56
                        }
                        height={56}
                        alt={audit.attributes.name}
                      />
                    </div>
                  </div>
                  <Typography.Body className="mt-4 text-sm md:text-sm text-subheading">
                    {audit.attributes.name}
                  </Typography.Body>
                </Link>
              );
            })}
          </div>
        </SecurityFeature>
        <SecurityFeature
          title="48-hour timelock"
          subtitle="If a malicious governance vote were to ever pass, users are given 48 hours to withdraw their funds before any new code is implemented."
          className="flex-1 mt-3 md:mt-0 md:mr-6"
        >
          <div className="w-full flex justify-center">
            <Link
              className="mx-auto flex justify-center items-center flex-col"
              href={"https://docs.oeth.com/governance/timelock"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={assetRootPath("/images/lock.svg")}
                width="96"
                height="96"
                alt="lock"
              />
            </Link>
          </div>
        </SecurityFeature>
        <SecurityFeature
          title="Bug bounties"
          subtitle="A reward up to $1,000,000 is offered through Immunefi, Web3's leading bug bounty platform. In over two years, no major vulnerability has been identified in OUSD's open-source code."
          className="mt-3 md:mt-0 flex-1"
        >
          <div className="w-full flex justify-center">
            <Link
              className="mx-auto flex justify-center items-center flex-col"
              href={"https://docs.oeth.com/security-and-risks/bug-bounties"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={assetRootPath("/images/immunefi.svg")}
                width="180"
                height="180"
                alt="immunefi"
              />
            </Link>
          </div>
        </SecurityFeature>
      </div>
      <div className="px-4 md:px-0">
        <GradientButton
          outerDivClassName="w-full md:w-fit md:mx-auto  hover:bg-transparent hover:opacity-90"
          className="bg-transparent py-[14px] md:py-5 md:px-20 lg:px-20 hover:bg-transparent"
          elementId="btn-security-docs"
          onClick={() =>
            window.open(
              "https://docs.oeth.com/security-and-risks/audits",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          <Typography.H7
            className="font-normal"
            style={{ fontDisplay: "swap" }}
          >
            Review audits
          </Typography.H7>
        </GradientButton>
      </div>
    </Section>
  );
};

export default Security;
