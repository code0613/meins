import { useCallback, useState } from 'react';

import { useSnackbar } from 'notistack';

import { ACCEPTED_EXTENSION_TEXT, LARGE_IMAGE_PIXELS } from '../constants';
import { loadImageFile, pickImageFile } from '../utils/file';

import type { LoadedImage } from '../types';

export function useImageLoader() {
  const { enqueueSnackbar } = useSnackbar();
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      try {
        const loaded = await loadImageFile(file);

        if (loaded.width * loaded.height > LARGE_IMAGE_PIXELS) {
          enqueueSnackbar('사진이 매우 커서 편집이 느릴 수 있어요.', { variant: 'warning' });
        }

        setImage(loaded);
      } catch {
        enqueueSnackbar(`${ACCEPTED_EXTENSION_TEXT} 형식의 이미지만 열 수 있어요.`, { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [enqueueSnackbar],
  );

  const loadFromList = useCallback(
    (fileList: FileList | null) => {
      const file = pickImageFile(fileList);
      if (!file) {
        enqueueSnackbar(`${ACCEPTED_EXTENSION_TEXT} 형식의 이미지만 열 수 있어요.`, { variant: 'error' });
        return;
      }
      loadFile(file);
    },
    [enqueueSnackbar, loadFile],
  );

  const clear = useCallback(() => {
    setImage(null);
  }, []);

  return { image, isLoading, loadFromList, clear };
}
