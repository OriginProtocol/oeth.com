import { collaterals as tokens } from "../../constants";
import { Typography } from "@originprotocol/origin-storybook";
import { CollateralItem, GradientButton } from "../../components";
import { useViewWidth } from "../../hooks";
import { mdSize } from "../../constants";

interface CollateralProps {}

const Collateral = ({}: CollateralProps) => {
  const width = useViewWidth();

  return (
    <>
      <section className="bg-origin-bg-grey">
        <div className="px-[16px] md:px-[64px] lg:px-[134px] py-14 md:py-[120px] text-center">
          <Typography.H6
            className="text-[32px] md:text-[56px] leading-[36px] md:leading-[64px]"
            style={{ fontWeight: 500 }}
          >
            Instantly redeemable
          </Typography.H6>
          <Typography.Body3 className="md:max-w-[943px] mt-[16px] mx-auto !leading-[23px] md:!leading-[28px] text-subheading text-sm md:text-base">
            {`OETH's on-chain reserves remain liquid and available for
            permissionless redemption with no gatekeepers or withdrawal queue.`}
          </Typography.Body3>
          <div className="w-full bg-origin-bg-black rounded-lg md:rounded-2xl my-10 md:my-20">
            <Typography.H7 className="text-base font-bold leading-[28px] md:leading-[32px] pt-6 md:pt-20 pb-3">
              Collateral
            </Typography.H7>
            <Typography.Body3 className="text-sm text-subheading leading-[23px] pb-6 md:pb-10">
              Current collateral used to back OETH.
            </Typography.Body3>
            {width <= mdSize && (
              <div className="px-6 pb-6">
                {Object.keys(tokens).map((token) => (
                  <CollateralItem
                    key={tokens[token].symbol}
                    img={tokens[token].img}
                    tokenName={tokens[token].tokenName}
                    symbol={tokens[token].symbol}
                    className="mb-2 w-full mx-auto"
                  />
                ))}
              </div>
            )}
            {width > mdSize && (
              <>
                <div className="w-[690px] lg:w-[720px] flex justify-center mx-auto">
                  <CollateralItem
                    img={tokens.steth.img}
                    tokenName={tokens.steth.tokenName}
                    symbol={tokens.steth.symbol}
                    className="flex-1 mr-2"
                  />
                  <CollateralItem
                    img={tokens.frxeth.img}
                    tokenName={tokens.frxeth.tokenName}
                    symbol={tokens.frxeth.symbol}
                    className="flex-1 mr-2"
                  />
                  <CollateralItem
                    img={tokens.eth.img}
                    tokenName={tokens.eth.tokenName}
                    symbol={tokens.eth.symbol}
                    className="flex-1"
                  />
                </div>
                <div className="w-[690px] lg:w-[720px] flex justify-center mx-auto mt-2 pb-20">
                  <CollateralItem
                    img={tokens.reth.img}
                    tokenName={tokens.reth.tokenName}
                    symbol={tokens.reth.symbol}
                    className="flex-1 mr-2"
                  />
                  <CollateralItem
                    img={tokens.weth.img}
                    tokenName={tokens.weth.tokenName}
                    symbol={tokens.weth.symbol}
                    className="flex-1"
                  />
                </div>
              </>
            )}
          </div>

          <div className="px-4 md:px-0">
            <GradientButton
              outerDivClassName="w-full md:w-fit md:mx-auto  hover:bg-transparent hover:opacity-90"
              className="bg-transparent py-[14px] md:py-5 md:px-20 lg:px-20 hover:bg-transparent"
              elementId="btn-collateral-docs"
              onClick={() =>
                window.open(
                  "https://docs.ousd.com/how-it-works",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <Typography.H7 className="font-normal">
                See how it works
              </Typography.H7>
            </GradientButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default Collateral;
