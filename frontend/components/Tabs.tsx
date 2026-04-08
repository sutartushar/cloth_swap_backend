'use client';

import { useState, ReactNode } from 'react';

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
}

interface TabsListProps {
  children: ReactNode;
}

interface TabsTriggerProps {
  children: ReactNode;
  value: string;
}

interface TabsContentProps {
  children: ReactNode;
  value: string;
  className?: string;
}

export function Tabs({ children, defaultValue }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div>
      {Array.isArray(children) &&
        children.map((child: any) => {
          if (child.type === TabsList) {
            return (
              <div key="tabs-list">
                {child.props.children instanceof Array
                  ? child.props.children.map((triggerChild: any) => (
                      <button
                        key={triggerChild.props.value}
                        onClick={() => setActiveTab(triggerChild.props.value)}
                        className={`px-6 py-3 font-semibold border-b-2 transition ${
                          activeTab === triggerChild.props.value
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-gray-300 text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        {triggerChild.props.children}
                      </button>
                    ))
                  : null}
              </div>
            );
          }
          return null;
        })}

      {Array.isArray(children) &&
        children.map((child: any) => {
          if (child.type === TabsContent && child.props.value === activeTab) {
            return (
              <div key={`content-${activeTab}`} className={child.props.className}>
                {child.props.children}
              </div>
            );
          }
          return null;
        })}
    </div>
  );
}

export function TabsList({ children }: TabsListProps) {
  return <div>{children}</div>;
}

export function TabsTrigger({ children, value }: TabsTriggerProps) {
  return <div data-value={value}>{children}</div>;
}

export function TabsContent({ children, value, className }: TabsContentProps) {
  return <div data-value={value} className={className}>{children}</div>;
}
