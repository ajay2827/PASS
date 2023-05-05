import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  UploadDocumentForm,
  FetchDocumentForm,
  DeleteDocumentForm,
  CrossPodQueryForm,
  CrossPodWriteForm,
  SetAclPermissionForm
} from './Form';
// import NavBar from './NavBar/NavBar';
import { Logout } from './Login';
import AppHeader from './AppHeader';
import { InactivityMessage } from './Notification';

/**
 * Forms Component - Component that generates Forms section for PASS
 *
 * @memberof GlobalComponents
 * @name Forms
 */

const Forms = () => {
  const location = useLocation();

  localStorage.setItem('restorePath', location.pathname);

  return (
    <>
      <AppHeader />
      <Logout />
      <UploadDocumentForm />
      <FetchDocumentForm />
      <DeleteDocumentForm />
      <SetAclPermissionForm />
      <CrossPodQueryForm />
      <CrossPodWriteForm />
      <InactivityMessage />
    </>
  );
};

export default Forms;
