import { SLATE } from '@meins/styles';
import { styled } from '@mui/material';
import { MaterialDesignContent, SnackbarProvider as NotistackSnackbarProvider, type SnackbarProviderProps } from 'notistack';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(({ theme }) => ({
  boxShadow: theme.shadows[8],

  '&.notistack-MuiContent': {
    ...theme.typography.subtitle3,

    minWidth: 280,
    padding: '10px 16px',
    borderRadius: 10,

    color: theme.palette.text.primary,
    backgroundColor: SLATE[100],

    '&-error svg': {
      color: theme.palette.error.main,
      marginRight: 8,
    },
    '&-success svg': {
      color: theme.palette.success.main,
      marginRight: 8,
    },
  },
}));

export function SnackbarProvider({ children, ...props }: SnackbarProviderProps) {
  return (
    <NotistackSnackbarProvider
      maxSnack={3}
      autoHideDuration={2500}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      Components={{
        default: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
        success: StyledMaterialDesignContent,
        warning: StyledMaterialDesignContent,
        info: StyledMaterialDesignContent,
      }}
      {...props}
    >
      {children}
    </NotistackSnackbarProvider>
  );
}
