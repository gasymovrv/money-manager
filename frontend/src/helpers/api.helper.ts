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
  const rawFileName = contentDisposition.split('filename=')[1];
  if (!rawFileName || rawFileName === '') {
    return defaultName;
  }

  return rawFileName.replaceAll('"', '');
}

export function handleErrors(response: Response) {
  if (!response.ok) {
    throw response;
  }
  return response;
}