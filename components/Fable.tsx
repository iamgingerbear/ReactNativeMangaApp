import React from 'react';
import {
	Box,
	AspectRatio,
	Image,
	Center,
	NativeBaseProvider,
	Pressable,
} from 'native-base';

import keygen from '../utility/keygen';
import { useNavigation } from '@react-navigation/native';

// interface Props {
//   image: string,
//   name: string,
//   width: string[]
// }
// TODO: add image alt tag
// fable card, displays image + fable title
export const Fable = (props: any) => {
	const navigation = useNavigation();
	// console.log(`rending fable ${props.name}`)
	const webTitle = props.name.replace(/[^A-Za-z0-9]+/g, '');
	const open = () => {
		navigation.navigate(`ChapterSelect`, {
			webTitle: webTitle,
			edit: props.edit,
		});
		// props.navigation.navigate('ChapterSelectScreen', )
	};
	return (
		// hacky layout, functions like border-box
		<Pressable onPress={open}>
			<Box width={props.width} py={2} px={1}>
				<Box rounded='lg' overflow='hidden'>
					{/* image */}
					<AspectRatio ratio={3 / 4} key={keygen()}>
						<Image
							source={{
								uri: props.image,
							}}
							resizeMode='cover'
							alt={props.name}
						/>
					</AspectRatio>

					{/* text */}
					<Center
						// create a black to transparent gradient behind the text to assist in readability
						bg={{
							linearGradient: {
								colors: [
									'muted.900',
									'rgba(0,0,0,0.8)',
									'rgba(0,0,0,0.5)',
									'transparent',
								],
								start: [0.5, 0.2],
								end: [0.5, 0],
							},
						}}
						_text={{
							color: 'muted.50',
							fontWeight: '700',
							fontSize: 'md',
						}}
						position='absolute'
						w='100%'
						bottom='0'
						py='1.5'
						paddingTop='2.5'
						textAlign='center'>
						{props.name}
					</Center>
				</Box>
			</Box>
		</Pressable>
	);
};

// *IMPORTANT* add expo gradient to nativebaseprovider provider config
const config = {
	dependencies: {
		'linear-gradient': require('expo-linear-gradient').LinearGradient,
	},
};
const exp = (props) => {
	return (
		<NativeBaseProvider config={config}>
			<Center flex={1}>
				<Fable
					image={props.image}
					name={props.name}
					navigation={props.navigation}
					width={props.width}
					edit={props.edit}
				/>
			</Center>
		</NativeBaseProvider>
	);
};

export default React.memo(exp);
