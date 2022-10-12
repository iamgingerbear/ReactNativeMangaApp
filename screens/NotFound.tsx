import * as React from 'react';
import { Text, View, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const NotFoundScreen = () => {
	const navigation = useNavigation()
	// const handleNav = () => navigation.navigate('Root')
	return (
		<View
			flex={1}
			alignItems={'center'}
			justifyContent={'center'}
			p={20}
			bg={'muted.800'}>
			<Text fontSize={'lg'} fontWeight={'bold'}>
				This screen doesn&apos;t exist.
			</Text>
			<Button onPress={() => console.log('oops')}>
				Go to home screen!
				</Button>
		</View>
	);
};

export default NotFoundScreen;
