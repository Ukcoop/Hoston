import '../webEditor/index.css';

// interface input {}

export default function Button({
    isActive,
    text,
    click,
}: {
    isActive: Boolean;
    text: String;
    click: any;
}) {
    const buttonClass = isActive ? 'buttonActive' : 'buttonInactive';
    return (
        <button className={buttonClass} onClick={click}>
            {text}
        </button>
    );
}
