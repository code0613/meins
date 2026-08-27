import { ACCEPTED_MIME_TYPES } from '../constants';

import type { LoadedImage } from '../types';

export function isAcceptedImage(file: File) {
  return (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type);
}

function stripExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex <= 0) {
    return fileName;
  }
  return fileName.slice(0, dotIndex);
}

export function loadImageFile(file: File): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    if (!isAcceptedImage(file)) {
      reject(new Error('UNSUPPORTED_FILE_TYPE'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const element = new Image();

    element.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        element,
        width: element.naturalWidth,
        height: element.naturalHeight,
        baseName: stripExtension(file.name),
        mimeType: file.type,
      });
    };

    element.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('IMAGE_DECODE_FAILED'));
    };

    element.src = objectUrl;
  });
}

export function pickImageFile(fileList: FileList | null) {
  if (!fileList || fileList.length === 0) {
    return null;
  }
  return Array.from(fileList).find(isAcceptedImage) ?? null;
}
