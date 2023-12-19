import Folder from './folder';
import '../../webEditor/index.css';

import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

import FSM from '../../core/fileSystemManager';
import IM from '../../core/interactionsManager';

interface fileType {
    fileSystemMap: string[];
    fromRoot: string[];
    handleContextMenu: Function;
    indents: number;
    // fileSystemManager: FSM;
    //interactionsManager: IM;
    // fileTreeManager: any;
}

const inactive = {
    display: 'flex',
    minWidth: '14.5vw',
    width: '14.5vw',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '6px',
    marginLeft: '5px',
    marginBottom: '0px',
    backgroundColor: 'var(--fsDeselected)',
    borderRadius: '5px',
};

const muiInactive = {
    backgroundColor: 'var(--fsDeselected)',
    paddingLeft: '5px',
};

const muiActive = {
    backgroundColor: 'var(--fsSelected)',
    paddingLeft: '5px',
};

const active = {
    display: 'flex',
    minWidth: '14.5vw',
    width: '14.5vw',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '6px',
    marginLeft: '5px',
    marginBottom: '0px',
    backgroundColor: 'var(--fsSelected)',
    borderRadius: '5px',
};

export default function File(
    input: fileType,
    fileSystemManager: FSM,
    interactionsManager: IM,
    fileTreeManager: any
) {
    let res: any = [];
    let index = 0;
    let indents: any = [];

    for (let i = 0; i < input.indents; i++) {
        indents.push(<div style={{ minWidth: '2vw' }}></div>);
    }

    while (index < input.fileSystemMap.length) {
        let name = input.fileSystemMap[index];
        let fullPath = input.fromRoot[index];
        const muiStyle =
            fileSystemManager.activeFile == fullPath ? muiActive : muiInactive;
        if (fileSystemManager.getFolder(name) == '') {
            let tmp = input.fromRoot[index];
            res.push(
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                    }}
                >
                    {indents}
                    <div
                        className="label"
                        onContextMenu={(e) => {
                            let tmpA = tmp;
                            interactionsManager.handleContextMenu({
                                event: e,
                                fullPath: tmpA,
                                type: 'file',
                                menu: fileTreeManager.globalFCM,
                            });
                        }}
                        onClick={() => {
                            fileSystemManager.slectFile(tmp);
                        }}
                        style={
                            fileSystemManager.activeFile == fullPath
                                ? active
                                : inactive
                        }
                    >
                        {
                            <>
                                {[
                                    <InsertDriveFileOutlinedIcon
                                        style={muiStyle}
                                    />,
                                    <>
                                        {tmp ==
                                        interactionsManager.renameingFile ? (
                                            <form
                                                style={
                                                    fileSystemManager.activeFile ==
                                                    fullPath
                                                        ? {
                                                              backgroundColor:
                                                                  'var(--fsSelected)',
                                                          }
                                                        : {
                                                              backgroundColor:
                                                                  'var(--fsDeselected)',
                                                          }
                                                }
                                                onSubmit={() => {
                                                    fileSystemManager.handleRename(
                                                        'fileTreeRenameInput',
                                                        'file'
                                                    );
                                                    interactionsManager.setRenamingFile(
                                                        ''
                                                    );
                                                }}
                                            >
                                                <input
                                                    style={
                                                        fileSystemManager.activeFile ==
                                                        fullPath
                                                            ? {
                                                                  backgroundColor:
                                                                      'var(--fsSelected)',
                                                              }
                                                            : {
                                                                  backgroundColor:
                                                                      'var(--fsDeselected)',
                                                              }
                                                    }
                                                    id="fileTreeRenameInput"
                                                ></input>
                                            </form>
                                        ) : (
                                            <>
                                                {fileSystemManager.getFilenamefromPath(
                                                    input.fromRoot[index]
                                                )}
                                            </>
                                        )}
                                    </>,
                                    <div />,
                                ]}
                            </>
                        }
                    </div>
                </div>
            );
            index++;
        } else {
            let subFolders: any = [];
            let origionalPath: any = [];
            let count = 0;
            for (let j = 0; j < input.fileSystemMap.length; j++) {
                if (
                    name.split('/')[0] == input.fileSystemMap[j].split('/')[0]
                ) {
                    count++;
                    subFolders.push(
                        fileSystemManager.getSubFolder(input.fileSystemMap[j])
                    );
                    origionalPath.push(input.fromRoot[j]);
                }
            }
            index += count;
            res.push(
                Folder(
                    {
                        name: name,
                        children: {
                            fileSystemMap: subFolders,
                            fromRoot: origionalPath,
                            handleContextMenu: input.handleContextMenu,
                            indents: input.indents + 1,
                        },
                    },
                    fileSystemManager,
                    interactionsManager,
                    fileTreeManager
                )
            );
        }
    }

    return res || <>loading...</>;
}
