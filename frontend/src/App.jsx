// Conversation Wingman main component
import React, { useState } from 'react';

export default function App() {
  const [title] = useState('Conversation Wingman');
  return <div>{title}</div>;
}
