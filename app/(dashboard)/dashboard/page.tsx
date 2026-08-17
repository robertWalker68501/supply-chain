import { getDashboardOverview } from '@/app/(dashboard)/dashboard/actions/dashboard';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

const DashboardPage = async () => {
  const result = await getDashboardOverview();

  if (!result.success) {
    return (
      <div className='grid gap-2'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <p className='text-destructive text-sm'>{result.error}</p>
      </div>
    );
  }

  return <DashboardOverview overview={result.data} />;
};

export default DashboardPage;
