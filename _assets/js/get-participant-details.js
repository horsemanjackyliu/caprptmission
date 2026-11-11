async function getWorkshopData(){
    var path = "/api/odata/v4/participant/getParticipantInfo(workshopId='";
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function safeDecodeJwtPayload(token) {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      // Pad base64 string if necessary
      const pad = payload.length % 4;
      const padded = pad ? payload + '='.repeat(4 - pad) : payload;
      const json = decodeURIComponent(atob(padded).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  let workshopId = null;
  const jwt = getCookie('jwt-token');
  if (jwt) {
    const payload = safeDecodeJwtPayload(jwt);
    if (payload && payload.workshopId) {
      // Accept either full or short form; if it contains a dash + 8 chars, extract last 8
      workshopId = String(payload.workshopId);
    }
  }

  if (!workshopId) {
    // fallback to extracting from URL like before, but simpler; if that fails use zeros
    try {
      const regex = new RegExp(`${window.$docsify.code}-?([a-zA-Z0-9]{8})?`);
      const workshopShortId = document.documentURI.split('/')[3].match(regex)
      workshopId = (workshopShortId && workshopShortId[1]) ? workshopShortId[1] : '00000000';
    } catch (e) {
      workshopId = '00000000';
    }
  }

  path += workshopId + "')";

    // Get participant details
    const response = await fetch(path);
    const data = await response.json();

    return data;
}