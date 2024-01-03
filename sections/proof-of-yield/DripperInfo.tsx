import React from "react";
import { Container } from "../../components/Container";
import { ContainerHeader } from "../../components/ContainerHeader";
import { ContainerBody } from "../../components/ContainerBody";

const DripperInfo = () => {
  return (
    <Container>
      <ContainerHeader>Dripper</ContainerHeader>
      <ContainerBody>
        <p className="text-origin-white/75 text-sm md:test-base">
          When yield is generated, it does not immediately get distributed to
          users’ wallets. It first goes through the Dripper, which releases the
          yield steadily over time. Raw yield is often generated at irregular
          intervals and in unpredictable amounts. The Dripper streams this yield
          gradually for a smoother and more predictable APY.
        </p>
        <p className="text-origin-white/75 text-sm md:test-base mt-4">
          Proof of Yield is shown as two distinct categories of information.
          Above, yield is measured from the perspective of an OUSD holder after
          it leaves the Dripper. Below, yield from various sources is measured
          for the same time period prior to entering the Dripper.
        </p>
      </ContainerBody>
    </Container>
  );
};

export default DripperInfo;
