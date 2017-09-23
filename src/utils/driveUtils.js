export function googleOauthSignIn(state) {
  const form = document.createElement('form');
  form.setAttribute('method', 'GET');
  form.setAttribute('action', 'https://accounts.google.com/o/oauth2/v2/auth');
  const params = {
    client_id: '742110692019-ms7ae3mdfvpv0oqa4g99ul2l0gcerb1u.apps.googleusercontent.com',
    redirect_uri: 'http://localhost:3000/auth/callback',
    response_type: 'token',
    scope: 'https://www.googleapis.com/auth/drive.appdata',
    state: encodeURIComponent(state.name),
  };
  params.forEach((value, key) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', key);
    input.setAttribute('value', value);
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

function getDriveUri(accessToken, path, args) {
  const qArgs = {...args, spaces: 'appDataFolder', access_token: accessToken};
  return ['https://www.googleapis.com/',path,getQueryString(qArgs)].join('');
}

function getQueryString(args) {
  const q = []
  args.forEach((value, key) => {
    q.push(key + '=' + encodeURIComponent(value));
  });
  return '?' + q.join('&')
}

export function parseAuthResponse(hash) {
  const response = {};
  hash.substring(1).split('&').forEach((p) => {
    const [key, value] = p.split('=');
    response[key] = decodeURIComponent(value);
  });
  return response;
}

export function listAppFiles(state) {
  const uri = getDriveUri(getAccessToken(), 'drive/v3/files');
  return fetch(uri).then(r => r.text()).then(body => JSON.parse(body).files);
}

function validateToken(token) {
  const uri = getDriveUri(token, 'oauth2/v3/tokeninfo');
  return fetch(uri).then(r => r.text()).then(body => {
    const res = JSON.parse(body);
    if (res.error || res.error_description) {
      return false;
    }
    return true;
  });
}

function getAccessToken() {
  if (window.localStorage === undefined) {
    return null;
  } else {
    return window.localStorage.getItem('auth/google');
  }
}

function setAccessToken(accessToken) {
  window.localStorage.setItem('auth/google', accessToken);
}

function saveState(state, firstTime) {
  const accessToken = getAccessToken();
  validateToken(accessToken).then((valid) => {
    if (valid) {
      if (firstTime) {
        saveStateToFileId(state, accessToken);
      } else {
        updateStateToFileId(state, accessToken);
      }
    }
  });
}

function updateStateToFileId(state, id) {
  const path = '/upload/drive/v3/files/' + id;
  const uri = getDriveUri(getAccessToken(), path, { uploadType: 'media' });
  const body = JSON.stringify(state);
  return fetch(uri, { method: 'PATCH', body });
}

function saveStateToFileId(state, id) {
  const path = 'upload/drive/v3/files'
  const uri = getDriveUri(getAccessToken(), path, { uploadType: 'multipart' });
  const body = new FormData();
  const args = {
    name: state.settings.tournamentName + '.json',
    parents: ['appDataFolder'],
    id,
  };
  const metadata = new Blob([ JSON.stringify(args) ], { type : 'application/json' });
  body.append('metadata', metadata);
  const data = new Blob([ JSON.stringify(state) ], { type : 'text/plain' });
  body.append('data', data);
  return fetch(uri, { method: 'POST', body });
}

export function generateSyncId() {
  const uri = getDriveUri(getAccessToken(), 'drive/v3/files/generateIds', {
    space: 'appDataFolder',
    count: 1,
  });
  return fetch(uri).then((r) => r.text()).then((body) => JSON.parse(body).ids[0]);
}

export default { generateSyncId, listAppFiles, parseAuthResponse, googleOauthSignIn, saveState, getAccessToken, setAccessToken };
