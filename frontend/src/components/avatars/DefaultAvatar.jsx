import React from 'react';

const DefaultAvatar = ({ className }) => (
  <svg className={className} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="40" fill="#2E7D32"/>
    <path d="M40 12 L50 32 L30 32 Z" fill="#4CAF50"/>
    <path d="M40 20 L55 45 L25 45 Z" fill="#4CAF50"/>
    <rect x="37" y="45" width="6" height="20" fill="#1B5E20"/>
    <circle cx="40" cy="28" r="6" fill="#FFFFFF"/>
    <path d="M30 60 C30 45 50 45 50 60" fill="#FFFFFF"/>
  </svg>
);

export default DefaultAvatar;