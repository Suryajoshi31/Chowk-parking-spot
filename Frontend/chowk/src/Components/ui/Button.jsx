import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ children, variant = 'primary', className = '', to, onClick, type = 'button', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 shadow-sm",
    outline: "border-2 border-amber-500 text-amber-600 hover:bg-amber-50",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[props.size || 'md'];
  
  const combinedClassName = `${baseStyle} ${variantStyle} ${sizeStyle} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClassName} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
