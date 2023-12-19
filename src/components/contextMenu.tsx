import { useClickAway } from '@uidotdev/usehooks';
import '../webEditor/index.css';

interface contextMenuType {
    x: any;
    y: any;
    menu: any;
    closeContextMenu: Function;
}

export default function ContextMenu({
    x,
    y,
    menu,
    closeContextMenu,
}: contextMenuType) {
    const ref: any = useClickAway(() => {
        closeContextMenu();
    });

    return (
        <div
            ref={ref}
            style={{
                position: 'absolute',
                padding: '8px',
                backgroundColor: 'var(--fsDeselected)',
                borderRadius: '5px',
                boxShadow: '10px',
                zIndex: '5',
                top: `${y}px`,
                left: `${x}px`,
            }}
        >
            {menu}
        </div>
    );
}
