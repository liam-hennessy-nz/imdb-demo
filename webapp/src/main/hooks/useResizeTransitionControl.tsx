import { useEffect } from 'react';

interface UseResizeTransitionControlProps {
	className?: string;
	timeoutDuration?: number;
	targetElement?: HTMLElement;
}

function useResizeTransitionControl({
	className = 'resize-active',
	timeoutDuration = 200,
	targetElement = document.body,
}: UseResizeTransitionControlProps = {}) {
	useEffect(() => {
		let resizeTimer: number;

		function handleResize() {
			requestAnimationFrame(() => {
				targetElement.classList.add(className);
				clearTimeout(resizeTimer);
				resizeTimer = window.setTimeout(() => {
					targetElement.classList.remove(className);
				}, timeoutDuration);
			});
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			clearTimeout(resizeTimer);
			targetElement.classList.remove(className);
		};
	}, [className, timeoutDuration, targetElement]);
}

export default useResizeTransitionControl;
