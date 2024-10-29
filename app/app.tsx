import React from 'react';
import { AppProvider } from '@/components/Apimages'; 
import Index from '.'; // Your main screen

const App: React.FC = () => {
  return (
    <AppProvider>
      <Index />
    </AppProvider>
  );
};

export default App;