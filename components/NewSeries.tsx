import React, { useState, useEffect } from 'react';

import {
	Button,
	Image,
	NativeBaseProvider,
	Center,
	Box,
	Input,
	Icon,
	Heading,
	Select,
	CheckIcon,
	HStack,
	TextArea,
	Text,
	Spinner
} from 'native-base';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import db from '../db/db';
import impGenre from '../constants/genres';
let genres = impGenre.genres;

// ### TODO
//    move chapter uploading to sperate screen

const NewSeries = () => {
	//

	const [banner, setBanner] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);
	// const [pages, setPages] = useState(null)
	const [genreMain, setGenreMain] = useState(null);
	const [title, setTitle] = useState(null);
	const [synopsis, setSynopsis] = useState(null);
	const [message, setMessage] = useState(null);
	const [showSpinner, setShowSpinner] = useState(true);

	// const [chapterTitle, setChapterTitle] = useState(null)
	// db.removeFable(`WW's End`)
	const pickBanner = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.cancelled) {
			setBanner(result.uri);
		}
	};

	const pickThumbnail = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.cancelled) {
			setThumbnail(result.uri);
		}
	};

	const clearBanner = () => {
		setBanner(null);
	};
	const clearThumbnail = () => {
		setThumbnail(null);
	};

	const submit = () => {
		if (thumbnail && banner && genreMain && title && synopsis) {
			setShowSpinner(true)
			setMessage('Uploading data to server')
			let fable = {
				banner: banner,
				thumbnail: thumbnail,
				title: title,
				webTitle: title.replace(/[^A-Za-z0-9]+/g, ''),
				genreMain: genreMain,
				// genreSecondary: string,
				// tagMain:string,
				// tagSecondary:string,
				// tagAlt:string,
				synopsis: synopsis,
				// releaseSchedule:string,
				author: 'testUser',
				reads: 0,
				chapterNum: 0,
				chapters: [],
				// chapters: [{
				//   reads:0,
				//   images: pages,
				//   title: chapterTitle
				// }],
				private: true,
			};

			// console.log(fable);
			db.addFable(fable).then((res) => {
				setShowSpinner(false)
				setMessage(res.msg)
			});
		} else {
			console.log('there was an error');
		}
	};

	const handleTitle = (event: any) => {
		setTitle(event.target.value);
	};
	const handleSynopsis = (event: any) => {
		setSynopsis(event.target.value);
	};

	return (
		<Box
			p={10}
			w={'100%'}
			h={'100%'}
			alignContent={'center'}
			justifyContent={'center'}
			bgColor={'muted.900'}>
			<Heading textAlign={'center'} color='muted.50'>
				New Fable
			</Heading>
			<HStack
				justifyContent={'space-between'}
				alignItems={'center'}
				mt={6}>
				<Heading textAlign={'center'} color='muted.50'>
					{title}
				</Heading>
				
			</HStack>

			{/* {Title} */}

			<Input
				_hover={{ color: 'muted.800' }}
				placeholder='Title'
				mt={5}
				isRequired
				onChange={handleTitle}
				color='muted.50'
			/>
			{/* {Banner} */}

			{!banner && (
				<Button
					w='100%'
					// maxH={"5vh"}
					onPress={pickBanner}
					mt={5}
					endIcon={
						<Icon
							as={Ionicons}
							name='cloud-upload-outline'
							size='sm'
						/>
					}>
					Banner Image
				</Button>
			)}
			{banner && (
				<HStack
					justifyContent={'space-around'}
					alignItems={'center'}
					mt={5}>
					<Button
						w='20%'
						// maxH={"10vh"}
						onPress={clearBanner}
						mt={5}
						bg={'red.700'}>
						Clear Banner
					</Button>

					<Image
						source={{ uri: banner }}
						alt={`${title}_banner`}
						w={'60vw'}
						h={'20vw'}
					/>
				</HStack>
			)}

			{/* {Synopsis} */}

			<Heading size='md' mt={5} color='muted.50'>
				Synopsis
			</Heading>
			<TextArea
				_hover={{ color: 'muted.800' }}
				placeholder='Synopsis'
				mt={5}
				isRequired
				onChange={handleSynopsis}
				color='muted.50'
				bg='muted.900'
			/>

			{/* {Thumbnail} */}

			{!thumbnail && (
				<Button
					onPress={pickThumbnail}
					mt={5}
					endIcon={
						<Icon
							as={Ionicons}
							name='cloud-upload-outline'
							size='sm'
						/>
					}>
					Thumbnail Image
				</Button>
			)}

			{thumbnail && (
				<HStack alignItems={'center'}>
					<Button
						w='20%'
						maxH={'5vh'}
						onPress={clearThumbnail}
						mt={5}
						bg={'red.700'}>
						Clear Thumbnail
					</Button>
					<Image
						source={{ uri: thumbnail }}
						alt={`${title}_thumbnail`}
						w={100}
						h={100}
						mx={10}
						mt={5}
					/>
				</HStack>
			)}

			{/* {genre selection} */}

			<Heading size={'md'} mt={5} color='muted.50'>
				Genre
			</Heading>

			<Select
				// isRequired
				// mt={5}
				selectedValue={genreMain}
				minWidth='200'
				color='muted.50'
				accessibilityLabel='Choose a Genre'
				placeholder='Choose a Genre'
				_selectedItem={{
					color: 'teal.500',
					endIcon: <CheckIcon size='5' />,
				}}
				mt={1}
				onValueChange={(itemValue) => setGenreMain(itemValue)}>
				<Select.Item label='Action/Adventure' value={genres.Action} />
				<Select.Item label='Comedy' value={genres.Comedy} />
				<Select.Item label='Sci Fi' value={genres.SciFi} />
				<Select.Item label='Horror' value={genres.Horror} />
			</Select>
			{thumbnail && banner && genreMain && title && synopsis && (
					<Box mt={5}>
						{message && (
							<HStack space={2}>
								<Text mt={'5'} color={'white'}>
									{message}
								</Text>
								{showSpinner && (
									<Spinner accessibilityLabel='Loading posts' />
								)}
							</HStack>
						)}
						<Button onPress={submit} bg={'green.700'}>
							Submit
						</Button>
					</Box>
				)}
		</Box>
	);
};

export default () => {
	return (
		<NativeBaseProvider>
			<Center flex={1}>
				<NewSeries />
			</Center>
		</NativeBaseProvider>
	);
};
