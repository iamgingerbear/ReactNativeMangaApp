interface chapters {
	reads: number;
	images: string;
	title: string;
}
[];
interface fable {
	image: string;
	title: string;
	genreMain: string;
	// genreSecondary: string,
	// tagMain:string,
	// tagSecondary:string,
	// tagAlt:string,
	synopsis: string;
	// releaseSchedule:string,
	reads: number;
	chapterNum: number;
	chapters: chapters;
}

// const dbLoc = 'http://localhost:3000/fables';
const dbLoc = 'http://ec2-52-200-185-108.compute-1.amazonaws.com:3000/fables';

// get requests
const getFables = async () => {
	const requestOptions = {
		method: 'GET',
	};
	return await fetch(`${dbLoc}/`, requestOptions).then(handleResponse);
}

const getUserLibrary = async () => {
	const requestOptions = {
		method: 'GET',
	};
	return await fetch(`${dbLoc}/`, requestOptions).then(handleResponse);
}

// returns series made my the user
const getUserCreated = async (user: String) => {
	const requestOptions = {
		method: 'GET',
	};
	return await fetch(`${dbLoc}/create/${user}`, requestOptions).then(handleResponse);
}

const getFable = async (webTitle: string) => {
	const requestOptions = {
		method: 'GET',
	};
	// console.log(webTitle)
	return await fetch(`${dbLoc}/fable/${webTitle}`, requestOptions).then(
		handleResponse
	);
}

// post requests
const addFable = async (fable: fable) => {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(fable),
	};
	return await fetch(`${dbLoc}/`, requestOptions).then(handleResponse);
}

// patch requests
const updateFable = async (title: string, body: fable) => {
	// console.log(`update fable | ${title} | ${body.title}`)
	const requestOptions = {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	};
	return await fetch(`${dbLoc}/fable/${title}`, requestOptions).then(
		handleResponse
	);
}

const addChapter = async (title: string, chapterNum:number, chapter: chapters) => {
	const requestOptions = {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(chapter),
	};
	return await fetch(`${dbLoc}/fable/${title}/chapter/${chapterNum}`, requestOptions).then(
		handleResponse
	);
}

const readChapter = async(title: string, chapterNum: number) => {
	const requestOptions = {
		method: 'GET',
	};
	return await fetch(`${dbLoc}/fable/${title}/chapter/${chapterNum}`, requestOptions).then(
		handleResponse
	);
}

// delete requests
// prefixed with underscored because delete is a reserved word in javascript

const removeFable = async (title: string) => {
	const requestOptions = {
		method: 'DELETE',
	};
	return await fetch(`${dbLoc}/fable/${title}`, requestOptions).then(
		handleResponse
	);
}

// helper functions

const handleResponse = async (response: {
	text: () => Promise<any>;
	ok: any;
	statusText: any;
})  => {
	
	return response.text().then((text) => {
		const data = text && JSON.parse(text);
		if (!response.ok) {
			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}
		// console.log(data)
		return data;
	});
}


const fetchWrapper = {
	getFables,
	getUserLibrary,
	getUserCreated,
	getFable,
	addFable,
	updateFable,
	addChapter,
	readChapter,
	removeFable,
};


export default fetchWrapper;
