import React, { useState, useEffect } from 'react';
import {
	Center,
	NativeBaseProvider,
	Flex,
	Box,
	ScrollView,
	useBreakpointValue,
	Icon,
	Modal,
	Pressable,
	Button,
	Image,
	Input,
	Heading,
	Select,
	CheckIcon,
	HStack,
	TextArea,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import Fable from '../components/Fable';
import keygen from '../utility/keygen';
import db from '../db/db';
import NewSeries from '../components/NewSeries';
import { useIsFocused } from '@react-navigation/native';

//modified library screen

// TODO: use width value to determine if items displayed are a multiple of columns, if not add blank fables to fix layout
// display user library
export const Create = () => {
	const isFocused = useIsFocused();
	const [data, setdata] = useState([]);
	const [modal, setModal] = useState(false);

	const columns = useBreakpointValue({
		base: 2,
		sm: 3,
		md: 4,
		lg: 5,
		xl: 6,
	});

	const NewFable = () => {
		return (
			<Pressable h={'95%'} onPress={handleNew}>
				<Box
					w={width}
					h={'100%'}
					minH={width}
					py={5}
					mx={1}
					justifyContent={'center'}
					alignItems={'center'}
					bg={'info.900'}
					rounded={'lg'}>
					<Icon
						as={Ionicons}
						name='add-circle-outline'
						color={'white'}
					/>
				</Box>
			</Pressable>
		);
	};

	const BlankFable = () => {
		return <Box w={width}/>;
	};

	const handleNew = () => {
		setModal(true);
	};

	useEffect(() => {
		db.getUserCreated('testUser').then((res) => {
			setdata(res);
		});
	}, []);

	// xs, sm, md, lg
	const width = ['48vw', '32vw', '24vw', '18.7vw', '213.33'];

	// account for layout issues when using justify: space-around
	let testFill = data.length % columns;
	if (testFill != 0) testFill = columns - testFill;
	const testArr = [];
	for (let i = 0; i < testFill; i++) {
		testArr.push('blank');
	}
	return (
		<ScrollView bgColor={'muted.900'} w={'100%'}>
			<Flex
				direction='row'
				wrap='wrap'
				width='100%'
				maxW='1280'
				alignItems='center'
				alignSelf='center'
				justifyContent='space-around'>
				{data.map(({ thumbnail, title }) => (
					<Center key={keygen()}>
						<Fable
							image={thumbnail}
							name={title}
							width={width}
							key={keygen()}
							edit={true}
						/>
					</Center>
				))}
				<NewFable />
				{testArr.map((index) => (
					<Center key={keygen()}>
						<BlankFable />
					</Center>
				))}
			</Flex>

			<Modal isOpen={modal} onClose={() => setModal(false)} size={'full'}>
				<Modal.CloseButton />
				<Modal.Body _text={{ color: 'white' }}>
					<NewSeries />
				</Modal.Body>
			</Modal>
		</ScrollView>
	);
};
// export const Library = () => {
// return (
//  <Box w={props.width}></Box>
// )
// }

export default () => {
	return (
		<NativeBaseProvider>
			<Center flex={1}>
				<Create />
			</Center>
		</NativeBaseProvider>
	);
};
