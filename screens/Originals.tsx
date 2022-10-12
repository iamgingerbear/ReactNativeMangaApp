import React, { useEffect, useState } from 'react';
import { Center, ScrollView, Box } from 'native-base';
import 'react-native-gesture-handler';
import Genre from '../components/Genre';
import originalShowcase from '../components/originalShowcase';
import keygen from '../utility/keygen';
import db from '../db/db';
import genres from '../constants/genres';
import { useIsFocused } from '@react-navigation/native';
// import Carousel from '../components/Carousel';
import Carousel from '../components/Carousel';

const Originals = ({ navigation }) => {
	const isFocused = useIsFocused();
	const [data, setData] = useState([]);
	const [tags, setTags] = useState([]);
	const [test, setTest] = useState([]);
	const [renderBanner, setRenderBanner] = useState(false)
	
	useEffect(() => {
		if (isFocused) {
			setRenderBanner(true)
			db.getFables().then((res) => setData(res));

			let RA = [];
			for (let i in genres.genres) {
				RA.push(genres.genres[i]);
			}
			setTags(RA);
		}
		if(!isFocused) setRenderBanner(false)
	}, [, isFocused]);

	useEffect(() => {
		let objReturn = [];

		tags.map((tag) => {
			// let objTest = []

			objReturn.push(data.filter((item) => item.genreMain === tag));
		});
		setTest(objReturn);
	}, [data]);


	if (tags === [] || data === [] || test === []) return null;
	// console.log('loading orginals');
	// data.filter(item => console.log(item.genreMain === 'Action'))
	return (
		<ScrollView
			maxH='100vh'
			showsVerticalScrollIndicator={false}
			bgColor={'muted.900'}>
			{renderBanner && <Carousel banners={originalShowcase} />}
			<Box
				flexWrap='wrap'
				alignItems='center'
				justifyContent='space-between'
				maxW='1200'>
				{test.map((item, index) => (
					<Center key={keygen()}>
						<Genre
							name={tags[index]}
							data={item}
							navigation={navigation}
							key={keygen()}
						/>
					</Center>
				))}
			</Box>
		</ScrollView>
	);
};
export default Originals;
