import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Transit | Study Spottah Mānoa',
  description: 'A student-first transit preview for UH Mānoa featuring TheBus and Rainbow Shuttle stops.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
