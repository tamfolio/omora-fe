import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} OMORA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;