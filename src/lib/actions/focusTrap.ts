/**
 * Traps focus within a given node.
 *
 * @param {HTMLElement} node The node to trap focus within.
 * @returns {object} A Svelte action object with a destroy method.
 */
export function focusTrap(node: HTMLElement) {
	const previous = document.activeElement as HTMLElement;

	/**
	 * Handles keydown events to trap focus.
	 *
	 * @param {KeyboardEvent} e The keyboard event.
	 */
	function keydown(e: KeyboardEvent) {
		if (e.key !== 'Tab') return;

		const current = document.activeElement;

		const elements = node.querySelectorAll(
			'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
		);
		const first = elements[0] as HTMLElement;
		const last = elements[elements.length - 1] as HTMLElement;

		if (e.shiftKey && current === first) {
			last.focus();
			e.preventDefault();
		}

		if (!e.shiftKey && current === last) {
			first.focus();
			e.preventDefault();
		}
	}

	document.addEventListener('keydown', keydown);

	return {
		destroy() {
			document.removeEventListener('keydown', keydown);
			if (previous) {
				previous.focus();
			}
		}
	};
}
