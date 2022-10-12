import React from 'react';
import {
	NativeBaseProvider,
	extendTheme,
} from 'native-base';
import useColorScheme from './hooks/useColorScheme';


import Navigation from './navigation/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';


// db.getFable(Test.title).then(res => console.log(res))
// db.addChapter(Test.title, chapter)
// db.removeFable("Eternal Blade").then(res => console.log(res))
// db.addFable(Test).then(res => console.log(res))
// db.addFable(Test2).then(res => console.log(res))

// Define the config
const config = {
	useSystemColorMode: false,
	initialColorMode: 'dark',
};

// extend the theme
export const theme = extendTheme({ config });

export default function App() {
	const colorScheme = useColorScheme();

	return (
		<SafeAreaProvider style={{ overflow: 'hidden' }}>
			<NativeBaseProvider theme={theme}>
				<Navigation colorScheme={colorScheme} />

				{/* hide scrollbar on web */}
				{/* <Hidden platform={['android', 'ios']}>
          <RemoveScrollBar />
        </Hidden> */}
			</NativeBaseProvider>
		</SafeAreaProvider>
	);
}
