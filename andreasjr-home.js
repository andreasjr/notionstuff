window.addEventListener('load', () => {
	closeSidebar();
	// createFooter();
});

function closeSidebar() {
	// Select the node that will be observed for mutations
	const targetNode = document.getElementById("notion-app");

	// Options for the observer (which mutations to observe)
	const config = { attributes: true, childList: true, subtree: true };

	// Callback function to execute when mutations are observed
	const callback = (mutationList, observer) => {
	  let notionButton = document.querySelector('.notion-close-sidebar[style*="opacity: 1"]')?.click();
	};

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);
}
function createFooter() {
	document.getElementById('andreasjr-footer').innerHTML = `
	<div class="content">
		<div class="col">
			<a href="/"><img src="/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F2a4f1a11-0ebe-4a3a-84f0-c5477f6aa6af%2F1f6732d8-7383-4494-8010-bf3ff9336160%2F3fbe56a9-ac9c-47e1-a05d-614bb38696b8.png?id=f6a87184-dc71-4f41-afc4-2f66df49e92c&table=block&spaceId=2a4f1a11-0ebe-4a3a-84f0-c5477f6aa6af&favicon=true&userId=&cache=v2" class="logo" /></a>
			<h3>Andreas Reif</h3>
		</div>
		<div class="col">
			<ul>
				<li><a href="/about-me">About</a></li>
				<li><a href="/image-gallery">Gallery</a></li>
				<li><a href="/blogroll">Blog</a></li>
				<li><a href="/contact">Contact</a></li>
			</ul>
		</div>
		<div class="col">
		</div>
	</div>`;
}