import React from 'react';
import { useTabBarAnimation } from '../hooks/useTabBarAnimation';

export const withScrollHandler = (WrappedComponent) => {
  return (props) => {
    const { handleScroll } = useTabBarAnimation();

    return (
      <WrappedComponent
        {...props}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    );
  };
}; 