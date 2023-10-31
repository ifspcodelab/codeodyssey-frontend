import { Box, Button, Divider, Icon, Paper, useTheme } from "@mui/material"

import React from "react";

interface IToolDetails {
  textNewButton?: string,
  showNewButton?: boolean,
  showBackButton?: boolean,
  showDeleteButton?: boolean,
  showSaveButton?: boolean,
  showSaveAndLeaveButton?: boolean,

  onClickNew?: () => void;
  onClickBack?: () => void;
  onClickDelete?: () => void;
  onClickSave?: () => void;
  onClickSaveLeave?: () => void;
}

export const ToolDetails: React.FC<IToolDetails> = ({
  textNewButton = 'Novo',

  showNewButton = true,
  showBackButton = true,
  showDeleteButton = true,
  showSaveButton = true,
  showSaveAndLeaveButton = false,

  onClickNew,
  onClickBack,
  onClickDelete,
  onClickSave,
  onClickSaveLeave
}) => {

  const theme = useTheme()


  return (
    <Box height={theme.spacing(5)} marginX={1} padding={1} paddingX={2} display="flex" gap={1} alignItems="center" component={Paper} >
      {showSaveButton && (<Button
        variant="contained"
        color="primary"
        disableElevation
        onClick={onClickSave}
        startIcon={<Icon>save</Icon>}
      >Salvar</Button>)}
      {showSaveAndLeaveButton && (<Button
        variant="outlined"
        color="primary"
        disableElevation
        onClick={onClickSaveLeave}
        startIcon={<Icon>save</Icon>}
      >Salvar e voltar</Button>)}
      {showDeleteButton && (<Button
        variant="outlined"
        color="primary"
        disableElevation
        onClick={onClickDelete}
        startIcon={<Icon>delete</Icon>}
      >Apagar</Button>)}
      {showNewButton && (<Button
        variant="outlined"
        color="primary"
        disableElevation
        onClick={onClickNew}
        startIcon={<Icon>add</Icon>}
      >{textNewButton}</Button>)}

      <Divider variant="middle" orientation="vertical" />

      {showBackButton && (<Button
        variant="outlined"
        color="primary"
        disableElevation
        onClick={onClickBack}
        startIcon={<Icon>arrow_back</Icon>}
      >Voltar</Button>)}

    </Box>
  )
}