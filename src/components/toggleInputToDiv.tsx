import '../webEditor/index.css';

import FSM from '../core/fileSystemManager';

export default function ToggleInputToDiv({
    isActive,
    text,
    toggle,
    fileSystemManager,
}: {
    isActive: Boolean;
    text: String;
    toggle: any;
    fileSystemManager: FSM;
}) {
    const witchComponent = isActive ? (
        <form
            style={{ display: 'flex', flexDirection: 'row' }}
            onSubmit={() => {
                toggle();
                fileSystemManager.handleRename('renameInput', 'file');
            }}
        >
            <input
                id="renameInput"
                style={{
                    fontSize: '18px',
                    marginTop: '8px',
                    marginLeft: '3px',
                    width: '25vw',
                }}
                placeholder={`${text}`}
            ></input>
        </form>
    ) : (
        <div
            className="label"
            style={{
                overflow: 'scroll',
                margin: '3px',
                width: '25vw',
                minHeight: '35px',
            }}
            onClick={toggle}
        >
            <a style={{ marginLeft: '3px', fontSize: '18px' }}>{text}</a>
        </div>
    );
    return witchComponent;
}
