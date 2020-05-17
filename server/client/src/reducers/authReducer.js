import { FETCH_CURRENT_USER, LOGOUT_USER_AUTHENTICATED } from '../actions/types';

export default function(state = null, action) {
	switch (action.type) {
		case LOGOUT_USER_AUTHENTICATED:
		case FETCH_CURRENT_USER:
			return action.payload || null;
		default:
			return state;
	}
}