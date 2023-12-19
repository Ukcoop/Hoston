/** @format */

import { useState } from 'react';
import '../../webEditor/index.css';
import ToggleButton from '../toggleableButton';
import ContextMenu from '../contextMenu';
import File from './file';

import IM from '../../core/interactionsManager';

class FTM {
	globalFCM: any;
	globalFolCM: any;

	setFCM(FCM: any) {
		this.globalFCM = FCM;
	}

	setFolCM(FolCM: any) {
		this.globalFolCM = FolCM;
	}
}

let fileTreeManager = new FTM();

const initialContextMenu = {
	show: false,
	menu: fileTreeManager.globalFCM,
	x: 0,
	y: 0,
};

export default function FileTree({ fileSystemManager }: { fileSystemManager: any }) {
	let fileSystemMap = Object.keys(fileSystemManager.fileSystem).sort();

	const [activeFolders, setActiveFolders] = useState({});
	const [forceReload, forceReloadToggle] = useState(true);
	const [contextMenu, setContextMenu] = useState(initialContextMenu);
	const [movingFile, setMovingFile] = useState(false);
	const [renameingFile, setRenamingFile] = useState('');
	const [movingFolder, setMovingFolder] = useState(false);
	const [rightClicked, setRightClicked] = useState(['', '', '']);
	const [pendingDeletion, setDeletion] = useState(['', '']);

	const IMhooks = {
		activeFolders: activeFolders,
		setActiveFolders: setActiveFolders,
		forceReload: forceReload,
		forceReloadToggle: forceReloadToggle,
		contextMenu: contextMenu,
		setContextMenu: setContextMenu,
		movingFile: movingFile,
		setMovingFile: setMovingFile,
		renameingFile: renameingFile,
		setRenamingFile: setRenamingFile,
		movingFolder: movingFolder,
		setMovingFolder: setMovingFolder,
		rightClicked: rightClicked,
		setRightClicked: setRightClicked,
		pendingDeletion: pendingDeletion,
		setDeletion: setDeletion,
	};

	let interactionsManager = new IM(IMhooks, initialContextMenu);

	const fileContextMenu = (
		<>
			{!movingFile && !movingFolder && (
				<div
					style={{
						backgroundColor: 'var(--fsDeselected)',
					}}
					onClick={() => {
						interactionsManager.setMovingFile(true);
						interactionsManager.setContextMenu(initialContextMenu);
					}}
				>
					move
				</div>
			)}

			<div
				style={{
					backgroundColor: 'var(--fsDeselected)',
				}}
				onClick={() => {
					interactionsManager.setRenamingFile(interactionsManager.rightClicked[1]);
					interactionsManager.setContextMenu(initialContextMenu);
				}}
			>
				rename
			</div>

			{interactionsManager.pendingDeletion[0] == '' && (
				<div
					style={{
						backgroundColor: 'var(--fsDeselected)',
					}}
					onClick={() => {
						interactionsManager.deletingFile(interactionsManager.rightClicked[1]);
						interactionsManager.setContextMenu(initialContextMenu);
					}}
				>
					delete file
				</div>
			)}

			{interactionsManager.pendingDeletion[0] !== '' && (
				<div
					style={{
						backgroundColor: 'var(--fsDeselected)',
					}}
					onClick={() => {
						fileSystemManager.deleteFile(interactionsManager.pendingDeletion[0]);
						interactionsManager.setDeletion(['', '']);
						interactionsManager.setContextMenu(initialContextMenu);
					}}
				>
					confirm deletion
				</div>
			)}

			{interactionsManager.pendingDeletion[0] !== '' && (
				<div
					style={{
						backgroundColor: 'var(--fsDeselected)',
					}}
					onClick={() => {
						interactionsManager.setDeletion(['', '']);
						interactionsManager.setContextMenu(initialContextMenu);
					}}
				>
					cancel deletion
				</div>
			)}
		</>
	);

	const folderContextMenu = (
		<>
			{!movingFolder && (
				<div
					style={{
						backgroundColor: 'var(--fsDeselected)',
					}}
					onClick={() => {
						interactionsManager.setMovingFolder(true);
						interactionsManager.setContextMenu(initialContextMenu);
					}}
				>
					move
				</div>
			)}
			{movingFile && (
				<div
					style={{
						backgroundColor: 'var(--fsDeselected)',
					}}
					onClick={() => {
						let inputs = rightClicked;
						fileSystemManager.moveFile(inputs[0], inputs[1]);
						setRightClicked(['', '', '']);
						interactionsManager.setMovingFile(false);
						interactionsManager.setContextMenu(initialContextMenu);
					}}
				>
					move file here
				</div>
			)}
			{movingFolder && (
				<div
					style={{
						backgroundColor: 'var(--fsDeselected)',
					}}
					onClick={() => {
						let inputs = rightClicked;
						fileSystemManager.moveFolder(inputs[0], inputs[2]);
						interactionsManager.setMovingFolder(false);
						setRightClicked(['', '', '']);
						interactionsManager.setContextMenu(initialContextMenu);
					}}
				>
					move folder here
				</div>
			)}

			<div
				style={{
					backgroundColor: 'var(--fsDeselected)',
				}}
				onClick={() => {
					fileSystemManager.createNewFile(interactionsManager.rightClicked[0]);
				}}
			>
				newFile
			</div>

			<div
				style={{
					backgroundColor: 'var(--fsDeselected)',
				}}
				onClick={() => {
					interactionsManager.setRenamingFile(interactionsManager.rightClicked[0]);
					console.log(interactionsManager.rightClicked[0]);
				}}
			>
				rename
			</div>

			<div
				style={{
					backgroundColor: 'var(--fsDeselected)',
				}}
				onClick={() => {
					interactionsManager.deletingFolder(interactionsManager.rightClicked[0]);
					interactionsManager.setContextMenu(initialContextMenu);
				}}
			>
				delete folder
			</div>

			{interactionsManager.pendingDeletion[1] !== '' && (
				<div
					style={{
						backgroundColor: 'var(--fsDeselected)',
					}}
					onClick={() => {
						fileSystemManager.deleteFolder(interactionsManager.pendingDeletion[1]);
						interactionsManager.setDeletion(['', '']);
						interactionsManager.setContextMenu(initialContextMenu);
					}}
				>
					confirm deletion
				</div>
			)}

			{interactionsManager.pendingDeletion[1] !== '' && (
				<div
					style={{
						backgroundColor: 'var(--fsDeselected)',
					}}
					onClick={() => {
						interactionsManager.setDeletion(['', '']);
						interactionsManager.setContextMenu(initialContextMenu);
					}}
				>
					cancel deletion
				</div>
			)}
		</>
	);

	fileTreeManager.setFCM(fileContextMenu);
	fileTreeManager.setFolCM(folderContextMenu);

	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					minWidth: 'auto',
					borderStyle: 'solid',
					borderTop: '0px',
					borderLeft: '0px',
				}}
			>
				<div
					style={{
						borderStyle: 'solid',
						borderRight: '0px',
						borderLeft: '0px',
						borderTop: '0px',
						borderColor: 'var(--accent)',
						width: '100%',
					}}
				>
					<ToggleButton
						isActive={false}
						text={'new'}
						click={() => {
							fileSystemManager.createNewFile(
								fileSystemManager.getFolder(fileSystemManager.activeFile)
							);
						}}
					/>
					<ToggleButton
						isActive={false}
						text={'save'}
						click={() => {
							fileSystemManager.saveWorkspace();
						}}
					/>
				</div>
				<div style={{ overflow: 'scroll', height: '100%' }}>
					{File(
						{
							fileSystemMap: fileSystemMap,
							fromRoot: fileSystemMap,
							handleContextMenu: interactionsManager.handleContextMenu,
							indents: 0,
						},
						fileSystemManager,
						interactionsManager,
						fileTreeManager
					)}
				</div>
			</div>
			{contextMenu.show && (
				<ContextMenu
					x={contextMenu.x}
					y={contextMenu.y}
					menu={contextMenu.menu}
					closeContextMenu={() => {
						interactionsManager.setContextMenu(initialContextMenu);
					}}
				/>
			)}
		</>
	);
}
