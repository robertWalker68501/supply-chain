import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='border-border border-t py-4'>
      <div className='page-container'>
        <p className='text-muted-foreground text-center text-sm'>
          SupplyChian &copy; {new Date().getFullYear()} |{' '}
          <Link
            href='/'
            className='hover:text-primary'
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
