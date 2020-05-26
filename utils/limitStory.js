module.exports = limitStory = (story, limit = 200) => {
	const limitedStory = [];
	if (story.length > limit) {
		story.split(' ').reduce((acc, cur) => {
			if (acc + cur.length < limit) {
				limitedStory.push(cur);
			}
			return acc + cur.length;
		}, 0);

		return `${limitedStory.join(' ')}...`;
	}
	return limitedStory;
};
