import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const CustomButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  // Base styles for all buttons
  const baseStyles = 'font-semibold rounded focus:outline-none focus:ring';

  // Styles based on the 'variant' prop
  const variantStyles = {
    primary: 'text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-300',
    secondary: 'text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-gray-300',
    success: 'text-white bg-green-500 hover:bg-green-600 focus:ring-green-300',
    danger: 'text-white bg-red-500 hover:bg-red-600 focus:ring-red-300',
  };

  // Styles based on the 'size' prop
  const sizeStyles = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  // Combine all class names
  const combinedClassName = classNames(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className // User-provided class names
  );

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

CustomButton.propTypes = {
  /** The content of the button */
  children: PropTypes.node.isRequired,
  /** The variant changes the visual style of the button */
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger']),
  /** The size adjusts the padding and font size */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Additional class names to customize styling */
  className: PropTypes.string,
};

export default CustomButton;
