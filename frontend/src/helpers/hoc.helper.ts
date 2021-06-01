import React from 'react';

export function getHocDisplayName(hocName: string, WrappedComponent: React.ComponentType<any>) {
  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  return `${hocName}(${wrappedComponentName})`;
}