import React, { useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { useField, useStatusNotification } from '../../hooks';
import DocumentSelection from './DocumentSelection';
import { runNotification, updateDocument, uploadDocument } from '../../utils';
import FormSection from './FormSection';
import { SelectUserContext } from '../../contexts';
import { makeHandleFormSubmission } from './formSubmissionHelper'; 
import UPLOAD_TYPES from '../../constants/upload-types';


/**
 * CrossPodWriteForm Component - Component that generates the form for cross pod
 * uploading for a specific document to another user's Solid Pod via Solid Session
 *
 * @memberof Forms
 * @name CrossPodWriteForm
 */

const CrossPodWriteForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { clearValue: clearUsername, ...username } = useField('text');
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);

  // Initalized state for file upload
  const handleFileChange = (event) => {
    if (event.target.files.length === 1) {
      dispatch({ type: 'SET_FILE', payload: event.target.files[0] });
    } else {
      dispatch({ type: 'CLEAR_FILE' });
    }
  };

  // Custom useField hook for handling form inputs
  const { clearValue: clearDescription, _type, ...description } = useField('textarea');

  const clearInputFields = (event) => {
    event.target.uploadDoctype.value = '';
    event.target.date.value = '';
    clearDescription();
    clearUsername();
    setSelectedUser('');
    dispatch({ type: 'CLEAR_FILE' });
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for form/document submission to Pod

  const handleFormSubmit = makeHandleFormSubmission(UPLOAD_TYPES.CROSS, state, dispatch, session, clearInputFields)
  const handleCrossPodUpload = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
  
    let podUsername = event.target.crossPodUpload.value || selectedUser;
    if (!podUsername) {
      runNotification('Search failed. Reason: Username not provided.', 5, state, dispatch);
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PROCESSING' });
      }, 3000);
      return;
    }

    handleFormSubmit(event);
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <FormSection
      title="Cross Pod Document Upload"
      state={state}
      statusType="Upload status"
      defaultMessage="To be uploaded..."
    >
      <form onSubmit={handleCrossPodUpload} autoComplete="off">
        <div style={formRowStyle}>
          <label htmlFor="cross-upload-doc">Search document from username: </label>
          <br />
          <br />
          <input
            id="cross-upload-doc"
            size="60"
            name="crossPodUpload"
            {...username}
            placeholder={selectedUser}
          />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doc">Select document type to upload: </label>
          <DocumentSelection htmlId="upload-doc" />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doc-expiration">Expiration date (if applicable): </label>
          <input id="upload-doc-expiration" name="date" type="date" />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doc-desc">Enter description: </label>
          <br />
          <br />
          <textarea id="upload-doc-desc" name="description" {...description} />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="upload-doctype">File to upload: </label>
          <input
            id="upload-doctype"
            type="file"
            name="uploadDoctype"
            accept=".pdf, .docx, .doc, .txt, .rtf"
            onChange={handleFileChange}
          />
          <button disabled={state.processing} type="submit">
            Upload file
          </button>
        </div>
      </form>
    </FormSection>
  );
};

export default CrossPodWriteForm;
