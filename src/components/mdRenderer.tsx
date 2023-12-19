/** @format */

// TODO: add images to the renderer

// TODO: multiline block quotes dont render properly

// TODO: refactor this to optimise codespace

import '../webEditor/index.css';
const DOMPurify = require('dompurify');

interface compArrType {
	type: string;
	value: any;
}

interface lstArrType {
	value: string;
	nestedIn: any[];
}

function constructNumberdList(list: lstArrType[]) {
	let mapList = list.map(item => (
		<>
			<li>{item.value}</li>
			<ol>{item.nestedIn}</ol>
		</>
	));
	list = [];
	return <ol>{mapList}</ol>;
}

function constructUnorderdList(list: lstArrType[]) {
	let mapList = list.map(item => (
		<>
			<li>{item.value}</li>
			<ul>{item.nestedIn}</ul>
		</>
	));
	list = [];
	return <ul>{mapList}</ul>;
}

export default function MDrenderer({ markdown }: { markdown: string }) {
	markdown += '\n';
	let md = markdown.split('\n');

	let finalArray = [];
	let listArray: lstArrType[] = [];
	let unorderdlistArray: lstArrType[] = [];
	let paragraphArray = [];
	let codeBlockArray = [];
	let constructingCodeBlock = false;
	let listCount = 0;

	for (let i = 0; i < md.length; i++) {
		let segmentArray = [];
		let stagedArray: compArrType[] = [];
		let componentArray = [];

		segmentArray.push({ type: 'text', value: md[i] });

		for (let j = 0; j < segmentArray.length; j++) {
			if (segmentArray[j].value == '' && segmentArray.length == 1) {
				stagedArray.push({ type: 'text', value: ' ' });
				segmentArray = stagedArray;
				stagedArray = [];
			}
		}

		//escapePoint
		if (
			segmentArray[0].value.split('/').length > 1 &&
			segmentArray[0].value.split('/')[0] == ''
		) {
			let val: any = segmentArray[0].value.split('/');
			if (val.length > 2) {
				val = val.slice(1, segmentArray[0].value.split('/').length).join('/');
			} else {
				val = val[1];
			}
			stagedArray.push({ type: `breakoutPoint`, value: val });
			segmentArray = stagedArray;
			stagedArray = [];
		}

		//hedding
		if (
			segmentArray[0].value.split('#').length > 1 &&
			segmentArray[0].value.split('#')[0] == ''
		) {
			let dataPos = segmentArray[0].value.split('#').length - 1;
			stagedArray.push({
				type: `h${dataPos}`,
				value: segmentArray[0].value.split('#')[dataPos],
			});
			segmentArray = stagedArray;
			stagedArray = [];
		}

		//divider
		if (
			segmentArray[0].value.split('***').length > 1 &&
			segmentArray[0].value.split('***')[0] == ''
		) {
			stagedArray.push({ type: `divider`, value: '0' });
			segmentArray = stagedArray;
			stagedArray = [];
		}

		//divider
		if (
			segmentArray[0].value.split('---').length > 1 &&
			segmentArray[0].value.split('---')[0] == ''
		) {
			stagedArray.push({ type: `divider`, value: '0' });
			segmentArray = stagedArray;
			stagedArray = [];
		}

		//blockQuote
		if (segmentArray[0].value.split('>').length > 1 && !constructingCodeBlock) {
			stagedArray.push({
				type: 'blockQuote',
				value: segmentArray[0].value.split('>')[1],
			});
			segmentArray = stagedArray;
			stagedArray = [];
		}

		//numberdList
		if (
			parseInt(segmentArray[0].value.split('.')[0]) &&
			segmentArray[0].value.split('.').length == 2
		) {
			if (segmentArray[0].value.split('    ').length - 1 > 0) {
				try {
					listArray[listArray.length - 1].nestedIn.push(
						<li>{segmentArray[0].value.split('.')[1]}</li>
					);
				} catch {
					listArray.push({
						value: segmentArray[0].value.split('.')[1],
						nestedIn: [],
					});
					stagedArray.push({ type: 'void', value: '0' });
				}
			} else {
				listArray.push({
					value: segmentArray[0].value.split('.')[1],
					nestedIn: [],
				});
				stagedArray.push({ type: 'void', value: '0' });
			}
			if (
				md[i + 1] == undefined ||
				!(parseInt(md[i + 1].split('.')[0]) && md[i + 1].split('.').length == 2)
			) {
				stagedArray.push({
					type: 'list',
					value: constructNumberdList(listArray),
				});
				listArray = [];
			}
			listCount++;
			segmentArray = stagedArray;
			stagedArray = [];
		}

		//unorderdList
		if (segmentArray.length == 0) {
		} else {
			if (
				segmentArray[0].value.split('- ').length > 1 &&
				segmentArray[0].value.split('- ').length == 2 &&
				segmentArray[0].value.split('- ')[0] == ''
			) {
				if (segmentArray[0].value.split('    ').length - 1 > 0) {
					try {
						unorderdlistArray[unorderdlistArray.length - 1].nestedIn.push(
							<li>{segmentArray[0].value.split('- ')[1]}</li>
						);
					} catch {
						unorderdlistArray.push({
							value: segmentArray[0].value.split('- ')[1],
							nestedIn: [],
						});
					}
				} else {
					unorderdlistArray.push({
						value: segmentArray[0].value.split('- ')[1],
						nestedIn: [],
					});
				}
				if (
					md[i + 1] == undefined ||
					!(
						segmentArray[0].value.split('- ').length > 1 &&
						md[i + 1].split('- ').length == 2
					)
				) {
					stagedArray.push({
						type: 'list',
						value: constructUnorderdList(unorderdlistArray),
					});
					unorderdlistArray = [];
				}
				listCount++;
				segmentArray = stagedArray;
				stagedArray = [];
			}
		}

		//unorderdList
		if (segmentArray.length == 0) {
		} else {
			if (segmentArray[0].type !== 'text') {
			} else {
				if (
					segmentArray[0].value.split('* ').length > 1 &&
					segmentArray[0].value.split('* ').length == 2 &&
					segmentArray[0].value.split('* ')[0] == ''
				) {
					if (segmentArray[0].value.split('    ').length - 1 > 0) {
						try {
							unorderdlistArray[unorderdlistArray.length - 1].nestedIn.push(
								<li>{segmentArray[0].value.split('* ')[1]}</li>
							);
						} catch {
							unorderdlistArray.push({
								value: segmentArray[0].value.split('* ')[1],
								nestedIn: [],
							});
						}
					} else {
						unorderdlistArray.push({
							value: segmentArray[0].value.split('* ')[1],
							nestedIn: [],
						});
					}
					if (
						md[i + 1] == undefined ||
						!(
							segmentArray[0].value.split('* ').length > 1 &&
							md[i + 1].split('* ').length == 2
						)
					) {
						stagedArray.push({
							type: 'list',
							value: constructUnorderdList(unorderdlistArray),
						});
						unorderdlistArray = [];
					}
					listCount++;
					segmentArray = stagedArray;
					stagedArray = [];
				}
			}
		}

		//unorderdList
		if (segmentArray.length == 0) {
		} else {
			if (segmentArray[0].type !== 'text') {
			} else {
				if (
					segmentArray[0].value.split('+ ').length > 1 &&
					segmentArray[0].value.split('+ ').length == 2 &&
					segmentArray.length == 1
				) {
					if (segmentArray[0].value.split('    ').length - 1 > 0) {
						try {
							unorderdlistArray[unorderdlistArray.length - 1].nestedIn.push(
								<li>{segmentArray[0].value.split('+ ')[1]}</li>
							);
						} catch {
							unorderdlistArray.push({
								value: segmentArray[0].value.split('+ ')[1],
								nestedIn: [],
							});
						}
					} else {
						unorderdlistArray.push({
							value: segmentArray[0].value.split('+ ')[1],
							nestedIn: [],
						});
					}
					if (
						md[i + 1] == undefined ||
						!(
							segmentArray[0].value.split('+ ').length > 1 &&
							md[i + 1].split('+ ').length == 2
						)
					) {
						stagedArray.push({
							type: 'list',
							value: constructUnorderdList(unorderdlistArray),
						});
						unorderdlistArray = [];
					}
					listCount++;
					segmentArray = stagedArray;
					stagedArray = [];
				}
			}
		}

		//code
		for (let j = 0; j < segmentArray.length; j++) {
			if (segmentArray[j].type !== 'text') {
				stagedArray.push(segmentArray[j]);
			} else {
				let segment: any = segmentArray[j].value.split('``');
				let beginning = segment.length == 2 && segment[0] == '' && !constructingCodeBlock;
				let end = (segment.length == 2 && segment[1] == '') || segment.length == 2;
				for (let k = 0; k < segment.length; k++) {
					if (k == segment.length - 1 && segment[k] == '') {
					} else {
						if (beginning || (!beginning && !end && constructingCodeBlock)) {
							codeBlockArray.push(
								<>
									{segment[k]}
									<br />
								</>
							);
							constructingCodeBlock = true;
						} else if (end) {
							stagedArray.push({
								type: 'codeBlock',
								value: (
									<code>
										{codeBlockArray}
										{segment[k]}
									</code>
								),
							});
							constructingCodeBlock = false;
						} else if (k % 2 == 1) {
							stagedArray.push({
								type: 'code',
								value: segment[k],
							});
						} else {
							stagedArray.push({
								type: 'text',
								value: segment[k],
							});
						}
					}
				}
			}
		}

		segmentArray = stagedArray;
		stagedArray = [];

		//link
		for (let j = 0; j < segmentArray.length; j++) {
			if (segmentArray[j].type !== 'text') {
				stagedArray.push(segmentArray[j]);
			} else {
				let segment: any = segmentArray[j].value.split('[');
				let dynamicCount = segment.length;
				for (let k = 0; k < segment.length; k++) {
					if (k == segment.length - 1 && segment[k] == '') {
					} else {
						if (k % 2 == 1) {
							//stagedArray.push({type: "text", value: segment[k]});
							let link = `[${segment[k].split(')')[0]})`;
							if (segment[k].split(')').length > 1) {
								let metaData = {
									name: link.split('](')[0].split('[')[1],
									href: link.split('](')[1].split(' ')[0].split(')')[0],
									title: '',
								};
								try {
									metaData.title = link
										.split('](')[1]
										.split(' "')[1]
										.split('"')[0];
								} catch {}
								stagedArray.push({
									type: 'link',
									value: (
										<a href={metaData.href} title={metaData.title}>
											{metaData.name}
										</a>
									),
								});
								stagedArray.push({
									type: 'text',
									value: segment[k].split(')')[1],
								});
							}
							dynamicCount++;
						} else {
							stagedArray.push({
								type: 'text',
								value: segment[k],
							});
						}
					}
				}
			}
		}

		segmentArray = stagedArray;
		stagedArray = [];

		//bold and itallic
		for (let j = 0; j < segmentArray.length; j++) {
			if (segmentArray[j].type !== 'text') {
				stagedArray.push(segmentArray[j]);
			} else {
				let segment: any = segmentArray[j].value.split('***');
				for (let k = 0; k < segment.length; k++) {
					if (k == segment.length - 1 && segment[k] == '') {
					} else {
						if (k % 2 == 1) {
							stagedArray.push({
								type: 'boldAndItallic',
								value: segment[k],
							});
						} else {
							stagedArray.push({
								type: 'text',
								value: segment[k],
							});
						}
					}
				}
			}
		}

		segmentArray = stagedArray;
		stagedArray = [];

		//bold and itallic
		for (let j = 0; j < segmentArray.length; j++) {
			if (segmentArray[j].type !== 'text') {
				stagedArray.push(segmentArray[j]);
			} else {
				let segment: any = segmentArray[j].value.split('___');
				for (let k = 0; k < segment.length; k++) {
					if (k == segment.length - 1 && segment[k] == '') {
					} else {
						if (k % 2 == 1) {
							stagedArray.push({
								type: 'boldAndItallic',
								value: segment[k],
							});
						} else {
							stagedArray.push({
								type: 'text',
								value: segment[k],
							});
						}
					}
				}
			}
		}

		segmentArray = stagedArray;
		stagedArray = [];

		//bold
		for (let j = 0; j < segmentArray.length; j++) {
			if (segmentArray[j].type !== 'text' || segmentArray[j].type == 'link') {
				stagedArray.push(segmentArray[j]);
			} else {
				let segment: any = segmentArray[j].value.split('**');
				for (let k = 0; k < segment.length; k++) {
					if (k == segment.length - 1 && segment[k] == '') {
					} else {
						if (k % 2 == 1) {
							stagedArray.push({
								type: 'bold',
								value: segment[k],
							});
						} else {
							stagedArray.push({
								type: 'text',
								value: segment[k],
							});
						}
					}
				}
			}
		}

		segmentArray = stagedArray;
		stagedArray = [];

		//bold
		for (let j = 0; j < segmentArray.length; j++) {
			if (segmentArray[j].type !== 'text') {
				stagedArray.push(segmentArray[j]);
			} else {
				let segment: any = segmentArray[j].value.split('__');
				for (let k = 0; k < segment.length; k++) {
					if (k == segment.length - 1 && segment[k] == '') {
					} else {
						if (k % 2 == 1) {
							stagedArray.push({
								type: 'bold',
								value: segment[k],
							});
						} else {
							stagedArray.push({
								type: 'text',
								value: segment[k],
							});
						}
					}
				}
			}
		}

		segmentArray = stagedArray;
		stagedArray = [];

		//itallic
		for (let j = 0; j < segmentArray.length; j++) {
			if (segmentArray[j].type !== 'text') {
				stagedArray.push(segmentArray[j]);
			} else {
				let segment: any = segmentArray[j].value.split('*');
				for (let k = 0; k < segment.length; k++) {
					if (k == segment.length - 1 && segment[k] == '') {
					} else {
						if (k % 2 == 1) {
							stagedArray.push({
								type: 'itallic',
								value: segment[k],
							});
						} else {
							stagedArray.push({
								type: 'text',
								value: segment[k],
							});
						}
					}
				}
			}
		}

		segmentArray = stagedArray;
		stagedArray = [];

		//ittalic
		for (let j = 0; j < segmentArray.length; j++) {
			if (segmentArray[j].type !== 'text') {
				stagedArray.push(segmentArray[j]);
			} else {
				let segment: any = segmentArray[j].value.split('_');
				for (let k = 0; k < segment.length; k++) {
					if (k == segment.length - 1 && segment[k] == '') {
					} else {
						if (k % 2 == 1) {
							stagedArray.push({
								type: 'itallic',
								value: segment[k],
							});
						} else {
							stagedArray.push({
								type: 'text',
								value: segment[k],
							});
						}
					}
				}
			}
		}

		segmentArray = stagedArray;
		stagedArray = [];

		for (let j = 0; j < segmentArray.length; j++) {
			if (segmentArray[j].type == 'bold') {
				componentArray.push(<strong>{segmentArray[j].value}</strong>);
			} else if (segmentArray[j].type == 'code') {
				componentArray.push(<code>{segmentArray[j].value}</code>);
			} else if (segmentArray[j].type == 'codeBlock') {
				componentArray.push(<>{segmentArray[j].value}</>);
			} else if (segmentArray[j].type == 'divider') {
				componentArray.push(<hr />);
			} else if (segmentArray[j].type == 'boldAndItallic') {
				componentArray.push(
					<em>
						<strong>{segmentArray[j].value}</strong>
					</em>
				);
			} else if (segmentArray[j].type == 'itallic') {
				componentArray.push(<em>{segmentArray[j].value}</em>);
			} else if (segmentArray[j].type == 'blockQuote') {
				componentArray.push(
					<blockquote>
						<p>{segmentArray[j].value}</p>
					</blockquote>
				);
			} else if (segmentArray[j].type.split('')[0] == 'h') {
				componentArray.push(
					<div
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(
								`<${segmentArray[j].type}>${segmentArray[j].value}</${segmentArray[j].type}>`
							),
						}}
					></div>
				);
			} else if (segmentArray[j].type == 'list') {
				componentArray.push(segmentArray[j].value);
			} else if (segmentArray[j].type == 'link') {
				componentArray.push(segmentArray[j].value);
			} else if (segmentArray[j].type == 'p') {
				componentArray.push(segmentArray[j].value);
			} else if (segmentArray[j].type == 'void') {
				//stuff is being prerenderd
			} else {
				componentArray.push(<>{`${segmentArray[j].value}`}</>);
			}
		}

		if (componentArray[0] !== undefined) {
			if (componentArray[0].props.children !== ' ') {
				paragraphArray.push(
					<>
						{componentArray}
						<br />
					</>
				);
				// finalArray.push((<p>{componentArray}</p>));
			} else {
				finalArray.push(<p>{paragraphArray}</p>);
				paragraphArray = [];
			}
		}
	}

	return (
		<div>
			<div className="label">
				<a style={{ marginLeft: '3px', fontSize: '18px' }}>renderer</a>
			</div>
			<div className="mdRenderer">{finalArray}</div>
		</div>
	);
}
