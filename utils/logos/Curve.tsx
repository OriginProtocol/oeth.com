import Image from "next/image";
import { useState } from "react";
import assetRootPath from "../assetRootPath";
import { useViewWidth } from "../../hooks";
import { mdSize } from "../../constants";

const size = 150;
const smSize = 80;

export const Curve = () => {
  const [hover, setHover] = useState(false);
  const width = useViewWidth();

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? (
        <Image
          src={assetRootPath("/images/curve-logo-gold.svg")}
          width={width < mdSize ? smSize : size}
          height={size}
          alt="curve gold"
        />
      ) : (
        <Image
          src={assetRootPath("/images/curve-logo.svg")}
          width={width < mdSize ? smSize : size}
          height={size}
          alt="curve"
        />
      )}
    </div>
  );
};

export default Curve;
