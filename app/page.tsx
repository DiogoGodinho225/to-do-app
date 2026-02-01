import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/(frontend)/(auth)/signin');
}
