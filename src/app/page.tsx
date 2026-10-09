import { redirect } from 'next/navigation';

/** The back office starts on the products list (the proxy sends logged-out visitors to /login). */
export default function HomePage() {
  redirect('/productos');
}
