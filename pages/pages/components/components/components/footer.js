// components/Footer.js
export default function Footer() {
  return (
    <footer className="mt-12 border-t">
      <div className="max-w-4xl mx-auto p-4 text-sm text-center">
        © {new Date().getFullYear()} Bleskit Cuts — All rights reserved
      </div>
    </footer>
  );
}
