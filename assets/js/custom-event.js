export default function triggerCustomEvent(target, name, data) {
	target.dispatchEvent(new CustomEvent(name, {detail: data}));
}