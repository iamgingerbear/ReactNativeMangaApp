import React, { useEffect, useState, useRef } from 'react';
import {
	Text,
	HStack,
	Center,
	Heading,
	NativeBaseProvider,
	FlatList,
	ScrollView,
	Box,
	AspectRatio,
	Image,
	View,
	Pressable,
	Icon,
	Modal,
	useBreakpointValue,
	Input,
	TextArea,
	Button,
	Switch,
} from 'native-base';
import { ImageBackground, StyleSheet} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import NewChapterModal from '../components/NewChapter';
import keygen from '../utility/keygen';
import db from '../db/db';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import UpdateSeries from '../components/UpdateSeries';
import Fable from '../components/Fable';

// TODO:
//      useBreakpointValue to adjust the banner size
//      useBreakpointValue to adjust vertical offset of flatlist

export const ChapterSelect = (props: any) => {
	const isFocused = useIsFocused();
	const [data, setData] = useState([]);
	const [Chapters, setChapters] = useState([]);
	const [returnMore, setReturnMore] = useState(false);
	const [chapterNum, setchapterNum] = useState(1);
	const [image, setImage] = useState(null);
	let title = '';
	const [synopsis, setSynopsis] = useState(null);
	const [webTitle, setWebTitle] = useState(null);
	const [modal, setModal] = useState(false);
	const [edit, setEdit] = useState(props.route.params.edit);
	const [change, setChange] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const height = useBreakpointValue({
		base: 9,
		lg: 6,
	});

	// const sort = () => {
	//   let sorted = Chapters.reverse()
	//   setChapters(sorted)
	//   console.log(Chapters)
	//   console.log(sorted)
	//   // setInverted(!inverted)

	// }
const navigation = useNavigation()
	const fetch = () => {
		//check for multiple function calls
		if (returnMore) {
			if (Chapters.length < chapterNum) {
				//set not looking for more chapters
				setReturnMore(false);
				//initialise variables
				let returnData = [];

				//create array of new chapters
				let add = 10;

				if (Chapters.length + add > chapterNum) {
					add = chapterNum - Chapters.length;
				}
				for (let i = 1; i <= add; i++) {
					returnData.push({
						chapterNum: Chapters.length + i,
						chapterTitle: `${data.title} ${Chapters.length + i}`,
						key: keygen(),
						path: data.image,
					});
					// console.log(data)
				}
				//set states to account for adding new chapters. will cause render update for component
				setChapters(Chapters.concat(returnData));
				if (data.length != chapterNum) {
					setReturnMore(true);
				}
			}
		}
	};

	const handleNew = () => {
		setModal(true);
	};

	useEffect(() => {
		let webTitle;
		if (props.webTitle) {
			webTitle = props.webTitle;
		} else {
			webTitle = props.route.params.webTitle;
		}
		if (props.route.params.edit === 'true') {
			console.log('true')
			setEdit(true);
		}
		db.getFable(webTitle)
			.then((res) => {
				if(res.thumbnail === undefined){
					// props.navigation.navigate('Root')
				}
				setImage(res.thumbnail);
				setchapterNum(res.chapters.length);
				setData(res);
				title = res.title;
				props.navigation.setOptions({title: res.title})
				setSynopsis(res.synopsis);
			})
			.then(() => {
				setReturnMore(true);
				setWebTitle(webTitle);
				
			}).then(()=> setLoaded(true));
	}, []);

	useEffect(() => {
		// console.log('fetching data ' + `${chapterNum}`)
		fetch();
		return () => {
			// cleanup
		};
	}, [returnMore]);

	if (data === [] || !loaded) return null;

	const NewChapter = () => {
		if (edit) {
			return (
				<Pressable onPress={handleNew}>
					<Box
						w='100%'
						bgColor={'muted.900'}
						key={keygen()}
						justifyContent={'center'}
						alignItems={'center'}>
						<HStack
							justifyContent={'space-between'}
							w='100%'
							maxW={1280}
							px={8}
							py={1}
							bgColor={'muted.900'}
							key={keygen()}>
							<Icon
								as={Ionicons}
								name='add-circle-outline'
								color={'white'}
								justifySelf={'flex-start'}
								size={'20'}
							/>
							<Text color='white' h='100%' pt={10}>
								Add Chapter
							</Text>
							<Text
								color='white'
								h='100%'
								alignSelf={'flex-end'}
								pt={10}></Text>
						</HStack>
					</Box>
				</Pressable>
			);
		} else {
			return null;
		}
	};
	const handleUpdate = (event: any) => {
		setChange(!change);
	};
	if ((Chapters.length === 0 && !props.route.params.edit) || !data)
		return null;
	return (
		<View>
			{/* banner */}

			<ScrollView maxH='100vh' showsVerticalScrollIndicator={false}>
				{/* title */}
				<Box
					w='100vw'
					h='100vh'
					alignItems={'center'}
					bgColor={'muted.900'}>
					<View
						// w={'100%'}
						// position={'absolute'}
						zIndex={-999}
						style={styles.container}
						key={keygen()}>
						{/* <AspectRatio ratio={12 / height} key={keygen()}> */}
							<ImageBackground
								source={{
									uri: data.banner,
								}}
								resizeMode='cover'
								key={keygen()}
								style={styles.image}
							>
								<Box w={"100vw"} h={"33vh"} />
							</ImageBackground>
						{/* </AspectRatio> */}
					</View>

					<FlatList
						mt={'25vh'}
						// inverted={inverted}
						w='100%'
						minH={'70vh'}
						bg={'muted.900'}
						data={Chapters}
						showsHorizontalScrollIndicator={false}
						onEndReachedThreshold={0.3}
						onEndReached={({ distanceFromEnd }) => {
							if (distanceFromEnd < 0) return;
							fetch();
						}}
						snapToAlignment={'start'}
						decelerationRate={'fast'}
						// snapToInterval={Dimensions.get('window').width + 5}
						initialScrollIndex={0}
						keyExtractor={() => keygen()}
						// stickyHeaderIndices={[0]}
						ListHeaderComponent={
							<>
								<LinearGradient
									colors={[
										'transparent',
										'#171717',
										'#171717',
										'#171717',
									]}
									start={{ x: 0.5, y: 0 }}
									end={{ x: 0.5, y: 0.1 }}>
									<Box
										justifyContent={'center'}
										alignItems={'center'}>
										{edit && <Button
										mt={5}
											w={'75%'}
											maxW={"300px"}
											onPress={handleUpdate}>
											Edit
										</Button>}
										<Heading
											color='white'
											alignSelf={'center'}
											pt='5'
											key={keygen()}>
											{data.title}
										</Heading>
										<Text color={'white'} fontSize={'md'}>
											by {data.author}
										</Text>
										{/* desc */}
										<Text
											p='5'
											maxW={'1280'}
											color='white'
											key={keygen()}>
											{synopsis}
										</Text>

										<HStack
											w='100%'
											maxW={1280}
											justifyContent={'space-between'}
											p='5'
											key={keygen()}>
											{/* total chapters */}
											<Text color={'white'}>
												Total Chapters: {chapterNum}
											</Text>
											{/* sort chapters */}
											{/* <Pressable onPress={sort}><Box w="25" h='5' bgColor={'white'} color='black'></Box></Pressable> */}
										</HStack>
									</Box>
								</LinearGradient>
							</>
						}
						renderItem={({ item, index }) => (
							<Pressable
								onPress={() =>
									props.navigation.navigate('ReadFable', {
										webTitle: webTitle,
										chapterNum: index + 1,
									})
								}>
								<Box
									w='100%'
									bgColor={'muted.900'}
									key={keygen()}
									justifyContent={'center'}
									alignItems={'center'}>
									<HStack
										justifyContent='space-between'
										w='100%'
										maxW={1280}
										px={5}
										py={1}
										bgColor={'muted.900'}
										key={keygen()}>
										<Image
											source={{ uri: data.thumbnail }}
											w='100'
											h='100'
											alt='image'
											alignSelf={'flex-start'}
										/>
										<Text color='white' h='100%' pt={10}>
											{data.chapters[index].title}
										</Text>
										<Text
											color='white'
											h='100%'
											alignSelf={'flex-end'}
											pt={10}>
											{index + 1}
										</Text>
									</HStack>
								</Box>
							</Pressable>
						)}
						ListFooterComponent={() => <NewChapter />}
					/>
				</Box>

				{/* list of chapters */}

				{/* </ZStack> */}
				<Modal
					isOpen={modal}
					onClose={() => setModal(false)}
					size={'full'}>
					<Modal.CloseButton />
					{/* <Modal.Header fontSize={'lg'} _text={{color:"white", fontSize:"24"}}>New Fable</Modal.Header> */}
					<Modal.Body _text={{ color: 'white' }} size={'xl'}>
						<NewChapterModal webTitle={webTitle} />
					</Modal.Body>
				</Modal>
				<Modal
					isOpen={change}
					onClose={() => setChange(false)}
					size={'full'}>
					<Modal.CloseButton />
					<Modal.Body _text={{ color: 'white' }}>
						<UpdateSeries fable={data}/>
					</Modal.Body>
				</Modal>
			</ScrollView>
		</View>
	);
};
// *IMPORTANT* add expo gradient to nativebaseprovider provider config
const config = {
	dependencies: {
		'linear-gradient': require('expo-linear-gradient').LinearGradient,
	},
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
		overflow:"hidden",
		alignItems:'center',
		justifyContent:'center',
		minHeight:"33vh",
		position:'absolute'
  },
  image: {
    // flex: 1,
    justifyContent: "center",
		resizeMode:'cover'
  }
});

export default (props) => {
	return (
		<NativeBaseProvider config={config}>
			<Center flex={1}>
				<ChapterSelect
					route={props.route}
					navigation={props.navigation}
				/>
			</Center>
		</NativeBaseProvider>
	);
};
