import { Box, Button, Icon, Paper, TextField, useTheme } from '@mui/material';


interface IToolBar {
  textSearch?: string;
  showSearchInput?: boolean;
  onChangeTextSearch?: (newText: string) => void;
  textNewButton?: string;
  showNewButton?: boolean;
  onClickNewButton?: () => void;
}

export const ToolBar: React.FC<IToolBar> = ({
  textSearch = '',
  showSearchInput = false,
  onChangeTextSearch,
  textNewButton = 'Novo',
  showNewButton = true,
  onClickNewButton
}) => {
  const theme = useTheme()
  return (
    <Box
      gap={1}
      marginX={1}
      padding={1}
      paddingX={2}
      display="flex"
      alignItems="center"
      height={theme.spacing(5)}
      component={Paper}
    >
      {showSearchInput && (
        <TextField
          size="small"
          value={textSearch}
          placeholder="Pesquisar..."
          onChange={(e) => onChangeTextSearch?.(e.target.value)}
        />
      )}

      <Box flex={1} display="flex" justifyContent="end">
        {showNewButton && (
          <Button
            color='primary'
            disableElevation
            variant='contained'
            onClick={onClickNewButton}
            endIcon={<Icon>add</Icon>}
          >{textNewButton}</Button>
        )}
      </Box>
    </Box>
  );
};