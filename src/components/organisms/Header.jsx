import { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { AuthContext } from '@/App';
const Header = ({ title, onMenuToggle }) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="small"
            icon="Menu"
            onClick={onMenuToggle}
            className="lg:hidden"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your vaccine inventory with precision
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="Calendar" size={16} />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="Clock" size={16} />
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
                <ApperIcon name="User" size={16} />
                <span className="font-medium">{user?.firstName || user?.name || 'User'}</span>
              </div>
              <Button
                variant="ghost"
                size="small"
                icon="LogOut"
                onClick={logout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;