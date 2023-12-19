/** @format */

import '../webEditor/index.css';

export default function Editor({
	size,
	change,
	fs,
	location,
}: {
	size: boolean;
	change: any;
	fs: any;
	location: string;
}) {
	const editorClass = size ? 'halfSizeEditor' : 'fullSizeEditor';
	const content = fs[location].content;

	return (
		<div style={{ borderRight: '2px' }}>
			<div className="label" style={{ minHeight: '30px' }}>
				<a style={{ marginLeft: '3px', fontSize: '18px' }}> editor</a>
			</div>
			<textarea className={editorClass} id="mainTextBox" onChange={change}>
				{content}
			</textarea>
		</div>
	);
}
