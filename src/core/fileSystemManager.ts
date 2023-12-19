interface FShooks {
    fileSystem: any;
    updateFS: Function;
    activeFile: any;
    updateActiveFile: Function;
    forceRender: Function;
}

export default class FSM {
    newFileTemplate: Object;
    fileSystem: any;
    updateFS: Function;
    activeFile: any;
    updateActiveFile: Function;
    reset: Function;
    forceRender: Function;

    constructor(reset: Function, hooks: FShooks) {
        this.newFileTemplate = { untitled: { content: '' } };
        this.fileSystem = hooks.fileSystem;
        this.activeFile = hooks.activeFile;
        this.updateFS = hooks.updateFS;
        this.updateActiveFile = hooks.updateActiveFile;
        this.reset = reset;
        this.forceRender = hooks.forceRender;
    }

    resetFileSystem() {
        this.updateFS({ untitled: { content: '' } });
        this.updateActiveFile('untitled');
        localStorage.setItem('fs', JSON.stringify({ untitled: { content: '' } }));
        localStorage.setItem('activeFile', 'untitled');
    }

    getFilenamefromPath(path: string) {
        if (path !== undefined) {
            let tmp = path.split('/');
            if (tmp.length > 1) {
                return tmp[tmp.length - 1];
            } else {
                return tmp[0];
            }
        } else {
            return '';
        }
    };
    
    getSubFolder(path: string) {
        let tmp = path.split(path.split('/')[0])[1].split('/');
        return tmp.slice(1, tmp.length).join('/');
    };

    saveWorkspace() {
        localStorage.setItem(
            'fs',
            JSON.stringify(this.fileSystem)
        );
        localStorage.setItem('activeFile', this.activeFile);
    };

    handleRename(id: string) {
        let rename: any = document.getElementById(id);
        let test: any = this.fileSystem;
        if (rename.value !== this.activeFile) {
            let newName: any = this.activeFile.split('/');
            if (newName.length > 1) {
                newName[newName.length - 1] = rename.value;
                newName = newName.join('/');
            } else {
                newName = rename.value;
            }
            test[newName] =
                this.fileSystem[this.activeFile];
            delete test[this.activeFile];
            this.updateActiveFile(newName);
            this.updateFS(test);
        }
    };

    deleteFile(path: string) {
        let test: any = this.fileSystem;
        delete test[path];
        this.updateFS(test);
        if(Object.keys(this.fileSystem).length == 0) {
            this.resetFileSystem();
            return;
        }
        if(path == this.activeFile) {
           this.updateActiveFile(Object.keys(this.fileSystem)[0]);
        }
    }

    deleteFolder(folder: string) {
        let fs = this.fileSystem;
        let fsMap = Object.keys(fs);
        for (let i = 0; i < fsMap.length; i++) {
            if (fsMap[i].split(folder + '/').length > 1) {
                this.deleteFile(fsMap[i]);
            }
        }
    };

    folder(id: string, folder: string) {
        let rename: any = document.getElementById(id);
        let fs = this.fileSystem;
        let fsMap = Object.keys(fs);
        for (let i = 0; i < fsMap.length; i++) {
            if (fsMap[i].split(folder + '/').length > 1) {
                let newFolder: any = folder.split('/');
                newFolder[folder.split('/').length - 1] = rename.value;
                newFolder = newFolder.join('/');
                this.moveFile(newFolder, fsMap[i]);
            }
        }
    };

    getFilenameFromPath(path: string) {
        if (path !== undefined) {
            let tmp = path.split('/');
            if (tmp.length > 1) {
                return tmp[tmp.length - 1];
            } else {
                return tmp[0];
            }
        } else {
            return '';
        }
    };

    getFolder(path: string) {
        let tmp = path.split('/');
        if (tmp.length == 1) return '';
        return tmp.slice(0, tmp.length - 1).join('/');
    };

    createNewFile(folder: string) {
        let newFS = { ...this.fileSystem, ...this.newFileTemplate };
        newFS[folder + '/untitled'] = newFS['untitled'];
        delete newFS['untitled'];
        this.updateActiveFile(folder + '/untitled');
        this.updateFS(newFS);
    };

    slectFile(fileName: string) {
        this.updateActiveFile(fileName);
        localStorage.setItem('this.activeFile', fileName);
        this.reset();
    };

    moveFile(folder: string, file: string) {
        let newLocation =
            folder + '/' + file.split('/')[file.split('/').length - 1];
        let fs = this.fileSystem;
        fs[newLocation] = fs[file];
        delete fs[file];
        if (file == this.activeFile) {
            this.updateActiveFile(newLocation);
        }
        this.updateFS(fs);
    };

    moveFolder(folderFrom: string, folderTo: string) {
        let fs = this.fileSystem;
        let fsMap = Object.keys(fs);
        for (let i = 0; i < fsMap.length; i++) {
            if (fsMap[i].split(folderFrom + '/').length > 1) {
                let newFolder =
                    folderTo +
                    '/' +
                    folderFrom.split('/')[folderFrom.split('/').length - 1];
                this.moveFile(newFolder, fsMap[i]);
            }
        }
    };

    renameFolder(id: string, folderFrom: string) {
        let fs = this.fileSystem;
        let rename: any = document.getElementById(id);
        let fsMap = Object.keys(fs);
        for (let i = 0; i < fsMap.length; i++) {
            if (fsMap[i].split(folderFrom + '/').length > 1) {
                let newFolder: any = this.getFolder(fsMap[i]).split("/");
                newFolder[folderFrom.split("/").length - 1] = rename.value;
                newFolder = newFolder.join("/");
                this.moveFile(newFolder, fsMap[i]);
            }
        }
    };
}