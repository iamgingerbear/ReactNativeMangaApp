import React, { useRef, useState, useEffect } from 'react';
import {
	Box,
	FlatList,
	Heading,
	Center,
	NativeBaseProvider,
	HStack,
	Pressable,
	useBreakpointValue,
	Button,
	Icon,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import Fable from './Fable';
import keygen from '../utility/keygen';

interface Props {
	name: string;
	data: String[];
}
// TODO:
// make util for fable width

// xs, sm, md, lg
const width = ['50vw', '33.3vw', '25vw', '20vw', '213.33'];

// temp maxwidth is 1280px
export const Genre = (props: Props) => {
	// const data = props.data.concat(props.data.concat(props.data))
	const data = props.data;
	const genre = useRef(null);
	let currIndex = 0;
	let length = data.length;

	const shown = useBreakpointValue({
		base: 2,
		sm: 3,
		md: 4,
		lg: 5,
		xl: 6,
	});

	//   useEffect(() => {
	//   db.getGenre(props.name).then(res=> {
	//     setData(res)
	//     })
	// }, [])

	// pagination controls with edgecases for end/start of list
	const scroll = (dir: string) => {
		if (typeof genre.current != null) {
			if (dir == 'next') {
				if (currIndex + shown + shown <= length) {
					genre.current.scrollToIndex({ index: currIndex + shown });
					currIndex += shown;
				} else {
					// console.log(`scrolling to end`)
					// genre.current.scrollToIndex({index:length-1})
					// currIndex = length-1
					genre.current.scrollToEnd();
				}
			} else {
				if (currIndex - shown >= 0) {
					// console.log(`scrolling back ${shown}`)
					genre.current.scrollToIndex({ index: currIndex - shown });
					currIndex -= shown;
				} else {
					// console.log(`scrolling to start`)
					genre.current.scrollToIndex({ index: 0 });
					currIndex = 0;
				}
			}
		}
	};
	if (data.length == 0) return null;

	return (
		<Box w={'100vw'} alignItems='center'>
			<HStack flex={1} w='95vw' maxW='1280'>
				{/* genre name */}
				<Heading
					fontSize='xl'
					maxW='1200'
					w='100vw'
					alignSelf='flex-start'
					color='white'
					pb='2'>
					{props.name}
				</Heading>
				<Box alignSelf='flex-end' key={keygen()}>
					<HStack space='2' alignItems='center'>
						<Button
							onPress={() => {
								scroll('prev');
							}}
              p={1}
              bg={"info.900"}>
							<Icon
								as={Ionicons}
								name='caret-back-outline'
								color={'white'}
								justifySelf={'center'}
								size={'7'}
							/>
						</Button>
						<Button
            
							onPress={() => {
								scroll('next');
							}}
              p={1}
              bg={"info.900"}>
							<Icon
								as={Ionicons}
								name='caret-forward-outline'
								color={'white'}
								justifySelf={'center'}
								size={'7'}
                
							/>
						</Button>
					</HStack>
				</Box>
			</HStack>
			{/* list fables in genre */}
			<FlatList
				ref={genre}
				horizontal
				maxW='1280'
				w='100%'
				scrollEnabled={true}
				disableScrollViewPanResponder
				pagingEnabled
				decelerationRate='fast'
				initialScrollIndex={0}
				showsHorizontalScrollIndicator={false}
				data={data}
				renderItem={({ item }) => (
					<Fable
						image={item.thumbnail}
						name={item.title}
						width={width}
					/>
				)}
				keyExtractor={() => keygen()}
			/>
		</Box>
	);
};

const exp = (props: Props) => {
	return (
		<NativeBaseProvider>
			<Center pt='2'>
				<Genre name={props.name} data={props.data} />
			</Center>
		</NativeBaseProvider>
	);
};

export default React.memo(exp);
