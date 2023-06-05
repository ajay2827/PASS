// React Imports
import React, { useEffect, useMemo, useState } from 'react';
// Inrupt Imports
import { getPodUrlAll } from '@inrupt/solid-client';
import { useSession } from '@inrupt/solid-ui-react';
// Utility Imports
import {
  createPublicContainer,
  createDocumentContainer,
  createOutbox,
  createInbox,
  getInboxMessageTTL
} from './utils';
import { updateUserActivity } from './model-helpers';
// Custom Hook Imports
import { useRedirectUrl } from './hooks';
// Context Imports
import { InboxMessageContext, SelectUserContext, UserListContextProvider } from './contexts';
// Component Imports
import Home from './routes/Home'
import Layout from './layouts/Layouts';
import AppRoutes from './AppRoutes';

/**
 * @typedef {import("./typedefs").userListObject} userListObject
 */

/**
 * @typedef {import("./typedefs").inboxListObject} inboxListObject
 */

const App = () => {
  const { session } = useSession();
  const redirectUrl = useRedirectUrl();
  const [restore, setRestore] = useState(false);

  // useEffect to restoring PASS if refreshed in browser
  useEffect(() => {
    const performanceEntries = window.performance.getEntriesByType('navigation');
    if (performanceEntries[0].type === 'reload' && performanceEntries.length === 1) {
      setRestore(true);
    }

    if (restore && localStorage.getItem('loggedIn')) {
      session.login({
        oidcIssuer: localStorage.getItem('oidcIssuer'),
        redirectUrl
      });
    }
  }, [restore]);

  const [selectedUser, setSelectedUser] = useState('');
  /** @type {userListObject[]} */
  const [loadMessages, setLoadMessages] = useState(true);

  const selectedUserObject = useMemo(() => ({ selectedUser, setSelectedUser }), [selectedUser]);

  /** @type {inboxListObject[]} */
  const initialInboxList = [];
  const [inboxList, setInboxList] = useState(initialInboxList);
  const inboxMessageObject = useMemo(() => ({ inboxList, setInboxList }), [inboxList]);

  useEffect(() => {
    /**
     * A function that sets up a user's Pod if logging in for the first time or
     * if containers are deleted and initializes user data from Solid Pod
     *
     * @function setupPod
     */
    async function setupPod() {
      let podUrl = (await getPodUrlAll(session.info.webId, { fetch: session.fetch }))[0];
      podUrl = podUrl || session.info.webId.split('profile')[0];

      await updateUserActivity(session, podUrl);
      await createDocumentContainer(session, podUrl);
      await createPublicContainer(session, podUrl);
      await createInbox(session, podUrl);
      await createOutbox(session, podUrl);

      const messagesInSolid = await getInboxMessageTTL(session, inboxList);
      messagesInSolid.sort((a, b) => b.uploadDate - a.uploadDate);
      setInboxList(messagesInSolid);
      setLoadMessages(false);
    }

    if (session.info.isLoggedIn) {
      localStorage.setItem('loggedIn', true);
      setupPod();
    }
  }, [session.info.isLoggedIn]);

  return session.info.isLoggedIn ? 
    <Layout>
      <SelectUserContext.Provider value={selectedUserObject}>
        <UserListContextProvider session={session}>
          <InboxMessageContext.Provider value={inboxMessageObject}>
            <AppRoutes
              loadingActive={false}
              loadMessages={loadMessages}
            />
          </InboxMessageContext.Provider>
        </UserListContextProvider>
      </SelectUserContext.Provider>
    </Layout> : <Home/>
};

export default App;
