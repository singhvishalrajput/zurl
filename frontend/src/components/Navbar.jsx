import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext';
import { LogOut, User, Link2, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowLogoutModal(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <Link2 className="w-6 h-6 text-gray-900" />
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Zurl</h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/"
                  className="px-4 py-2 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  My URLs
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="px-4 py-2 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gray-900 text-white font-medium
                           hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors cursor-pointer text-center"
                  >
                    Home
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors cursor-pointer text-center"
                  >
                    My URLs
                  </Link>
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      setShowLogoutModal(true);
                    }}
                    className="px-4 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 font-medium transition-colors cursor-pointer text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors cursor-pointer text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="bg-white border-2 border-gray-900 p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 bg-white text-gray-900 font-medium border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
