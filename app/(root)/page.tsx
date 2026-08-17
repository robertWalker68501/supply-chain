import Image from 'next/image';

const Home = () => {
  return (
    <div className='flex min-h-dvh flex-col items-center justify-center'>
      <Image
        src='/assets/images/logo-light.png'
        alt='SupplyChain Logo'
        width={1670}
        height={471}
        sizes='600px'
        className='h-auto w-150 dark:hidden'
      />
      <Image
        src='/assets/images/logo-dark.png'
        alt='SupplyChain Logo'
        width={1670}
        height={471}
        sizes='600px'
        className='hidden h-auto w-150 dark:block'
      />
      <div className='mx-auto mt-3 w-full max-w-2xl text-center'>
        <h1 className='font-heading bg-linear-to-b from-[#3cfefd] to-[#009efd] bg-clip-text text-5xl font-bold text-transparent'>
          Manage your supply chain all in one place
        </h1>
      </div>
    </div>
  );
};

export default Home;
