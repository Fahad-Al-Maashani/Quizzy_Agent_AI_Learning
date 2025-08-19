import './globals.css';

export const metadata = {
  title: 'Learning Journal',
  description: 'Upload PDFs, quiz yourself, and track daily commitment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}