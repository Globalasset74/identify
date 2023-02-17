import { IdentitySnapParams } from '../../interfaces';
import {
  getGoogleVCs,
  GOOGLE_DRIVE_VCS_FILE_NAME,
  uploadToGoogleDrive,
} from '../../utils/googleUtils';
import { snapConfirm } from '../../utils/snapUtils';
import { updateSnapState } from '../../utils/stateUtils';

/* eslint-disable */
export async function syncGoogleVCs(
  identitySnapParams: IdentitySnapParams
): Promise<boolean> {
  const { snap, state } = identitySnapParams;

  const currentVCs = state.accountState[state.currentAccount].vcs;
  const googleVCs = await getGoogleVCs(state, GOOGLE_DRIVE_VCS_FILE_NAME);

  if (!googleVCs) {
    throw new Error('Invalid vcs file');
  }

  const snapVCIds = Object.keys(currentVCs);
  const googleVCIds = Object.keys(googleVCs);
  const diffVCIds = googleVCIds.filter((id) => !snapVCIds.includes(id));

  const promptObj = {
    prompt: 'Sync VCs with Google Drive',
    description: `Would you like to sync VCs in snap with google drive?`,
    textAreaContent: JSON.stringify(diffVCIds),
  };
  if (await snapConfirm(snap, promptObj)) {
    state.accountState[state.currentAccount].vcs = {
      ...currentVCs,
      ...diffVCIds.reduce((acc, id) => ({ ...acc, [id]: googleVCs[id] }), {}),
    };
    await updateSnapState(snap, state);

    // Save to google drive
    const gdriveResponse = await uploadToGoogleDrive(state, {
      fileName: GOOGLE_DRIVE_VCS_FILE_NAME,
      content: JSON.stringify(state.accountState[state.currentAccount].vcs),
    });
    console.log({ gdriveResponse });

    return true;
  }
  throw new Error('User rejected');
}