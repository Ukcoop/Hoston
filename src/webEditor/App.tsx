/** @format */

import { useState } from 'react';

import FSM from '../core/fileSystemManager';

import Editor from '../components/editor';
import ToggleButton from '../components/toggleableButton';
import MDrenderer from '../components/mdRenderer';
import FileTree from '../components/fileTree';
import ToggleInputToDiv from '../components/toggleInputToDiv';

let fileSystemManager: FSM;
let fromLS: any = localStorage.getItem('fs');
let current = localStorage.getItem('activeFile');

// * this resets the localStorage if things go wrong.

// localStorage.setItem('fs', JSON.stringify({ untitled: { content: '' } }));
// localStorage.setItem('activeFile', 'untitled');

function App() {
	const [toggle, setToggle] = useState(true);
	const [, forceRender] = useState(true);
	const [seed, setSeed] = useState(1);
	const [mdRender, setRender] = useState(false);
	const [toggleRename, setRename] = useState(false);
	const [toggleFileTree, setFileTree] = useState(false);
	const [fileSystem, updateFS]: any = useState(JSON.parse(fromLS));
	const [activeFile, updateActiveFile]: any = useState(current);

	const FShooks = {
		fileSystem: fileSystem,
		updateFS: updateFS,
		activeFile: activeFile,
		updateActiveFile: updateActiveFile,
		forceRender: forceRender,
	};

	const reset = () => {
		setSeed(Math.random());
	};

	fileSystemManager = new FSM(reset, FShooks);

	// ? this shoud go into the fileSystemManager
	const handleTextChange = (event: any) => {
		let test: any = fileSystemManager.fileSystem;
		test[fileSystemManager.activeFile].content = event.target.value;
		test[fileSystemManager.activeFile] =
			fileSystemManager.fileSystem[fileSystemManager.activeFile];
		forceRender(prev => !prev);
		fileSystemManager.updateFS(test);
	};

	return (
		<div style={{ display: 'flex' }}>
			<div
				style={{
					display: 'flex',
					width: '3vw',
					minWidth: '45px',
					height: '99.7vh',
					flexDirection: 'column',
					borderStyle: 'solid',
					borderLeft: '0px',
					borderTop: '0px',
					borderBottom: '0px',
				}}
			>
				{/* side bar */}
				<ToggleButton
					isActive={toggleFileTree}
					text={'FS'}
					click={() => {
						setFileTree(!toggleFileTree);
					}}
				/>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '97vw',
					height: '99vh',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						display: 'flex',
						width: '96.7vw',
						height: '5vh',
						minHeight: '40px',
						justifyContent: 'space-between',
						borderStyle: 'solid',
						borderLeft: '0px',
						borderRight: '0px',
						borderTop: '0px',
					}}
				>
					{/* top bar */}
					<div>
						<ToggleInputToDiv
							isActive={toggleRename}
							text={fileSystemManager.getFilenameFromPath(
								fileSystemManager.activeFile
							)}
							toggle={() => {
								setRename(!toggleRename);
							}}
							fileSystemManager={fileSystemManager}
						/>
					</div>
					<div>
						<ToggleButton
							isActive={toggle}
							text={'edit'}
							click={() => {
								setToggle(!toggle);
							}}
						/>
						<ToggleButton
							isActive={mdRender}
							text={'render'}
							click={() => {
								setRender(!mdRender);
							}}
						/>
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						overflow: 'clip',
					}}
				>
					{toggleFileTree && <FileTree fileSystemManager={fileSystemManager} />}
					{toggle && (
						<Editor
							key={seed}
							size={mdRender}
							change={handleTextChange}
							fs={fileSystemManager.fileSystem}
							location={fileSystemManager.activeFile}
						/>
					)}
					{mdRender && (
						<MDrenderer
							markdown={
								fileSystemManager.fileSystem[fileSystemManager.activeFile]
									.content || ''
							}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
