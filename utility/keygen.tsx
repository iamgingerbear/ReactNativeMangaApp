import uuid from 'react-native-uuid';

let keygen = () => {
	return uuid.v4().toString() + Date().toString();
};

export default keygen;
