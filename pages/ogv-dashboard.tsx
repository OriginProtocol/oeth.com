import { useEffect } from 'react';
import { useRouter } from 'next/router';

const OgvDashboard: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('https://ousd.com/ogv-dashboard');
  }, []);

  return null;
};

export async function getServerSideProps(context: any) {
  if (context.res) {
    context.res.writeHead(302, { Location: 'https://ousd.com/ogv-dashboard' });
    context.res.end();
  }

  return {};
}

export default OgvDashboard;