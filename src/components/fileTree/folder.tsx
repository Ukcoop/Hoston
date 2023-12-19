/** @format */

import File from './file';
import '../../webEditor/index.css';

import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';

import FSM from '../../core/fileSystemManager';
import IM from '../../core/interactionsManager';

interface folderType {
	name: string;
	children: any;
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

export default function Folder(
	input: folderType,
	fileSystemManager: FSM,
	interactionsManager: IM,
	fileTreeManager: any
) {
	const folderActive =
		interactionsManager.activeFolders[
			fileSystemManager.getFolder(input.children.fromRoot[0])
		] !== undefined;
	const folderToggle =
		fileSystemManager.activeFile.split(fileSystemManager.getFolder(input.children.fromRoot[0]))
			.length > 1 || folderActive;
	const muiStyle = folderToggle ? muiActive : muiInactive;

	let indents: any = [];

	for (let i = 0; i < input.children.indents - 1; i++) {
		indents.push(<div style={{ minWidth: '2vw' }}></div>);
	}

	const fullFolderPath = (name: string) => {
		return input.children.fromRoot[0].split(name)[0] + fileSystemManager.getFolder(name);
	};

	return [
		<div
			onContextMenu={e => {
				let tmpA = fullFolderPath(input.name);
				interactionsManager.handleContextMenu({
					event: e,
					fullPath: tmpA,
					type: 'folder',
					menu: fileTreeManager.globalFolCM,
				});
			}}
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'flex-start',
			}}
		>
			{indents}
			<div
				className="label"
				onClick={() => {
					if (
						interactionsManager.activeFolders[
							fileSystemManager.getFolder(input.children.fromRoot[0])
						] == undefined
					) {
						interactionsManager.activeFolders[
							fileSystemManager.getFolder(input.children.fromRoot[0])
						] = true;
						interactionsManager.forceReloadToggle(!interactionsManager.forceReload);
					} else {
						delete interactionsManager.activeFolders[
							fileSystemManager.getFolder(input.children.fromRoot[0])
						];
						interactionsManager.forceReloadToggle(!interactionsManager.forceReload);
					}
				}}
				style={folderToggle ? active : inactive}
			>
				<>
					{[
						<FolderOutlinedIcon style={muiStyle} />,
						<>
							{fileSystemManager.getFolder(input.children.fromRoot[0]) ==
							interactionsManager.renameingFile ? (
								<form
									style={
										interactionsManager.activeFolders[
											fileSystemManager.getFolder(input.children.fromRoot[0])
										]
											? {
													backgroundColor: 'var(--fsSelected)',
											  }
											: {
													backgroundColor: 'var(--fsDeselected)',
											  }
									}
									onSubmit={() => {
										fileSystemManager.renameFolder(
											'fileTreeRenameInput',
											fileSystemManager.getFolder(input.children.fromRoot[0])
										);
										console.log('rename');
										interactionsManager.setRenamingFile('');
									}}
								>
									<input
										style={
											interactionsManager.activeFolders[
												fileSystemManager.getFolder(
													input.children.fromRoot[0]
												)
											]
												? {
														backgroundColor: 'var(--fsSelected)',
												  }
												: {
														backgroundColor: 'var(--fsDeselected)',
												  }
										}
										id="fileTreeRenameInput"
									></input>
								</form>
							) : (
								<>{input.name.split('/')[0]}</>
							)}
						</>,
						<div />,
					]}
				</>
			</div>
		</div>,
		<>
			{folderActive &&
				File(input.children, fileSystemManager, interactionsManager, fileTreeManager)}
		</>,
	];
}
