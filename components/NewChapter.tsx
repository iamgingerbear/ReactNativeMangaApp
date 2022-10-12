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
	FlatList,
	Spinner,
	Text,
	HStack,
} from 'native-base';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import db from '../db/db';
import keygen from '../utility/keygen';

const NewSeries = (props) => {
	const [pages, setPages] = useState(null);
	const [chapterTitle, setChapterTitle] = useState(null);
	const [message, setMessage] = useState(null);
	const [showSpinner, setShowSpinner] = useState(true);
	const pickImages = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsMultipleSelection: true,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.cancelled) {
			setPages(result.selected);
		}
	};

	const clearPages = () => {
		setPages(null);
	};

	const submit = () => {
		if (chapterTitle && pages) {
			setShowSpinner(true)
			setMessage('uploading data to server');

			let chapter = {
				reads: 0,
				images: pages,
				title: chapterTitle,
			};

			console.log(chapter);
			db.addChapter(props.webTitle, 0, chapter).then((res) => {
				setShowSpinner(false);
				setMessage(res.msg);
			});
		} else {
			console.log('there was an error');
		}
	};

	const handleChapterTitle = (event: any) => {
		setChapterTitle(event.target.value);
	};

	return (
		<Box
			p={10}
			w={'100%'}
			h={'100%'}
			alignContent={'center'}
			justifyContent={'center'}
			bgColor={'muted.900'}>
			<Heading
				size='md'
				color='muted.50'
				alignSelf={'flex-start'}
				pt={'5'}>
				New Chapter
			</Heading>

			{/* {chapters} */}
			<Box mt={6} w='100%' flexDir={'row'}></Box>
			<Input
				_hover={{ color: 'muted.800' }}
				placeholder='Chapter Title'
				mt={5}
				isRequired
				onChange={handleChapterTitle}
				color='muted.50'
			/>

			{!pages && (
				<Button
					onPress={pickImages}
					mt={5}
					endIcon={
						<Icon
							as={Ionicons}
							name='cloud-upload-outline'
							size='sm'
						/>
					}>
					Chapter Pages
				</Button>
			)}
			{pages && (
				<Box>
					<Button
						w='100%'
						maxH={'5vh'}
						onPress={clearPages}
						mt={5}
						bg={'red.700'}>
						Clear Pages
					</Button>
					<FlatList
						horizontal
						maxW='1280'
						w='100%'
						decelerationRate='fast'
						initialScrollIndex={0}
						showsHorizontalScrollIndicator={false}
						data={pages}
						renderItem={({ item, index }) => (
							<Image
								source={{ uri: item.uri }}
								alt={`${chapterTitle}${index}`}
								w={200}
								h={300}
							/>
						)}
						keyExtractor={() => keygen()}
					/>
				</Box>
			)}
			{chapterTitle && pages && (
				<Box justifyContent={'center'}>
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
					<Button
						onPress={submit}
						bg={'green.700'}
						alignSelf={'flex-end'}
						mb={'5'}>
						Submit
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default (props) => {
	return (
		<NativeBaseProvider>
			<Center flex={1}>
				<NewSeries webTitle={props.webTitle} />
			</Center>
		</NativeBaseProvider>
	);
};
