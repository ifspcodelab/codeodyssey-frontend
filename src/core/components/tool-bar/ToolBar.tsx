import { Box, Button, Icon, Paper, TextField, useTheme } from "@mui/material"

interface IToolBar {
  textSearch?: string;
  showInputSearch?: boolean;
  changeTextSearch?: (newText: string) => void;
  textNewButton?: string;
  showNewButton?: boolean;
  onClickNewButton?: () => void;
}

export const ToolBar: React.FC<IToolBar> = ({
  textSearch = '',
  showInputSearch = false,
  changeTextSearch,
  textNewButton = 'Novo',
  showNewButton = true,
  onClickNewButton
}) => {
  const theme = useTheme()

  return (
    <Box height={theme.spacing(5)} marginX={1} padding={1} paddingX={2} display="flex" gap={1} alignItems="center" component={Paper} >
      {showInputSearch && (
        <TextField
          size="small"
          value={textSearch}
          onChange={(e) => changeTextSearch?.(e.target.value)}
          placeholder="Pesquisar..."
        />
      )}
      <Box flex={1} display="flex" justifyContent="end">
        {showNewButton && (<Button variant="contained" color="primary" disableElevation
          onClick={onClickNewButton} endIcon={<Icon>add</Icon>}>{textNewButton}</Button>)}
      </Box>
    </Box>
  )
}