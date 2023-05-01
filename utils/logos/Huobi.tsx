import { useState } from "react";
import Image from "next/image";
import assetRootPath from "../assetRootPath";
import { useViewWidth } from "../../hooks";
import { mdSize } from "../../constants";

const size = 125;
const smSize = 65;

export const Huobi = () => {
  const [hover, setHover] = useState(false);
  const width = useViewWidth();

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? (
        <Image
          src={assetRootPath("/images/huobi-logo-gold.svg")}
          width={width < mdSize ? smSize : size}
          height={size}
          alt="huobi gold"
        />
      ) : (
        <Image
          src={assetRootPath("/images/huobi-logo.svg")}
          width={width < mdSize ? smSize : size}
          height={size}
          alt="huobi"
        />
      )}
    </div>
  );
};

export default Huobi;
