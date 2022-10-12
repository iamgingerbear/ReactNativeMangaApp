import React, { useState, useEffect } from 'react';
import {
	Center,
	NativeBaseProvider,
	FlatList,
	Box,
	ScrollView,
	View,
	Image,
	AspectRatio,
	Text,
	Heading,
} from 'native-base';

import keygen from '../utility/keygen';
import db from '../db/db';
import { Pressable } from 'react-native';

// TODO: use width value to determine if items displayed are a multiple of columns, if not add blank fables to fix layout
// display user library
export const Read = (props) => {
	const [chapter, setChapter] = useState(null);
	const [noChapter, setNoChapter] = useState(false);
	const [data, setData] = useState(null);
	const [num, setNum] = useState(1);
	const [chapterNum, setChapterNum] = useState(null);
	const [isPrev, setIsPrev] = useState(true);
	const [isNext, setIsNext] = useState(true);
	let refresh = false;

	const handlePress = (dir) => {
		let moveTo =
			dir === 'Previous'
				? parseInt(chapterNum) - 1
				: parseInt(chapterNum) + 1;
		console.log(moveTo);
		props.navigation.replace('ReadFable', {
			webTitle: data.webTitle,
			chapterNum: moveTo,
		});
	};
	const advert = require("../assets/images/ads/Ad.png")
	const Pages = (props: { dir: string }) => {
		
		return (
			<Pressable onPress={() => handlePress(props.dir)}>
				<Box
					// mt={props.dir === 'Next'? 10:0}
					w={'100vw'}
					maxW={'1000'}
					h={'20vh'}
					bgColor={'muted.800'}
					textAlign={'center'}
					justifyContent={'center'}>
					<Text fontSize={20} color={'white'}>
						{props.dir} Chapter
					</Text>
				</Box>
			</Pressable>
		);
	};
	const Ad = () => {
		return (
			<Box
				w={'100vw'}
				maxW={'1000px'}
				h={'20vh'}
				// bg={'pink.800'}
				bgColor={'muted.800'}
				textAlign={'center'}
				justifyContent={'center'}
				alignItems={'center'}>
				{/* <Text color={'white'} fontSize={20}>
					Advert Here
				</Text> */}
				<Box justifyContent={'space-between'} w={"100%"} h={"100%"} flexDir={'row'}>
				<Image source={advert} resizeMode={'contain'} w={"50%"} h={"100%"}/>
				<Image source={advert} resizeMode={'contain'} w={"50%"} h={"100%"}/>
				</Box>
			</Box>
		);
	};

	const handleRefresh = () => {
		refresh = true;
		setNum(num + 1);
	};
	useEffect(() => {
		refresh = false;
		return () => {};
	}, [num]);

	useEffect(() => {
		let title = props.webTitle
			? props.webTitle
			: props.route.params.webTitle;
		let chapter = props.chapter
			? props.chapter
			: props.route.params.chapterNum;

		db.getFable(title).then((res) => {
			setData(res);
			props.navigation.setOptions({
				title: `${res.title} ${chapter}`,
			});
			if (res.chapterNum >= chapter) {
				setChapter(res.chapters[chapter - 1].images);
				setChapterNum(chapter);
			} else {
				setNoChapter(true);
			}
			if (chapter == 1) {
				setIsPrev(false);
			}
			// console.log(res.chapterNum);
			if (chapter >= parseInt(res.chapterNum)) {
				setIsNext(false);
			}
		});
	}, []);

	// image loading in flatlist is strangeasf, optimise this page plz

	if (chapter === null && noChapter == false) return null;
	if (chapterNum === null && noChapter == false) return null;
	// console.log(chapterNum == data.chapterNum)
	// console.log(isNext)
	return (
		<ScrollView
			bgColor={'muted.900'}
			w='100%'
			contentContainerStyle={{
				justifyContent: 'center',
				alignItems: 'center',
			}}
			showsVerticalScrollIndicator={false}>
			{!chapter && (
				<Box
					w={'100vw'}
					h={'50vh'}
					justifyContent={'center'}
					alignItems={'center'}>
					<Heading size={'lg'} color={'white'}>
						That chapter doesn't exist
					</Heading>

					<Pressable
						onPress={() =>
							props.navigation.navigate('ChapterSelect', {
								webTitle: data.webTitle,
							})
						}>
						<Box m={4} w={'100%'} h={'10vh'}>
							<Text
								fontSize={'lg'}
								color={'blue.700'}
								textAlign={'center'}>
								Go Back?
							</Text>
						</Box>
					</Pressable>
				</Box>
			)}
			{isPrev && <Pages dir='Previous' />}
			{chapter && (
				<>
					<FlatList
						w={'100vw'}
						maxW={800}
						extraData={num}
						showsVerticalScrollIndicator={false}
						scrollEnabled={true}
						snapToAlignment={'start'}
						decelerationRate={'fast'}
						initialScrollIndex={0}
						contentContainerStyle={{
							justifyContent: 'center',
							alignItems: 'center',
						}}
						keyExtractor={() => {
							return keygen();
						}}
						data={chapter}
						renderItem={({ item, index }) => (
							<View w={'100vw'} maxW={item.width}>
								<AspectRatio ratio={8 / 12}>
									<Image
										w={item.width}
										// h={item.height}
										maxW={'100vw'}
										// maxH={'100vh'}

										resizeMode='center'
										source={{ uri: item.uri }}
										alt='image'
									/>
								</AspectRatio>
							</View>
						)}
						onRefresh={handleRefresh}
						refreshing={refresh}
					/>
					<Ad />
				</>
			)}
			{isNext && <Pages dir='Next' />}
		</ScrollView>
	);
};
// export const Library = () => {
// return (
//  <Box w={props.width}></Box>
// )
// }

export default (props) => (
	<NativeBaseProvider>
		<Center flex={1}>
			<Read
				title={props.title}
				chapter={props.chapter}
				route={props.route}
				navigation={props.navigation}
			/>
		</Center>
	</NativeBaseProvider>
);
