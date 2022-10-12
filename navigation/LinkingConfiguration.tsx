/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

//this fucked
const linking = {
	prefixes: [Linking.makeUrl('/')],
	config: {
		screens: {
			Root: {
				screens: {
					Home: '',
					Library: 'Library/:user',
					Create: 'Create/:user',
				},
			},
			Modal: 'modal',
			// NotFound: '*',
			ChapterSelect: 'fable/:webTitle',
			ReadFable: 'fable/:webTitle/:chapterNum',
		},
	},
};

export default linking;
