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

/**
 * 파일을 화면에 그릴 수 있는 이미지로 바꾼다.
 * FileReader로 base64를 만들지 않고 objectURL을 쓰므로 큰 사진에서도 메모리를 덜 먹는다.
 */
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

/** 드롭된 항목 중 처음 만나는 이미지 파일 하나만 쓴다 */
export function pickImageFile(fileList: FileList | null) {
  if (!fileList || fileList.length === 0) {
    return null;
  }
  return Array.from(fileList).find(isAcceptedImage) ?? null;
}
