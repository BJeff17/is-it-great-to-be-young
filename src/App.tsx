import React from 'react';
import { PresenterConsoleView } from './components/presenter/PresenterConsoleView';
import { MobileRemoteView } from './components/remote/MobileRemoteView';
import { StageView } from './components/stage/StageView';
import { StudioDrawer } from './components/studio/StudioDrawer';
import { DeckProvider } from './context/DeckContext';

export const App: React.FC = () => {
  const path = window.location.pathname;

  if (path.startsWith('/remote')) {
    return <MobileRemoteView />;
  }

  if (path.startsWith('/presenter')) {
    return <PresenterConsoleView />;
  }

  return (
    <DeckProvider>
      <StageView />
      <StudioDrawer />
    </DeckProvider>
  );
};

export default App;
