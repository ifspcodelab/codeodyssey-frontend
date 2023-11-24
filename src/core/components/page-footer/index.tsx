interface PageFooterProps {
    text: string;
}
function PageFooter({ text }: PageFooterProps) {
    return (
        <footer>
            <p>{text}</p>
            <p>© {new Date().getFullYear()}</p>
        </footer>
    );
}

export default PageFooter