import React from "react";

const DripperInfo = () => {
  return (
    <div className="flex flex-col gap-4 w-full bg-origin-bg-grey rounded md:rounded-lg border-spacing-0 p-4 md:p-8">
      <div className="font-bold text-origin-white text-xl md:text-2xl">
        Dripper
      </div>
      <p className="text-origin-white/75 test-base md:text-lg">
        When yield is generated, it does not immediately get distributed to
        users’ wallets. It first goes through the Dripper, which releases the
        yield steadily over time. Raw yield is often generated at irregular
        intervals and in unpredictable amounts. The Dripper streams this yield
        gradually for a smoother and more predictable APY.
      </p>
      <p className="text-origin-white/75 test-base md:text-lg">
        Proof of Yield is shown as two distinct categories of information.
        Above, yield is measured from the perspective of an OUSD holder after it
        leaves the Dripper. Below, yield from various sources is measured for
        the same time period prior to entering the Dripper.
      </p>
    </div>
  );
};

export default DripperInfo;
