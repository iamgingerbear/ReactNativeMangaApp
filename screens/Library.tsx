import React, { useState, useEffect } from 'react';
import { Center, NativeBaseProvider, Flex, Box, ScrollView } from 'native-base';

import Fable from '../components/Fable';
import { useBreakpointValue } from 'native-base';
import keygen from '../utility/keygen';
import db from '../db/db';
import genres from '../constants/genres';
import { useIsFocused } from '@react-navigation/native';

// TODO: use width value to determine if items displayed are a multiple of columns, if not add blank fables to fix layout
// display user library
export const Library = () => {
	const isFocused = useIsFocused();
	const [data, setData] = useState([]);
	const columns = useBreakpointValue({
		base: 2,
		sm: 3,
		md: 4,
		lg: 5,
		xl: 6,
	});

	const BlankFable = () => {
		return <Box w={width} />;
	};

	useEffect(() => {
		db.getFables().then((res) => setData(res));
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

	// if (!data) return null
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
				{data.map((item) => (
					<Center key={keygen()}>
						<Fable
							image={item.thumbnail}
							name={item.title}
							width={width}
							key={keygen()}
						/>
					</Center>
				))}
				{testArr.map(() => (
					<Center key={keygen()}>
						<BlankFable />
					</Center>
				))}
			</Flex>
		</ScrollView>
	);
};

export default () => {
	return (
		<NativeBaseProvider>
			<Center flex={1}>
				<Library />
			</Center>
		</NativeBaseProvider>
	);
};
