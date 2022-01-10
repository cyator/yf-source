import React from 'react';

interface Props {
	name: string;
	badge?: number;
}

function PageTitle({ name, badge }: Props) {
	return (
		<div>
			<h6 className="font-weight-bold">
				{badge ? `${name} (${badge})` : `${name}`}
			</h6>
		</div>
	);
}

export default PageTitle;
