"use client";

import React, { useState, useCallback, useMemo } from "react";
import { AppContext } from "./appContext";
import { TConversation } from "../_utils/types";

interface IApp {
  conversations: TConversation[] | null;
}

export default function AppWrap({ children }: { children: React.ReactNode }) {
  const [appState, setAppState] = useState<IApp>({
    conversations: null,
  });

  const updateConversations = useCallback((response: TConversation[]) => {
    setAppState((prevState) => ({
      ...prevState,
      conversations: response,
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      appState,
      updateConversations,
    }),
    [appState, updateConversations]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
