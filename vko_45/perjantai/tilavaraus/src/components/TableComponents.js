import { styled } from '@mui/material/styles';

export const Table = styled("div")(({ theme }) => ({
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    fontFamily: theme.typography.fontFamily,    
    borderRadius: theme.shape.borderRadius,
    maxHeight: 440,
    overflowY: "scroll"
}));

export const TableHead = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}))

export const TableBody = styled("div")(({ theme }) => ({
    
}))

export const TableRow = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    padding: "10px"
}))

export const TableCell = styled('div')(({ theme }) => ({
    flex: 1,
    textAlign: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),    
    lineHeight: 3
}));