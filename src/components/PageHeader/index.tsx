import {Typography} from "@mui/material";

interface PageHeaderProps {
    title: string;
    text: string;
}

function PageHeader({ title, text }: PageHeaderProps) {
    return (
        <header>
            <Typography variant="h2">{title}</Typography>
            <Typography variant="subtitle1" marginBottom="20px">{text}</Typography>
        </header>
    );
}

export default PageHeader