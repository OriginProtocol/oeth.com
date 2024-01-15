import React from "react";
import { Container } from "../../components/Container";
import { ContainerHeader } from "../../components/ContainerHeader";
import { ContainerBody } from "../../components/ContainerBody";
import { Typography } from "@originprotocol/origin-storybook";

const DripperInfo = () => {
  return (
    <>
      <Typography.Body className="text-xl mt-14">Dripper</Typography.Body>
      <Typography.Body3 className="mt-3 text-xs text-table-title">
        When yield is generated, it does not immediately get distributed to
        users’ wallets. It first goes through the Dripper, which releases the
        yield steadily over time. Raw yield is often generated at irregular
        intervals and in unpredictable amounts. The Dripper streams this yield
        gradually for a smoother and more predictable APY.
      </Typography.Body3>
      <Typography.Body3 className="mt-3 text-xs text-table-title">
        Proof of Yield is shown as two distinct categories of information.
        Above, yield is measured from the perspective of an OETH holder after it
        leaves the Dripper. Below, yield from various sources is measured for
        the same time period prior to entering the Dripper.
      </Typography.Body3>
    </>
  );
};

export default DripperInfo;
