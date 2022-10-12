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
	Switch,
	Text,
	Spinner,
} from 'native-base';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import db from '../db/db';
import impGenre from '../constants/genres';
import { useNavigation } from '@react-navigation/native';
import { NavigationEvents } from 'react-navigation';
import keygen from '../utility/keygen';
let genres = impGenre.genres;

// ### TODO
//    move chapter uploading to sperate screen

const NewSeries = (props: any) => {
	//
	let fable = props.fable;
	// const [pages, setPages] = useState(null)
	const [genreMain, setGenreMain] = useState(props.fable.genreMain);
	const [selectedChapter, setSelectedChapter] = useState(null);
	const [selectedChapterTitle, setSelectedChapterTitle] = useState(null);
	const [title, setTitle] = useState(props.fable.title);
	const [synopsis, setSynopsis] = useState(props.fable.synopsis);
	const [vis, setVis] = useState(props.fable.private);
	const [showSpinner, setShowSpinner] = useState(true);
	const [message, setMessage] = useState(null);
	const [confirmRemove, setConfirmRemove] = useState(null);

	const navigation = useNavigation();

	const submit = () => {
		if (genreMain && title && synopsis) {
			setShowSpinner(true);
			setMessage('Uploading data to server');
			
			let updateTitle = fable.webTitle;
			if (fable.title != title) {
				fable.title = title;
				fable.webTitle = title.replace(/[^A-Za-z0-9]+/g, '');
			}
			if (fable.synopsis != synopsis) {
				fable.synopsis = synopsis;
			}
			if (fable.genreMain != genreMain) {
				fable.genreMain = genreMain;
			}
			if (fable.private != vis) {
				fable.private = vis;
			}

			db.updateFable(updateTitle, fable)
				.then((res) => {
					setShowSpinner(false);
					setMessage(res.msg);
				})
				.then(() =>
					navigation.navigate(`ChapterSelect`, {
						webTitle: fable.webTitle,
						edit: true,
					})
				);
		} else {
			console.log('error');
		}
	};
	const remove = () => {
		setConfirmRemove(true);
	};
	const dontRemove = () => {
		setConfirmRemove(false);
	};
	const reallyRemove = () => {
		setConfirmRemove(false);
		db.removeFable(props.fable.webTitle);
		navigation.navigate(`Root`);
	};
	const handleTitle = (event: any) => {
		setTitle(event.target.value);
	};
	const removeChapter = (index) => {
		// remove chapter at index from fable.chapters
		let chapters = fable.chapters;
		chapters.splice(index, 1);
		fable.chapters = chapters;

	};
	const handleSynopsis = (event: any) => {
		setSynopsis(event.target.value);
	};
	const handleVis = (event: any) => {
		setVis(!vis);
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
				Update Fable
			</Heading>
			<HStack
				justifyContent={'space-between'}
				alignItems={'center'}
				mt={6}>
				<Heading size={'md'} textAlign={'center'} color='muted.50'>
					Title
				</Heading>
			</HStack>

			{/* {Title} */}

			<Input
				_hover={{ color: 'muted.800' }}
				value={title}
				mt={1}
				isRequired
				onChange={handleTitle}
				color='muted.50'
			/>
			{/* {Synopsis} */}

			<Heading size='md' mt={5} color='muted.50'>
				Synopsis
			</Heading>
			<TextArea
				_hover={{ color: 'muted.800' }}
				value={synopsis}
				mt={1}
				isRequired
				onChange={handleSynopsis}
				color='muted.50'
				bg='muted.900'
			/>

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

			{/* {visibility selection} */}
			<HStack mt={5} w={'100%'} justifyContent={'space-between'}>
				<Heading color={'white'} size={'md'}>
					Private:
				</Heading>
				<Switch size={'md'} onToggle={handleVis} isChecked={vis} />
			</HStack>

			{/* {chapter remove} */}
			<Box mt={5}>
				<Select
					selectedValue={selectedChapterTitle}
					minWidth='200'
					color='muted.50'
					accessibilityLabel='Choose a Chapter'
					placeholder='Choose a Chapter'
					_selectedItem={{
						color: 'teal.500',
						endIcon: <CheckIcon size='5' />,
					}}
					mt={1}
					onValueChange={(itemValue) => {
						setSelectedChapter(itemValue);
						setSelectedChapterTitle(
							props.fable.chapters[itemValue].title
						);
					}}>
					{/* for each chapter add a select item */}
					{props.fable.chapters.map((chapter, index) => (
						<Select.Item
							key={keygen()}
							label={chapter.title}
							value={index}
						/>
					))}
				</Select>
				{/* remove selected chapter from fable chapters */}
				<Button
					mt={1}
					bg={'red.700'}
					isDisabled={!selectedChapter}
					onPress={removeChapter}>
					Remove Chapter
				</Button>

			</Box>

			<Box mt={5}>
				{message && (
					<HStack>
						<Text color={'white'}>{message}</Text>
						{showSpinner && (
							<Spinner accessibilityLabel='Loading posts' />
						)}
					</HStack>
				)}
				<Button onPress={submit} mt={2} bg={'green.700'}>
					Submit
				</Button>
				<Button onPress={remove} mt={8} bg={'red.700'}>
					Delete
				</Button>
				{confirmRemove && (
					<>
						<Heading mt={3} color={'white'} size={'md'}>
							Confirm Delete
						</Heading>
						<HStack
							mt={1}
							space={2}
							w={'100%'}
							justifyContent={'space-between'}>
							<Button
								onPress={dontRemove}
								bg={'red.700'}
								w={'48%'}>
								No
							</Button>
							<Button
								bg={'green.700'}
								w={'48%'}
								onPress={reallyRemove}>
								Yes
							</Button>
						</HStack>
					</>
				)}
			</Box>
		</Box>
	);
};

export default (props) => {
	return (
		<NativeBaseProvider>
			<Center flex={1}>
				<NewSeries fable={props.fable} />
			</Center>
		</NativeBaseProvider>
	);
};
