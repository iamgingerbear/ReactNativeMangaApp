import React, { useRef, useState, useEffect } from 'react';
import {
	Box,
	FlatList,
	HStack,
	VStack,
	Center,
	NativeBaseProvider,
	Image,
	AspectRatio,
	useBreakpointValue,
	View,
} from 'native-base';
import { ImageBackground, StyleSheet, Dimensions } from 'react-native';
import keygen from '../utility/keygen';
import { Pressable } from 'react-native';
import originalShowcase from './originalShowcase';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import useForceUpdate from '../hooks/useForceUpdate';

interface Props {
	banners: {
		path: string;
		name: string;
	}[];
}

// TODO:
//      implement useBreakpointValue to scale banner better on smaller screens
//      assign better colour for pagination markers

// main carousel components
export const Carousel = (props: Props) => {
	const focus = useIsFocused();
	const forceUpdate = useForceUpdate();
	const [data, setData] = useState(originalShowcase);
	//use ref allows flatlist to be controlled via another component
	const bannerIndex = useRef(null);
	const { width } = Dimensions.get('window');
	let currIndex = 0;
	// const [Fire, setFire] = useState(true)
	const [active, setActive] = useState(0);
	const navigation = useNavigation();

	const height = useBreakpointValue({
		base: '33vh',
		// lg: '20vw',
	});
	const heightRatio = useBreakpointValue({
		base: 9,
		lg: 6,
	});

	useEffect(() => {
		let auto = setInterval(autoScroll, 3000);
		const unsubscribe = navigation.addListener('focus', () => {
			// forceUpdate;
			// console.log('carousel re-render')
			// let auto = setInterval(autoScroll, 6000)
		});
		return () => {
			clearInterval(auto);
			unsubscribe;
		};
	}, [navigation]);

	//paginated function, set to scroll banner to
	const onButtonClick = (num: number) => {
		// console.log(num)
		if (typeof bannerIndex != null) {
			currIndex = num;
			if (num == 2) {
				// console.log("scroll to end")
				setActive(2);
				// bannerIndex.current.scrollToEnd();
			} else {
				// bannerIndex.current.scrollToIndex({ index: num });
				setActive(num);
			}
		}
	};

	const autoScroll = () => {
		// if(!focus)return null
		if (!bannerIndex.current) {
			return;
		}
		// console.log('in scroll')
		let scroll = currIndex;
		if (scroll == data.length - 1) {
			scroll = 0;
		} else {
			scroll++;
		}
		// console.log(`currIndex = ${currIndex} scroll: ${scroll}`)
		currIndex = scroll;
		setActive(scroll);
		// bannerIndex.current.scrollToIndex({ index: scroll });
	};

	useEffect(() => {
		bannerIndex.current.scrollToIndex({ index: active });
	}, [active]);

	const PageButton = (props: { index: number }) => {
		// console.log(props.index)

		let colour = props.index === active ? 'info.800' : 'dimgray';
		return (
			<Pressable
				hitSlop={5}
				onPress={() => {
					onButtonClick(props.index);
					// TODO: assign better colour for pagination markers
				}}
				key={keygen()}>
				<Box h='1vh' w={width/3.02}maxW={1280/3.02} bgColor={colour} rounded={'sm'}></Box>
			</Pressable>
		);
	};
	const Buttons = (props: any) => {
		return (
			<HStack
				flex={1}
				justifyContent='space-between'
				alignItems={'center'}
				maxW={1280}
				w='100%'
				pt='1vh'
				pb={4}>
				
				{data.map((item, index) => {
					return <PageButton index={index} key={keygen()} />;
				})}
			</HStack>
		);
	};

	if (!data) return null;
	// console.log('render carousel')
	return (
		<VStack w='100vw' alignItems='center' h={height}>
			{/* sets list up for pagination, disable scroll etc */}
			<FlatList
				ref={bannerIndex}
				horizontal
				maxW='100vw'
				h={height}
				scrollEnabled={true}
				disableScrollViewPanResponder
				pagingEnabled
				decelerationRate='fast'
				initialScrollIndex={0}
				showsHorizontalScrollIndicator={false}
				data={data}
				renderItem={({ item }) => (
					<View style={styles.container}>
						<ImageBackground
							style={[styles.image, { height: height }]}
							source={item.path}
							key={keygen()}>
							{/* <AspectRatio ratio={12 / heightRatio} key={keygen()}> */}
							<Box minH={'33vh'} minW={'100vw'} />
							{/* </AspectRatio> */}
						</ImageBackground>
					</View>
				)}
				keyExtractor={() => keygen()}
			/>
			<Buttons bannerIndex={bannerIndex} />
		</VStack>
	);
};

const exp = (props: Props) => {
	return (
		<NativeBaseProvider>
			<Center mb={5}>
				<Carousel banners={props.banners} />
			</Center>
		</NativeBaseProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		// flex: 1,
		justifyContent: 'center',
		resizeMode: 'cover',
	},
});

export default React.memo(exp);
// export default exp;
