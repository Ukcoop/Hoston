interface initialContextMenu {
    show: Boolean,
    menu: any,
    x: number,
    y: number,
};

interface IMtype {
    activeFolders: any;
    setActiveFolders: Function;
    forceReload: Boolean;
    forceReloadToggle: Function;
    contextMenu: initialContextMenu;
    setContextMenu: Function;
    movingFile: Boolean;
    setMovingFile: Function;
    renameingFile: String;
    setRenamingFile: Function;
    movingFolder: Boolean;
    setMovingFolder: Function;
    rightClicked: string[];
    setRightClicked: Function;
    pendingDeletion: string[];
    setDeletion: Function;
}

export default class IM {
    activeFolders: any;
    setActiveFolders: Function;
    forceReload: Boolean;
    forceReloadToggle: Function;
    contextMenu: initialContextMenu;
    initialContextMenu: any;
    setContextMenu: Function;
    movingFile: Boolean;
    setMovingFile: Function;
    renameingFile: String;
    setRenamingFile: Function;
    movingFolder: Boolean;
    setMovingFolder: Function;
    rightClicked: string[];
    setRightClicked: Function;
    pendingDeletion: string[];
    setDeletion: Function;

    constructor(IMhooks: IMtype, initialContextMenu: any) {
        this.activeFolders = IMhooks.activeFolders;
        this.setActiveFolders = IMhooks.setActiveFolders;
        this.forceReload = IMhooks.forceReload;
        this.forceReloadToggle = IMhooks.forceReloadToggle;
        this.contextMenu = IMhooks.contextMenu;
        this.initialContextMenu = initialContextMenu;
        this.setContextMenu = IMhooks.setContextMenu;
        this.movingFile = IMhooks.movingFile;
        this.setMovingFile = IMhooks.setMovingFile;
        this.renameingFile = IMhooks.renameingFile;
        this.setRenamingFile = IMhooks.setRenamingFile;
        this.movingFolder = IMhooks.movingFolder;
        this.setMovingFolder = IMhooks.setMovingFolder;
        this.rightClicked = IMhooks.rightClicked;
        this.setRightClicked = IMhooks.setRightClicked;
        this.pendingDeletion = IMhooks.pendingDeletion;
        this.setDeletion = IMhooks.setDeletion;
    }

    handleRightClick(e: any) {
        let tmp = [e.fullPath, e.type];
        let tmp2 = this.rightClicked;
        if (tmp[1] == 'folder' && !this.movingFolder) {
            tmp2[0] = tmp[0];
        } else if (tmp[1] == 'folder' && this.movingFolder) {
            tmp2[2] = tmp[0];
        } else if (!this.movingFile) {
            tmp2[1] = tmp[0];
        }
        this.setRightClicked(tmp2);
    };

    handleContextMenu(e: any) {
        e.event.preventDefault();
        const { pageX, pageY } = e.event;
        this.setContextMenu({ show: true, menu: e.menu, x: pageX, y: pageY });
        this.handleRightClick(e);
    };

    deletingFile(path: string) {
        let deleting = this.pendingDeletion;
        deleting[0] = path;
        this.setDeletion(deleting);
    }

    deletingFolder(path: string) {
        let deleting = this.pendingDeletion;
        deleting[1] = path;
        this.setDeletion(deleting);
    }
}