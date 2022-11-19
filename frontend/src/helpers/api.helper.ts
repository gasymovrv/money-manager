import { ACCESS_TOKEN } from '../constants';

export function downloadFile(blob: Blob, fileName: string) {
  const href = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
}

export function getFileName(response: Response, defaultName: string = 'unknown-file') {
  const contentDisposition = response.headers.get('Content-Disposition');
  if (!contentDisposition) {
    return defaultName;
  }

  const utf8FilenameRegex: RegExp = /filename\*=UTF-8''([\w%\-\.]+)(?:; ?|$)/i;
  const asciiFilenameRegex = /^filename=(["']?)(.*?[^\\])\1(?:; ?|$)/i;

  let fileName: string = defaultName;
  if (utf8FilenameRegex.test(contentDisposition)) {
    const found = utf8FilenameRegex.exec(contentDisposition)
    if (!found) {
      return fileName
    }
    fileName = decodeURIComponent(found[1]);
  } else {
    // prevent ReDos attacks by anchoring the ascii regex to string start and
    //  slicing off everything before 'filename='
    const filenameStart = contentDisposition.toLowerCase().indexOf('filename=');
    if (filenameStart >= 0) {
      const partialDisposition = contentDisposition.slice(filenameStart);
      const matches = asciiFilenameRegex.exec(partialDisposition);
      if (matches != null && matches[2]) {
        fileName = matches[2];
      }
    }
  }
  return fileName;
}

export function handleErrors(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN);
    }
    throw response;
  }
  return response;
}

export function buildHeadersJson(): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json;charset=UTF-8'
  });
  setToken(headers);
  return headers;
}

export function buildHeaders(): Headers {
  const headers = new Headers();
  setToken(headers);
  return headers;
}

function setToken(headers: Headers) {
  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN));
  }
}
