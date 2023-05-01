import { useState } from "react";
import Image from "next/image";
import assetRootPath from "../assetRootPath";
import { useViewWidth } from "../../hooks";
import { mdSize } from "../../constants";

const size = 150;
const smSize = 80;

export const Uniswap = () => {
  const [hover, setHover] = useState(false);
  const width = useViewWidth();

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? (
        <Image
          src={assetRootPath("/images/uniswap-logo-gold.svg")}
          width={width < mdSize ? smSize : size}
          height={size}
          alt="uniswap gold"
        />
      ) : (
        <Image
          src={assetRootPath("/images/uniswap-logo.svg")}
          width={width < mdSize ? smSize : size}
          height={size}
          alt="uniswap"
        />
      )}
    </div>
  );
};

export default Uniswap;
