import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Governance: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('https://ousd.com/governance');
  }, []);

  return null;
};

export async function getServerSideProps(context: any) {
  if (context.res) {
    context.res.writeHead(302, { Location: 'https://ousd.com/governance' });
    context.res.end();
  }

  return {};
}

export default Governance;