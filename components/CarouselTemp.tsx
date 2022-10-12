import React, {useEffect} from 'react';
import { StyleSheet, Dimensions, Pressable , ImageBackground} from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Center, NativeBaseProvider, View, Box, Image } from 'native-base';
import originalShowcase from './originalShowcase';
import keygen from '../utility/keygen';
import { useNavigation } from '@react-navigation/native';
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
	const navigation = useNavigation()


	const handlePress = (name) => {
		console.log(name)
		navigation.navigate(`ChapterSelect`, {
			webTitle: name,
		});
	}

	
	return (
		<View style={styles.container}>
			<SwiperFlatList
			style={styles.flatlist}
				autoplay
				autoplayDelay={5}
				autoplayLoop
				renderAll
				index={1}
				showPagination
				paginationStyleItem={styles.pagination}
				paginationStyleItemActive={styles.active}	
				autoplayLoopKeepAnimation
				data={originalShowcase}
				renderItem={({ item }) =>  (
					
							<Pressable onPress={()=> handlePress(item.name)}>
							<ImageBackground style={[styles.image]} source={item.path} >
							<Box
								minH={height/3}
								minW={width}
							/>
							</ImageBackground>
							</Pressable>
				
					)
				}
			/>
		</View>
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

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: width,
	},
	flatlist:{
		width:width,
		height:height/3
	},
	image: {
		justifyContent: "center",
		resizeMode:'cover',
	},
	pagination: {
		width:"5vw",
		height:"1.5vh",
		maxWidth:"50px",
		maxHeight:"15px"
	},
	active: {
		backgroundColor:"white",
		borderColor:"#0c4a6e"

	}
});
// export default React.memo(exp);
export default exp;
